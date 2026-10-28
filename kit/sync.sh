#!/bin/bash
# Copia este kit/ a otro proyecto (kit/ del destino queda igual a este).
#
#   kit/sync.sh <proyecto>           p. ej. kit/sync.sh ../otro-sitio
#   kit/sync.sh <proyecto> --force   pisa también cambios hechos a mano allá
#
# El kit se edita solo en el proyecto de origen (el que corre este script) y se
# copia desde ahí. Cada copia deja kit/VERSION (commit de origen) y kit/.manifest
# (sumas de cada archivo): si alguien cambió el kit en el destino, este script
# se niega a pisarlo y muestra qué cambió, para llevar esos cambios al origen.
set -euo pipefail

src=$(cd "$(dirname "$0")" && pwd)
target=${1:?Uso: kit/sync.sh <proyecto> [--force]}
force=${2:-}
dest=$(cd "$target" && pwd)/kit
[ "$dest" != "$src" ] || { echo 'El destino es el mismo kit.' >&2; exit 1; }

if [ -d "$dest" ] && [ "$force" != --force ]; then
  if [ ! -f "$dest/.manifest" ]; then
    echo "$dest existe pero no vino de kit/sync.sh (no tiene .manifest). Revisar y usar --force." >&2
    exit 1
  fi
  # Archivos cambiados, borrados o agregados a mano desde la última copia.
  changes=$(cd "$dest" && {
    { sha256sum --quiet -c .manifest 2>/dev/null || true; } | sed 's/: FAILED open or read$/: BORRADO/; s/: FAILED$/: CAMBIADO/'
    comm -13 <(sed 's/^[0-9a-f]*  //' .manifest | sort) <(find . -type f ! -name .manifest ! -name VERSION | sort | sed 's|^\./||') | sed 's/$/: AGREGADO/'
  })
  if [ -n "$changes" ]; then
    echo "El kit de $target tiene cambios propios; llevarlos a $src o usar --force:" >&2
    echo "$changes" >&2
    exit 1
  fi
fi

mkdir -p "$dest"
rsync -a --delete --exclude .manifest --exclude VERSION "$src/" "$dest/"
commit=$(git -C "$src" rev-parse --short HEAD 2>/dev/null || echo '?')
dirty=$(git -C "$src" status --porcelain -- . 2>/dev/null | head -1)
echo "$commit${dirty:+ (con cambios sin commitear)} $(date -I)" > "$dest/VERSION"
(cd "$dest" && find . -type f ! -name .manifest ! -name VERSION | sed 's|^\./||' | sort | xargs -d '\n' sha256sum > .manifest)
echo "kit/ copiado a $dest ($(cat "$dest/VERSION"))."
