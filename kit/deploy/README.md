# kit/deploy/: build y publicación en el VPS

El sitio se construye en el VPS cuando el editor pulsa **Publicar** o **Vista previa** en
`/admin`, o cuando se hace push a la rama de deploy. El flujo:

1. PocketBase deja un archivo en `BUILD_REQUEST_DIR` (hooks `publish.pb.js` y
   `deploy.pb.js` del módulo `core`).
2. Un path unit de systemd ve el archivo y lanza `build.sh`.
3. `build.sh` actualiza el repo, el binario, las migraciones y los hooks de PocketBase,
   construye, sube el sitio a la copia pública (y lo guarda en `/srv/$APP/site`), hace una
   copia de seguridad de PocketBase si cambió el contenido y le informa a PocketBase el
   estado. `/admin` lo muestra en vivo.
4. Después rearma la vista previa (`/srv/$APP/preview`, lo único que sirve
   `editor.<dominio>`), salvo que ya muestre lo mismo. Ver "Vista previa" y "Copias de
   seguridad" en `vps.md`.

Cómo funciona el VPS y cómo se prepara una vez: `vps.md`. Lo que necesita cada sitio, con sus
valores (DNS, sitio público, archivos y su contenido, webhook, formularios, operación): su
`deploy/despliegue.md`, generado desde `deploy/site.env` (abajo). Las guías del sitio público explican sus opciones
(abajo).

## Dónde ven el sitio los visitantes

| Destino | Se activa con | Guía |
|---|---|---|
| Cloudflare Pages | `/etc/$APP/cloudflare.env` (`CF_PAGES_PROJECT`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) | `cloudflare-pages.md` |
| Hosting compartido con cPanel (FTPS) | `/etc/$APP/cpanel.env` (`CPANEL_FTP_HOST`, `CPANEL_FTP_USER`, `CPANEL_FTP_PASSWORD`, `CPANEL_FTP_DIR`) | `cpanel.md` |

Sin ninguno de los dos, nadie ve el sitio publicado (el VPS solo sirve la vista previa, al
editor). Con los dos, el build sube a ambos.
El dominio apunta a uno solo.

## build.sh

Variables, de `/etc/$APP/build.env` o del `Environment=` del servicio:

| Variable | Por defecto | Qué es |
|---|---|---|
| `APP` | obligatoria | Nombre del sitio en el VPS: `/srv/$APP` (repo, PocketBase, sitio, vista previa) y `/etc/$APP` (variables) |
| `PB_PORT` | `8090` | Puerto local de PocketBase |
| `PB_SERVICE` | `pocketbase` | Servicio de systemd de PocketBase (lo reinicia al cambiar migraciones o hooks) |
| `DEPLOY_BRANCH` | `deploy` | Rama que se publica |

En cada build compara las migraciones y hooks instalados con los del repo (kit + proyecto,
`pocketbase.ts assemble`). Si difieren, los actualiza y reinicia PocketBase; así también
repara un PocketBase que haya quedado desactualizado.

## render.sh: archivos de `deploy/` y la guía del sitio

Los valores de cada sitio van en `deploy/site.env` (sintaxis de shell, sin secretos):

```sh
SITE_NAME="Mi Sitio"
APP=misitio
PB_PORT=8091
PUBLIC=cpanel                 # cpanel | cloudflare
SITE_HOST=misitio.com         # editor.misitio.com y pb.misitio.com salen de aquí
# EDITOR_HOST=… / PB_HOST=…   # solo si son otros nombres
DUCKDNS=mivm                  # nombre de DuckDNS de la VM (mivm.duckdns.org)
ENABLED_LANGS=es,en,pt
DEFAULT_LANG=en
FORMS=relay                   # none | relay (kit/forms/relay/)
RELAY_OPTIONS=""              # claves extra de su línea en la tabla del relay
# CF_PAGES_PROJECT=misitio    # con PUBLIC=cloudflare (por defecto APP)
```

```sh
kit/deploy/render.sh deploy                # con los valores de deploy/site.env
kit/deploy/render.sh deploy PB_PORT=8093   # un valor puntual pisa el de site.env
```

Escribe en `deploy/` del proyecto:

- `<UNIT>-build.path` y `<UNIT>-build.service`
- `<PB_SERVICE>.service`
- `Caddyfile` y `nginx.conf`
- `despliegue.md`: la guía del sitio, en formato de referencia y con sus valores: DNS,
  sitio público, archivos del VPS y su contenido (carpetas, deploy key, variables,
  servicios, servidor web), webhook, formularios y operación. Cuentas y secretos quedan
  como `CAMBIAR`.

Por defecto `UNIT` es `APP`, `PB_SERVICE` es `<APP>-pocketbase` y `USER` es `sites` (el
usuario común de todos los sitios, ver `vps.md`); la lista completa de valores está al
principio de `render.sh`. Lo generado se commitea y no se edita a mano: para cambiar algo,
`site.env` (o la plantilla del kit) y volver a correrlo.

## Varios sitios en un VPS

Un VPS chico (p. ej. la e2-micro gratuita de Google Cloud: el nivel gratuito es una sola VM
por cuenta de facturación) alcanza para varios sitios cuando los visitantes ven el sitio
público en otro lado (Pages o cPanel):

- Cada sitio con su `APP`, su `PB_PORT`, su `PB_SERVICE` (`<app>-pocketbase`) y sus
  subdominios `editor` y `pb`. Generar sus archivos con `render.sh` y esos valores. Todos
  corren con el mismo usuario, `sites`. La VM se prepara con `vps.md`; cada sitio, con su
  `deploy/despliegue.md`.
- Un PocketBase por sitio: cada uno es un proceso chico con su propia base (SQLite), y
  mientras nadie edita casi no usa memoria.
- Los builds son lo pesado. `build.sh` toma un candado común a todo el servidor
  (`/run/lock/kit-build.lock`): si otro sitio está construyendo, espera a que termine, y
  mientras tanto la publicación sigue "en cola" en `/admin`. Conviene igual 1 GB de swap.
- Un solo servidor web para todos: con Caddy, los bloques del `Caddyfile` de cada sitio
  van juntos en `/etc/caddy/Caddyfile`; con nginx, un archivo por sitio en `conf.d/` y
  `map_hash_bucket_size 128;` una sola vez, en el bloque `http` de `nginx.conf` (ver el
  comentario del `nginx.conf` generado).
