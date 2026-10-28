# kit/deploy/: build y publicación en el VPS

El sitio se construye en el VPS cuando el editor pulsa **Publicar** o **Vista previa** en
`/admin`, o cuando se hace push a la rama de deploy. El flujo:

1. PocketBase deja un archivo en `BUILD_REQUEST_DIR` (hooks `publish.pb.js` y
   `deploy.pb.js` del módulo `core`).
2. Un path unit de systemd ve el archivo y lanza `build.sh`.
3. `build.sh` actualiza el repo, el binario, las migraciones y los hooks de PocketBase,
   construye, publica en `/srv/$APP/site` (el sitio del editor) y en la copia pública, y
   le informa a PocketBase el estado. `/admin` lo muestra en vivo.

El paso a paso del servidor (VM, PocketBase, servidor web, SMTP, backups) es de cada
proyecto; el del sitio público, de su guía (abajo).

## Dónde ven el sitio los visitantes

| Destino | Se activa con | Guía |
|---|---|---|
| Cloudflare Pages | `/etc/$APP/cloudflare.env` (`CF_PAGES_PROJECT`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`) | `cloudflare-pages.md` |
| Hosting compartido con cPanel (FTPS) | `/etc/$APP/cpanel.env` (`CPANEL_FTP_HOST`, `CPANEL_FTP_USER`, `CPANEL_FTP_PASSWORD`, `CPANEL_FTP_DIR`) | `cpanel.md` |

Sin ninguno de los dos, el sitio queda solo en el VPS. Con los dos, el build sube a ambos.
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

## render.sh: archivos de systemd, Caddy y nginx

```sh
kit/deploy/render.sh deploy APP=misitio PB_PORT=8091 PB_SERVICE=misitio-pocketbase \
  EDITOR_HOST=editor.misitio.com PB_HOST=pb.misitio.com
```

Escribe en `deploy/` del proyecto:

- `<UNIT>-build.path` y `<UNIT>-build.service`
- `<PB_SERVICE>.service`
- `Caddyfile` y `nginx.conf`

`UNIT` y `USER` son por defecto `APP`. Se commitean y se copian al VPS como dice cada
archivo. El comando con los valores de cada sitio va en su documentación de despliegue.

## Varios sitios en un VPS

Un VPS chico (p. ej. la e2-micro gratuita de Google Cloud: el nivel gratuito es una sola VM
por cuenta de facturación) alcanza para varios sitios cuando los visitantes ven el sitio
público en otro lado (Pages o cPanel):

- Cada sitio con su `APP`, su usuario, su `PB_PORT`, su `PB_SERVICE`
  (`<app>-pocketbase`) y sus subdominios `editor` y `pb`. Generar sus archivos con
  `render.sh` y esos valores.
- Un PocketBase por sitio: cada uno es un proceso chico con su propia base (SQLite), y
  mientras nadie edita casi no usa memoria.
- Los builds son lo pesado. `build.sh` toma un candado común a todo el servidor
  (`/run/lock/kit-build.lock`): si otro sitio está construyendo, espera a que termine, y
  mientras tanto la publicación sigue "en cola" en `/admin`. Conviene igual 1 GB de swap.
- En Caddy o nginx, un bloque por dominio (los `Caddyfile` de cada sitio se juntan en uno).
