#!/bin/bash
# Genera los archivos del VPS (systemd, Caddy, nginx) de un proyecto a partir de
# kit/deploy/templates/. Se commitean en deploy/ del proyecto y se copian al VPS
# como dice cada archivo.
#
#   kit/deploy/render.sh <carpeta> APP=<nombre> [CLAVE=valor…]
#
#   APP          nombre del sitio: /srv/$APP, /etc/$APP (obligatoria)
#   UNIT         prefijo de los servicios de build (<UNIT>-build.*; por defecto APP)
#   USER         usuario del sistema que corre todo (por defecto APP)
#   PB_PORT      puerto local de PocketBase (8090; uno distinto por sitio en el mismo VPS)
#   PB_SERVICE   nombre del servicio de PocketBase (pocketbase; p. ej. <APP>-pocketbase
#                si hay varios sitios en el mismo VPS)
#   EDITOR_HOST  dominio del editor (editor.example.com)
#   PB_HOST      dominio de PocketBase (pb.example.com)
set -euo pipefail

out=${1:?Uso: render.sh <carpeta> APP=<nombre> [CLAVE=valor…]}
shift
declare -A vars=([PB_PORT]=8090 [PB_SERVICE]=pocketbase [EDITOR_HOST]=editor.example.com [PB_HOST]=pb.example.com)
for pair in "$@"; do
  [[ $pair == *=* ]] || { echo "Argumento inválido: $pair" >&2; exit 1; }
  vars[${pair%%=*}]=${pair#*=}
done
: "${vars[APP]:?Falta APP=<nombre>}"
vars[UNIT]=${vars[UNIT]:-${vars[APP]}}
vars[USER]=${vars[USER]:-${vars[APP]}}
# APP como nombre de variable de nginx (cada sitio la suya en el mismo servidor).
vars[NGINX_ID]=${vars[APP]//[^A-Za-z0-9_]/_}

templates=$(dirname "$0")/templates
mkdir -p "$out"
render() {
  local args=() key
  for key in "${!vars[@]}"; do args+=(-e "s|@$key@|${vars[$key]}|g"); done
  sed "${args[@]}" "$templates/$1" > "$out/$2"
  if grep -n '@[A-Z_]*@' "$out/$2"; then echo "Quedaron variables sin reemplazar en $2" >&2; exit 1; fi
}
render build.path.in "${vars[UNIT]}-build.path"
render build.service.in "${vars[UNIT]}-build.service"
render pocketbase.service.in "${vars[PB_SERVICE]}.service"
render Caddyfile.in Caddyfile
render nginx.conf.in nginx.conf
echo "Listo en $out/"
