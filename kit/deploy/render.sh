#!/bin/bash
# Genera los archivos del VPS de un proyecto a partir de kit/deploy/templates/: los
# servicios de systemd, el Caddyfile, el nginx.conf y la guía de despliegue del sitio
# (despliegue.md). Se commitean en deploy/ del proyecto y se copian al VPS como dice
# cada archivo.
#
#   kit/deploy/render.sh deploy                 → valores de deploy/site.env
#   kit/deploy/render.sh deploy CLAVE=valor…    → esos valores pisan los de site.env
#
# Valores (site.env, sintaxis de shell; ver kit/deploy/README.md):
#   APP          nombre del sitio: /srv/$APP, /etc/$APP (obligatoria)
#   UNIT         prefijo de los servicios de build (<UNIT>-build.*; por defecto APP)
#   USER         usuario del sistema que corre todo (por defecto `sites`, el mismo para
#                todos los sitios de la VM; ver kit/deploy/vps.md)
#   PB_PORT      puerto local de PocketBase (8090; uno distinto por sitio en la VM)
#   PB_SERVICE   nombre del servicio de PocketBase (por defecto <APP>-pocketbase)
#   SITE_HOST    dominio público (example.com)
#   EDITOR_HOST  dominio del editor (por defecto editor.<SITE_HOST>)
#   PB_HOST      dominio de PocketBase (por defecto pb.<SITE_HOST>)
# Solo para despliegue.md (sin SITE_NAME no se genera):
#   SITE_NAME    nombre del sitio
#   PUBLIC       sitio público: cpanel | cloudflare
#   ENABLED_LANGS, DEFAULT_LANG   idiomas de build.env (vacíos: el sitio los fija en código)
#   FORMS        none | relay (relay de formularios, kit/forms/relay/)
#   RELAY_URL    URL del relay (https://relay.example.com/form.php)
#   RELAY_OPTIONS  claves extra de la línea del sitio en la tabla del relay
#   DUCKDNS      subdominio de DuckDNS de la VM (SUBDOMINIO)
#   CF_PAGES_PROJECT  proyecto de Cloudflare Pages (por defecto APP)
set -euo pipefail

out=${1:?Uso: render.sh <carpeta> [CLAVE=valor…]}
shift
declare -A vars=([PB_PORT]=8090 [USER]=sites
  [SITE_HOST]=example.com [PUBLIC]=cpanel [FORMS]=none [RELAY_URL]=https://relay.example.com/form.php
  [ENABLED_LANGS]='' [DEFAULT_LANG]='' [RELAY_OPTIONS]=''
  [DUCKDNS]=SUBDOMINIO)

# deploy/site.env: se lee en un shell aparte (no ejecuta nada en este) y solo se toman
# sus variables.
if [ -f "$out/site.env" ]; then
  while IFS= read -r -d '' pair; do
    key=${pair%%=*}
    [[ $key =~ ^[A-Z][A-Z_]*$ && $key != PWD && $key != SHLVL ]] && vars[$key]=${pair#*=}
  done < <(env -i HOME=/nonexistent bash --norc --noprofile -c 'set -a; . "$1"; env -0' _ "$out/site.env")
fi
for pair in "$@"; do
  [[ $pair == *=* ]] || { echo "Argumento inválido: $pair" >&2; exit 1; }
  vars[${pair%%=*}]=${pair#*=}
done
: "${vars[APP]:?Falta APP (en deploy/site.env o APP=<nombre>)}"
vars[UNIT]=${vars[UNIT]:-${vars[APP]}}
vars[EDITOR_HOST]=${vars[EDITOR_HOST]:-editor.${vars[SITE_HOST]}}
vars[PB_HOST]=${vars[PB_HOST]:-pb.${vars[SITE_HOST]}}
vars[PB_SERVICE]=${vars[PB_SERVICE]:-${vars[APP]}-pocketbase}
# APP como nombre de variable de nginx (cada sitio la suya en el mismo servidor).
vars[NGINX_ID]=${vars[APP]//[^A-Za-z0-9_]/_}

templates=$(dirname "$0")/templates
mkdir -p "$out"

# Reemplaza @CLAVE@ por su valor (escapado para sed).
substitute() {
  local args=() key value
  for key in "${!vars[@]}"; do
    value=${vars[$key]//\\/\\\\}
    value=${value//&/\\&}
    value=${value//|/\\|}
    args+=(-e "s|@$key@|$value|g")
  done
  sed "${args[@]}"
}
render() {
  substitute < "$templates/$1" > "$out/$2"
  if grep -n '@[A-Z_]*@' "$out/$2"; then echo "Quedaron variables sin reemplazar en $2" >&2; exit 1; fi
}
render build.path.in "${vars[UNIT]}-build.path"
render build.service.in "${vars[UNIT]}-build.service"
render pocketbase.service.in "${vars[PB_SERVICE]}.service"
render Caddyfile.in Caddyfile
render nginx.conf.in nginx.conf

# ─── despliegue.md ─────────────────────────────────────────
# Las líneas que son solo @BLOQUE@ se reemplazan por varias líneas: las armadas aquí o
# las de templates/despliegue/ según PUBLIC y FORMS.
if [ -n "${vars[SITE_NAME]:-}" ]; then
  vars[CF_PAGES_PROJECT]=${vars[CF_PAGES_PROJECT]:-${vars[APP]}}
  [[ ${vars[FORMS]} == none || ${vars[FORMS]} == relay ]] || { echo "FORMS debe ser none o relay" >&2; exit 1; }
  case ${vars[PUBLIC]} in
    cloudflare) vars[PUBLIC_LABEL]='Cloudflare Pages' vars[PUBLIC_ENV]=cloudflare.env vars[PUBLIC_GUIDE]=cloudflare-pages.md ;;
    cpanel) vars[PUBLIC_LABEL]='Hosting con cPanel' vars[PUBLIC_ENV]=cpanel.env vars[PUBLIC_GUIDE]=cpanel.md ;;
    *) echo "PUBLIC debe ser cpanel o cloudflare" >&2; exit 1 ;;
  esac

  build_env() {
    echo "SITE_URL=https://${vars[SITE_HOST]}"
    if [ -n "${vars[ENABLED_LANGS]}" ]; then
      echo "ENABLED_LANGS=${vars[ENABLED_LANGS]}"
      [ -z "${vars[DEFAULT_LANG]}" ] || echo "DEFAULT_LANG=${vars[DEFAULT_LANG]}"
    fi
    echo "PUBLIC_POCKETBASE_URL=https://${vars[PB_HOST]}"
    echo "EDITOR_URL=https://${vars[EDITOR_HOST]}"
    if [ "${vars[FORMS]}" = relay ]; then
      echo "FORMS_RELAY_URL=${vars[RELAY_URL]}"
      echo "FORMS_RELAY_KEY=CAMBIAR"
    fi
  }
  # La entrada del sitio en la tabla del relay, dentro del esqueleto de su config.php
  # (kit/forms/relay/form-config.example.php), una clave por línea. RELAY_OPTIONS se parte en las comas
  # de primer nivel, fuera de corchetes y comillas.
  relay_entry() {
    echo "<?php"
    echo "return ["
    echo "    // …"
    echo "    'sites' => ["
    echo "        // … los sitios que ya están"
    echo ""
    echo "        '${vars[SITE_HOST]}' => [    // ← este sitio"
    echo "            'key' => 'CAMBIAR',"
    echo "            'to' => 'CAMBIAR@${vars[SITE_HOST]}',"
    echo "            'name' => '${vars[SITE_NAME]}',"
    printf '%s' "${vars[RELAY_OPTIONS]}" | awk -v q="'" '{
      depth = 0; quote = ""; item = ""
      for (i = 1; i <= length($0); i++) {
        c = substr($0, i, 1)
        if (quote != "") { if (c == quote) quote = "" }
        else if (c == q || c == "\"") quote = c
        else if (c == "[") depth++
        else if (c == "]") depth--
        else if (c == "," && depth == 0) { out(item); item = ""; continue }
        item = item c
      }
      out(item)
    }
    function out(s) { gsub(/^ +| +$/, "", s); if (s != "") print "            " s "," }'
    echo "        ],"
    echo "    ],"
    echo "];"
  }
  langs_note() {
    if [ -z "${vars[ENABLED_LANGS]}" ]; then
      echo 'Los idiomas no van aquí: los fija el código del sitio.'
    elif [ -n "${vars[DEFAULT_LANG]}" ]; then
      echo "Idiomas: \`${vars[ENABLED_LANGS]}\`; \`${vars[DEFAULT_LANG]}\` va sin prefijo (\`/\`) y los demás en \`/<idioma>/\`."
    else
      echo "Idiomas: \`${vars[ENABLED_LANGS]}\`; el idioma de origen va sin prefijo (\`/\`)."
    fi
  }
  # Los bloques de templates/despliegue/ pueden tener a su vez líneas @BLOQUE@.
  expand() {
    local line part=$templates/despliegue
    while IFS= read -r line; do
      case $line in
        @BUILD_ENV@) build_env ;;
        @LANGS_NOTE@) langs_note ;;
        @RELAY_ENTRY@) relay_entry ;;
        @PUBLIC_SECTION@) expand "$part/${vars[PUBLIC]}.md.in" ;;
        @PUBLIC_DNS@) expand "$part/${vars[PUBLIC]}-dns.md.in" ;;
        @PUBLIC_ENV@) expand "$part/${vars[PUBLIC]}-env.md.in" ;;
        @FORMS_SECTION@) expand "$part/forms-${vars[FORMS]}.md.in" ;;
        @PUBLIC_REQUISITOS@) expand "$part/${vars[PUBLIC]}-requisitos.md.in" ;;
        @FORMS_REQUISITOS@) expand "$part/forms-${vars[FORMS]}-requisitos.md.in" ;;
        *) printf '%s\n' "$line" ;;
      esac
    done < "$1"
  }
  expand "$templates/despliegue.md.in" | substitute | cat -s > "$out/despliegue.md"
  if grep -n '@[A-Z_]*@' "$out/despliegue.md"; then echo "Quedaron variables sin reemplazar en despliegue.md" >&2; exit 1; fi
fi
echo "Listo en $out/"
