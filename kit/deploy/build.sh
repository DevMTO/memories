#!/bin/bash
# Build y publicación en el VPS. Lo lanza <unit>-build.service, desde
# <unit>-build.path (botón "Publicar", webhook de push a la rama de deploy y
# botón "Vista previa"); ver kit/deploy/README.md. Después de publicar rearma la
# vista previa (editor.<dominio> solo sirve esa) y, si cambió el contenido, hace
# una copia de seguridad de PocketBase.
#
# Variables (build.env o el Environment= del servicio):
#   APP            nombre del sitio en el VPS (obligatoria): /srv/$APP, /etc/$APP
#   PB_PORT        puerto local de PocketBase (8090)
#   PB_SERVICE     servicio de systemd de PocketBase (pocketbase)
#   DEPLOY_BRANCH  rama que se publica (deploy)
#
# Dónde ven el sitio los visitantes (opcional; sin ninguno, solo en el VPS):
#   CF_PAGES_PROJECT, CLOUDFLARE_*   Cloudflare Pages (cloudflare.env)
#   CPANEL_FTP_HOST, CPANEL_FTP_USER, CPANEL_FTP_PASSWORD, CPANEL_FTP_DIR (/)
#                                    hosting compartido con cPanel, por FTPS
#                                    (cpanel.env; ver kit/deploy/cpanel.md)
#
# Todo va dentro de main: bash lee el script mientras corre y git reset lo
# puede cambiar a mitad de camino.
set -Eeuo pipefail

: "${APP:?Falta APP (nombre del sitio en el VPS)}"
PB_PORT=${PB_PORT:-8090}
PB_SERVICE=${PB_SERVICE:-pocketbase}
DEPLOY_BRANCH=${DEPLOY_BRANCH:-deploy}
PB_API=http://127.0.0.1:$PB_PORT/api

BASE=/srv/$APP
REPO=$BASE/repo
PB=$BASE/pocketbase
REQUESTS=$BASE/build/requests
DEPLOYED=$BASE/build/deployed
LOG=$BASE/build/last.log
# Copia de lo último subido por FTPS (deploy_ftp compara contra esto).
FTP_STATE=$BASE/build/ftp-state
# Lo subido por FTPS en el mes (bytes): es tráfico de salida de la VM.
EGRESS=$BASE/build/egress-$(date +%Y-%m)
# Marca que reescribe PocketBase con cada cambio de contenido
# (kit/pocketbase/core/hooks/content.pb.js).
CONTENT_STAMP=$BASE/build/content-changed
# Última vista previa: "<commit> <inicio en segundos>".
PREVIEW_STATE=$BASE/build/preview-state
# Última copia de seguridad por publicación: su inicio en segundos.
BACKUP_STATE=$BASE/build/backup-state
TEMPLATES=$REPO/kit/deploy/templates

ids=''          # publicaciones (botón Publicar o webhook)
push_ids=''     # push a deploy (webhook): construyen solo si el diff afecta al sitio
preview_ids=''  # vistas previas
preview_translate=''  # alguna pidió traducir los textos nuevos
preview_auto=''  # vista previa sin pedido del editor (después de restaurar una copia)
forced=''
active=''       # a quién se le reporta el estado del build en curso
cache_before='' cache_after=''  # caché de traducciones antes y después de publicar

# Rutas que SÍ afectan al build. Si se agrega algo nuevo en la raíz que el
# build necesite, hay que agregarlo aquí o no se publicará al hacer push.
BUILD_PATHS=(
  kit
  src
  public
  pocketbase
  astro.config.mjs
  tsconfig.json
  package.json
  package-lock.json
)

report() {
  local body
  body=$(node -e 'process.stdout.write(JSON.stringify({ status: process.argv[1], message: process.argv[2] || "" }))' "$1" "${2:-}")
  for id in $active; do
    curl -fsS -X POST "$PB_API/publish/$id/status" \
      -H 'Content-Type: application/json' \
      -H "X-Publish-Secret: $PUBLISH_CALLBACK_SECRET" \
      -d "$body" >/dev/null || true
  done
}

# Un comando que falla sin decir nada (p. ej. con su stderr a /dev/null) dejaría el
# log sin la causa: se escribe cuál fue y dónde. La pausa deja que tee termine de
# escribir el log antes de mandarlo a /admin.
on_error() {
  echo "Falló en la línea $1 de build.sh: $2" >&2
  # También salta dentro de $(…): se avisa a /admin una sola vez, desde el script.
  [ "$BASH_SUBSHELL" -eq 0 ] || return 0
  sleep 1
  report failed "$(tail -c 1500 "$LOG")"
}

# Binario, migraciones y hooks de PocketBase al día con el repo: las migraciones y
# hooks son los del kit (módulos de pocketbase/kit.json) más los del proyecto. Se
# compara con lo instalado (no con el diff de git), así un build también repara
# lo que haya quedado distinto; si no hay nada que cambiar, no reinicia.
update_pocketbase() {
  local version run
  version=$(cat pocketbase/version)
  run=$(mktemp -d)
  node kit/pocketbase/scripts/pocketbase.ts assemble "$run"
  if [ "$("$PB/bin/pocketbase" --version 2>/dev/null | awk '{print $3}')" == "$version" ] &&
    diff -rq "$run/pb_migrations" "$PB/pb_migrations" >/dev/null 2>&1 &&
    diff -rq "$run/pb_hooks" "$PB/pb_hooks" >/dev/null 2>&1; then
    rm -rf "$run"
    return
  fi
  if [ "$("$PB/bin/pocketbase" --version 2>/dev/null | awk '{print $3}')" != "$version" ]; then
    echo "Descargando PocketBase $version…"
    local tmp
    tmp=$(mktemp -d)
    curl -fsSL -o "$tmp/pb.zip" "https://github.com/pocketbase/pocketbase/releases/download/v$version/pocketbase_${version}_linux_amd64.zip"
    unzip -q "$tmp/pb.zip" pocketbase -d "$tmp"
    mkdir -p "$PB/bin"
    mv "$tmp/pocketbase" "$PB/bin/pocketbase"
    rm -rf "$tmp"
  fi
  rsync -a --delete "$run/pb_migrations" "$run/pb_hooks" "$PB/"
  rm -rf "$run"
  sudo systemctl restart "$PB_SERVICE"
  for _ in $(seq 30); do
    curl -fsS "$PB_API/health" >/dev/null 2>&1 && return
    sleep 1
  done
  echo 'PocketBase no respondió después de reiniciar.' >&2
  return 1
}

# Cloudflare Pages (kit/deploy/cloudflare-pages.md): el sitio con un _redirects
# que manda /admin a EDITOR_URL (el editor, donde la vista previa está en el
# mismo origen) y un _headers con la caché de /_astro/, por wrangler. Sin CF_PAGES_PROJECT (cloudflare.env) no hace nada.
deploy_pages() {
  [ -n "${CF_PAGES_PROJECT:-}" ] || return 0
  echo 'Subiendo el sitio a Cloudflare Pages…'
  printf '/admin %s/admin/ 302\n/admin/* %s/admin/:splat 302\n' "$EDITOR_URL" "$EDITOR_URL" > dist/_redirects
  printf '/_astro/*\n  Cache-Control: public, max-age=31536000, immutable\n' > dist/_headers
  if ! WRANGLER_SEND_METRICS=false npx wrangler pages deploy dist --project-name "$CF_PAGES_PROJECT" --branch main --commit-hash "$new"; then
    echo 'El sitio nuevo ya está en el VPS, pero no se pudo subir a Cloudflare Pages: los visitantes siguen viendo el anterior. Volver a publicar.' >&2
    return 1
  fi
}

# Hosting compartido con cPanel (kit/deploy/cpanel.md): el sitio y su .htaccess
# por FTPS a CPANEL_FTP_DIR. Cada build cambia la fecha de todos los archivos, así
# que se compara por contenido contra FTP_STATE (lo último subido) y solo viajan
# los archivos nuevos o cambiados: el tráfico de salida del VPS es limitado. Sube
# primero lo que no es HTML, después el HTML (una página nunca llega antes que
# sus archivos) y al final borra lo que ya no está. Lo que no salió de aquí
# (.well-known de AutoSSL, cgi-bin, otros archivos) no se toca. Sin
# CPANEL_FTP_HOST (cpanel.env) no hace nada.
deploy_ftp() {
  [ -n "${CPANEL_FTP_HOST:-}" ] || return 0
  echo 'Subiendo el sitio al hosting por FTPS…'
  local dir=${CPANEL_FTP_DIR:-/} work line item path
  dir=${dir%/}
  work=$(mktemp -d)

  # Lo que tiene que quedar en el hosting: el sitio más los .htaccess.
  rsync -a dist/ "$work/site/"
  sed "s|@EDITOR_URL@|$EDITOR_URL|g" "$TEMPLATES/public.htaccess.in" > "$work/site/.htaccess"
  if [ ! -e dist/404.html ]; then sed -i '/^ErrorDocument 404/d' "$work/site/.htaccess"; fi
  if [ -d dist/_astro ]; then cp "$TEMPLATES/public-astro.htaccess" "$work/site/_astro/.htaccess"; fi

  mkdir -p "$FTP_STATE"
  local -a assets=() pages=() gone=()
  while IFS= read -r line; do
    item=${line%% *}
    path=${line#* }
    if [[ $item == '*deleting' ]]; then
      path=${line#\*deleting }
      path=${path#"${path%%[! ]*}"}
      gone+=("$path")
    elif [[ $item == ?f* ]]; then
      if [[ $path == *.html ]]; then pages+=("$path"); else assets+=("$path"); fi
    fi
  done < <(rsync -rcn --delete --out-format='%i %n' "$work/site/" "$FTP_STATE/")

  if [ ${#assets[@]} -eq 0 ] && [ ${#pages[@]} -eq 0 ] && [ ${#gone[@]} -eq 0 ]; then
    echo 'El hosting ya tiene este sitio.'
    rm -rf "$work"
    return 0
  fi

  # Guion de lftp: carpetas, archivos (HTML al final) y borrados. Una carpeta
  # que todavía tiene algo ajeno al sitio no se borra (`|| echo`).
  {
    echo 'set cmd:fail-exit yes'
    echo 'set ftp:ssl-force yes'
    echo 'set ftp:ssl-protect-data yes'
    echo 'set net:max-retries 3'
    echo 'set net:timeout 30'
    echo 'set net:reconnect-interval-base 5'
    echo "open --env-password -u \"$CPANEL_FTP_USER\" \"$CPANEL_FTP_HOST\""
    for path in "${assets[@]}" "${pages[@]}"; do
      if [[ $path == */* ]]; then echo "mkdir -fp \"$dir/${path%/*}\""; fi
    done | sort -u
    for path in "${assets[@]}" "${pages[@]}"; do
      echo "put \"$work/site/$path\" -o \"$dir/$path\""
    done
    for path in "${gone[@]}"; do
      if [[ $path == */ ]]; then
        echo "rmdir \"$dir/${path%/}\" || echo \"(queda $dir/${path%/}: no está vacía)\""
      else
        echo "rm -f \"$dir/$path\""
      fi
    done
  } > "$work/upload.lftp"

  local bytes
  bytes=$(cd "$work/site" && printf '%s\0' "${assets[@]}" "${pages[@]}" | du -cb --files0-from=- 2>/dev/null | tail -1 | cut -f1)
  echo "FTPS: ${#assets[@]} archivos, ${#pages[@]} páginas, ${#gone[@]} borrados ($(mb "${bytes:-0}"))."
  if ! LFTP_PASSWORD=$CPANEL_FTP_PASSWORD lftp -f "$work/upload.lftp"; then
    rm -rf "$work"
    echo 'No se pudo subir el sitio nuevo al hosting: los visitantes siguen viendo el anterior (o una mezcla, si se cortó a mitad). Volver a publicar.' >&2
    return 1
  fi
  rsync -a --delete "$work/site/" "$FTP_STATE/"
  rm -rf "$work"
  # Total del mes: el nivel gratuito de Google Cloud tiene 1 GB de salida al mes
  # para toda la VM (todos los sitios; ver "Nivel gratuito" en kit/deploy/vps.md).
  local month=$(( $(cat "$EGRESS" 2>/dev/null || echo 0) + ${bytes:-0} ))
  echo "$month" > "$EGRESS"
  echo "Subidos $(mb "${bytes:-0}"); este sitio lleva $(mb "$month") en el mes."
}

mb() {
  awk -v b="$1" 'BEGIN { printf "%.1f MB", b / 1048576 }'
}

# Copia pública del sitio: Cloudflare Pages y/o el hosting compartido, según lo
# que esté configurado.
deploy_public() {
  deploy_pages
  deploy_ftp
}

# Vista previa: el sitio con lo guardado, ocultos incluidos (se lee como el
# editor) y con marcas invisibles para la pestaña Traducciones, en otra carpeta.
# El servidor web la sirve en las mismas URLs a quien tenga la cookie con
# PREVIEW_KEY. Usa el código ya publicado y la misma caché de traducciones; solo
# llama al traductor si el editor lo pidió (preview-<id>-translate).
build_preview() {
  active=$preview_ids
  echo "Vista previa ($(date -Is))"
  report building
  local token start
  start=$(date +%s)
  # Token del editor que da PocketBase con el secreto del build (no hace falta su
  # contraseña, que el editor cambia en /admin).
  token=$(curl -fsS -X POST "$PB_API/preview/token" \
    -H "X-Publish-Secret: $PUBLISH_CALLBACK_SECRET" |
    node -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => process.stdout.write(JSON.parse(s).token))')
  local offline=1
  if [ -n "$preview_translate" ]; then offline=0; fi
  POCKETBASE_TOKEN=$token PREVIEW=1 TRANSLATE_OFFLINE=$offline npm run build -- --outDir dist-preview
  mkdir -p "$BASE/preview"
  rsync -a --delete-after --delay-updates dist-preview/ "$BASE/preview/"
  echo "$(git rev-parse HEAD) $start" > "$PREVIEW_STATE"
  report done
  echo "Vista previa lista ($(date -Is))"
}

# editor.<dominio> sirve solo la vista previa, así que se rearma después de cada
# publicación, salvo que ya muestre lo mismo: armada con este código, sin cambios
# de contenido desde que empezó (CONTENT_STAMP) y sin traducciones nuevas en esta
# publicación (una vista previa sin traductor mostraría esos textos en el idioma
# de origen).
preview_current() {
  local commit start
  [ -e "$BASE/preview/index.html" ] && [ -f "$PREVIEW_STATE" ] || return 1
  read -r commit start < "$PREVIEW_STATE"
  [ "$commit" == "$(git rev-parse HEAD)" ] &&
    [ "$(mtime "$CONTENT_STAMP")" -lt "${start:-0}" ] &&
    [ "$cache_before" == "$cache_after" ]
}

# Pide a PocketBase el registro de la vista previa automática (para que /admin la
# vea) y la deja en preview_ids; si no puede, la arma igual, sin reportar.
request_auto_preview() {
  preview_ids=$(curl -fsS -X POST "$PB_API/preview/auto" \
    -H "X-Publish-Secret: $PUBLISH_CALLBACK_SECRET" |
    node -e 'let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => process.stdout.write(JSON.parse(s).id))') ||
    preview_ids=''
}

# Copia de seguridad de PocketBase después de una publicación (POST /api/backup):
# queda en la VM (las 5 últimas) y el editor la puede bajar una vez desde /admin.
# Solo si cambió el contenido desde la anterior.
backup_publish() {
  local id=$1 start
  [ -n "$id" ] || return 0
  if [ -f "$BACKUP_STATE" ] && [ "$(mtime "$CONTENT_STAMP")" -lt "$(cat "$BACKUP_STATE")" ]; then
    echo 'Sin cambios de contenido desde la última copia de seguridad: no se hace otra.'
    return 0
  fi
  start=$(date +%s)
  echo 'Copia de seguridad de PocketBase…'
  curl -fsS -X POST "$PB_API/backup" \
    -H 'Content-Type: application/json' \
    -H "X-Publish-Secret: $PUBLISH_CALLBACK_SECRET" \
    -d "{\"publish\":\"$id\"}" >/dev/null
  echo "$start" > "$BACKUP_STATE"
}

# Segundos de la última modificación (0 si no existe).
mtime() {
  stat -c %Y "$1" 2>/dev/null || echo 0
}

# Huella de las traducciones automáticas (<idioma>.json en CACHE_DIR de
# kit/i18n/core.ts), sin las fechas de uso (*.seen.json), la lista de textos ni las
# correcciones: esos cambian con el contenido, que ya cuenta por CONTENT_STAMP.
# Sin caché todavía (primer build, o se borró) da una huella vacía, no un error.
cache_hash() {
  [ -d .cache/i18n ] || { echo 'sin-cache'; return 0; }
  find .cache/i18n -maxdepth 1 -name '*.json' ! -name '*.seen.json' ! -name 'sources.json' -print0 |
    sort -z | xargs -0 -r sha1sum | sha1sum | cut -c1-40
}

changed() {
  [ -z "$old" ] || ! git diff --quiet "$old" "$new" -- "$1" 2>/dev/null
}

# ¿Algo entre lo publicado y deploy afecta al sitio? Si el diff falla (p. ej.
# historia reescrita), cuenta como que sí.
affects_site() {
  [ -z "$old" ] || ! git diff --quiet "$old" "$new" -- "${BUILD_PATHS[@]}" 2>/dev/null
}

main() {
  exec > >(tee "$LOG") 2>&1

  # Un build a la vez en todo el servidor: con varios sitios en un VPS chico, dos
  # builds juntos no entran en la memoria. Mientras espera, las publicaciones
  # siguen "en cola" en /admin y sus pedidos en la carpeta: si el servicio muere
  # esperando, no se pierden. El archivo lo comparten los usuarios de todos los
  # sitios, por eso se crea con permisos para todos.
  local lock=/run/lock/kit-build.lock
  (umask 000 && : >> "$lock") 2>/dev/null || true
  exec 9>>"$lock"
  if ! flock -n 9; then
    echo "Esperando a que termine el build de otro sitio ($(date -Is))…"
    flock 9
  fi

  # Un archivo por pedido: id de la publicación (botón Publicar o webhook),
  # push-<id> (webhook: construye solo si el diff afecta al sitio),
  # preview-<id>[-translate] (vista previa), preview-auto (vista previa que pide
  # PocketBase al arrancar después de restaurar una copia), push-recheck (solo
  # revisa la rama) o cualquier otro nombre (a mano: fuerza build).
  # Se consumen ya con el turno tomado: los que llegaron durante la espera entran
  # en este build, y los que lleguen durante el build quedan en la carpeta para el
  # siguiente (el path unit lo lanza al terminar).
  mkdir -p "$REQUESTS"
  local request
  for request in "$REQUESTS"/*; do
    [ -e "$request" ] || continue
    rm "$request"
    request=${request##*/}
    if [[ $request =~ ^preview-([a-z0-9]{15})(-translate)?$ ]]; then
      preview_ids+="${BASH_REMATCH[1]} "
      if [ -n "${BASH_REMATCH[2]}" ]; then preview_translate=1; fi
      continue
    fi
    if [[ $request == preview-auto ]]; then
      preview_auto=1
      continue
    fi
    if [[ $request =~ ^push-([a-z0-9]{15})$ ]]; then
      push_ids+="${BASH_REMATCH[1]} "
      continue
    fi
    # push-recheck y similares: solo piden revisar la rama.
    if [[ $request == push-* ]]; then continue; fi
    forced=1
    if [[ $request =~ ^[a-z0-9]{15}$ ]]; then ids+="$request "; fi
  done
  trap 'on_error "$LINENO" "$BASH_COMMAND"' ERR

  cd "$REPO"
  # Último commit publicado con éxito, no HEAD: si un build falla después del
  # reset, el siguiente vuelve a correr npm ci y a actualizar PocketBase.
  old=$(cat "$DEPLOYED" 2>/dev/null || true)
  git fetch -q origin "$DEPLOY_BRANCH"
  new=$(git rev-parse FETCH_HEAD)
  # Solo vista previa: nunca publica (ni siquiera commits pendientes de deploy).
  local publish='' check=''
  if { [ -z "$preview_ids" ] && [ -z "$preview_auto" ]; } || [ -n "$push_ids" ]; then check=1; fi
  if [ -n "$forced" ] || { [ -n "$check" ] && { affects_site || [ ! -e "$BASE/site/index.html" ]; }; }; then
    publish=1
  fi

  if [ -n "$publish" ]; then
    active="$ids $push_ids"
    echo "Build de $new ($(date -Is))"
    report building
    git reset -q --hard "$new"

    if [ ! -d node_modules ] || changed package-lock.json; then
      npm ci --no-audit --no-fund
    fi
    update_pocketbase

    cache_before=$(cache_hash)
    npm run build
    cache_after=$(cache_hash)
    rsync -a --delete-after --delay-updates dist/ "$BASE/site/"
    deploy_public
    echo "$new" > "$DEPLOYED"
    local first
    read -r first _ <<< "$ids $push_ids" || true
    if ! backup_publish "${first:-}"; then
      echo 'No se pudo hacer la copia de seguridad (la publicación sí salió).' >&2
    fi
    report done
    echo "Listo ($(date -Is))"
  elif [ -n "$check" ]; then
    # El repo se pone al día igual (este script corre desde ahí); deployed no
    # cambia, así que el próximo build compara contra lo último publicado.
    if [ "$(git rev-parse HEAD)" != "$new" ]; then
      echo "Sin cambios que afecten al sitio, no se reconstruye ($old..$new):"
      git diff --stat "$old" "$new"
      git reset -q --hard "$new"
    fi
    active=$push_ids
    report skipped 'Sin cambios que afecten al sitio.'
  fi

  local auto_preview=''
  if [ -n "$preview_auto" ] && [ -z "$preview_ids" ]; then
    request_auto_preview
    auto_preview=1
  elif [ -n "$publish" ] && [ -z "$preview_ids" ] && [ -n "${PREVIEW_KEY:-}" ]; then
    if preview_current; then
      echo 'La vista previa ya muestra lo publicado: no se rearma.'
    else
      request_auto_preview
      auto_preview=1
    fi
  fi
  if [ -n "$preview_ids" ] || [ -n "$auto_preview" ]; then build_preview; fi

  # Un push mientras PocketBase se reiniciaba no llegó como webhook.
  trap - ERR
  if git fetch -q origin "$DEPLOY_BRANCH" && [ "$(git rev-parse FETCH_HEAD)" != "$new" ]; then
    echo "La rama $DEPLOY_BRANCH avanzó durante el build: se pide otro."
    touch "$REQUESTS/push-recheck"
  fi
}

main "$@"
