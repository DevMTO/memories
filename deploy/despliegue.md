<!--
  Generado por kit/deploy/render.sh desde deploy/site.env: no editar a mano. Para cambiar
  un valor, editar site.env y correr `kit/deploy/render.sh deploy`.
-->

# Despliegue de Memories Travel Perú

Qué necesita este sitio en el VPS y en el hosting, con sus valores. Lo que no pide ningún
dato va como comando, listo para copiar (en la VM, como root); lo que hay que completar va
como contenido, donde `CAMBIAR` marca cuentas y secretos, que no van en el repo. El orden de
instalación y el porqué de cada parte están en `kit/deploy/vps.md` ("Instalar un sitio") y en
`kit/deploy/cpanel.md`.

## Valores

| Qué | Valor |
|---|---|
| Nombre en el VPS | `memories` (`/srv/memories`, `/etc/memories`) |
| Usuario del sistema | `sites` |
| PocketBase | servicio `memories-pocketbase`, en `127.0.0.1:8091` |
| Build | `memories-build.service`, lanzado por `memories-build.path` |
| Rama que se publica | `deploy` |
| Sitio público | Hosting con cPanel, `example.com` |
| Editor y vista previa | `editor.example.com` |
| API de PocketBase | `pb.example.com` |
| Nombre fijo de la VM | `SUBDOMINIO.duckdns.org` |
| Backups automáticos | cron `30 9 * * *` (UTC) |

## Requisitos

- La VM preparada con `kit/deploy/vps.md` (DuckDNS, paquetes, el usuario `sites` y el
  servidor web).
- **El hosting con cPanel:** el dominio `example.com` con sus nameservers en el hosting (si
  se contrató con el hosting, ya lo están). En el hosting no hay nada que instalar: el sitio
  son archivos que sube el build.

## DNS

| Registro | Tipo | Apunta a |
|---|---|---|
| `editor.example.com` | `CNAME` | `SUBDOMINIO.duckdns.org` |
| `pb.example.com` | `CNAME` | `SUBDOMINIO.duckdns.org` |

En el Zone Editor de cPanel, zona de `example.com` (nombres con punto final). Son solo
registros DNS: no se crean como subdominios en Domains, los atiende la VM.

Antes del HTTPS, los dos tienen que dar la IP de la VM:

```sh
dig +short editor.example.com pb.example.com
```

## Sitio público

El build sube el sitio por FTPS a `public_html` y borra solo lo que él mismo subió.

| Qué | Configuración |
|---|---|
| Cuenta FTP | Solo para el build, contraseña larga, **Directory** = `public_html` (o la carpeta del dominio, si no es el principal). Sus datos van en `cpanel.env` |
| Servidor FTP | El nombre del servidor del hosting (el de **Configure FTP Client**), que es el del certificado del FTP |
| `public_html` | Sin archivos previos del sitio, salvo `.well-known` y `cgi-bin` |
| HTTPS | AutoSSL para `example.com` y `www.example.com` (SSL/TLS Status) |
| `www` | Redirect permanente (301) de `www.example.com` a `https://example.com/` |

Con el primer build, `https://example.com/` responde 200 con `Cache-Control: no-cache`, y
`https://example.com/admin/` redirige (302) a `https://editor.example.com/admin/`.
`/admin` vive en el editor porque tiene que estar en el mismo origen que la vista previa (la
cookie `site_preview` y el iframe de Traducciones), que solo sirve el VPS: ver "Vista previa"
en `kit/deploy/vps.md`.

## Archivos en el VPS

### Carpetas y repo

| Ruta | Dueño | Qué es |
|---|---|---|
| `/srv/memories/repo` | `sites` | Clon del repo, rama `deploy` |
| `/srv/memories/site` | `sites` | Sitio del editor (lo que sirve `editor.example.com`) |
| `/srv/memories/preview` | `sites` | Vista previa |
| `/srv/memories/build/requests` | `sites` | Pedidos de build |
| `/srv/memories/pocketbase/pb_data` | `sites` | Base y archivos de PocketBase |
| `/etc/memories/` | root | Variables (abajo) |

```sh
mkdir -p /srv/memories/{site,preview,build/requests,pocketbase/pb_data} /etc/memories
chown -R sites:sites /srv/memories
```

El repo se clona con una deploy key propia (solo lectura; GitHub no deja repetirla en otro
repo), `/home/sites/.ssh/memories`, y un nombre de host en `/home/sites/.ssh/config`:

```sh
sudo -u sites mkdir -p -m 700 /home/sites/.ssh
sudo -u sites ssh-keygen -t ed25519 -N '' -f /home/sites/.ssh/memories
sudo -u sites tee -a /home/sites/.ssh/config >/dev/null <<'EOF'
Host github-memories
  HostName github.com
  IdentityFile ~/.ssh/memories
  IdentitiesOnly yes
EOF
cat /home/sites/.ssh/memories.pub
```

Esa clave pública va en GitHub, en el repo del sitio: Settings → Deploy keys → **Add deploy
key**, sin permiso de escritura. Después el clon, con `DUEÑO/REPO` el repo del sitio (la
primera vez pregunta por la huella de GitHub: `yes`):

```sh
sudo -u sites git clone -b deploy git@github-memories:DUEÑO/REPO.git /srv/memories/repo
```

### Archivos de variables

Se crean vacíos, con dueño root y permisos `600` (systemd los lee antes de pasar a
`sites`), y se completan con el contenido de abajo. Sin comentarios al final de una línea:
systemd toma el valor entero. Cada secreto se genera con `openssl rand -hex 32`.

```sh
install -m 600 /dev/null /etc/memories/pocketbase.env
install -m 600 /dev/null /etc/memories/build.env
install -m 600 /dev/null /etc/memories/cpanel.env
```

### `/etc/memories/pocketbase.env`

Lo leen PocketBase y el build. Completarlo con:

```sh
EDITOR_EMAIL=CAMBIAR
EDITOR_PASSWORD=CAMBIAR
BUILD_REQUEST_DIR=/srv/memories/build/requests
PUBLISH_CALLBACK_SECRET=CAMBIAR
DEPLOY_WEBHOOK_SECRET=CAMBIAR
PREVIEW_KEY=CAMBIAR
```

| Variable | Qué es |
|---|---|
| `EDITOR_EMAIL`, `EDITOR_PASSWORD` | Acceso inicial a `/admin`; después la contraseña se cambia en Mi cuenta |
| `BUILD_REQUEST_DIR` | Carpeta donde PocketBase deja los pedidos de build |
| `PUBLISH_CALLBACK_SECRET` | Secreto entre el build y PocketBase (`openssl rand -hex 32`) |
| `DEPLOY_WEBHOOK_SECRET` | Secreto del webhook de GitHub (`openssl rand -hex 32`) |
| `PREVIEW_KEY` | Clave de la vista previa (`openssl rand -hex 32`); va también en el `Caddyfile` / `nginx.conf` en lugar de `CLAVE`. Opcional |

### `/etc/memories/build.env`

Lo lee el build; sus valores quedan dentro del sitio. Completarlo con:

```sh
SITE_URL=https://example.com
ENABLED_LANGS=es,en,pt
DEFAULT_LANG=en
PUBLIC_POCKETBASE_URL=https://pb.example.com
EDITOR_URL=https://editor.example.com
```

Idiomas: `es,en,pt`; `en` va sin prefijo (`/`) y los demás en `/<idioma>/`.

### `/etc/memories/cpanel.env`

Los datos de la cuenta FTP ("Sitio público"); sin ellos el build no sube nada. Completarlo
con:

```sh
CPANEL_FTP_HOST=CAMBIAR
CPANEL_FTP_USER=CAMBIAR
CPANEL_FTP_PASSWORD=CAMBIAR
```

### Servicios y servidor web

| En el repo (`deploy/`) | En el VPS |
|---|---|
| `memories-pocketbase.service` | `/etc/systemd/system/`, habilitado |
| `memories-build.service` | `/etc/systemd/system/` |
| `memories-build.path` | `/etc/systemd/system/`, habilitado y arrancado |
| `Caddyfile` | sus bloques en `/etc/caddy/Caddyfile` (con Caddy) |
| `nginx.conf` | `/etc/nginx/conf.d/memories.conf`, sin su línea `map_hash_bucket_size` (con nginx; HTTPS con certbot, abajo; ver "HTTPS" en `kit/deploy/vps.md`) |

```sh
cp /srv/memories/repo/deploy/{memories-pocketbase.service,memories-build.service,memories-build.path} /etc/systemd/system/
systemctl daemon-reload
systemctl enable memories-pocketbase
systemctl enable --now memories-build.path
```

En el `Caddyfile` / `nginx.conf`, `CLAVE` es el `PREVIEW_KEY` de `pocketbase.env`; estos
comandos la toman de ahí y no hacen nada si falta (sin vista previa, quitar antes su bloque,
como dice el comentario, y copiar el archivo a mano). Una sola vez: con Caddy, repetirlo
agrega los bloques otra vez. Con Caddy:

```sh
key=$(sed -n 's/^PREVIEW_KEY=//p' /etc/memories/pocketbase.env)
[ -n "$key" ] && sed "s/CLAVE/$key/" /srv/memories/repo/deploy/Caddyfile >> /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy
```

Con nginx:

```sh
key=$(sed -n 's/^PREVIEW_KEY=//p' /etc/memories/pocketbase.env)
[ -n "$key" ] && sed -e "s/CLAVE/$key/" -e '/^map_hash_bucket_size/d' /srv/memories/repo/deploy/nginx.conf > /etc/nginx/conf.d/memories.conf
nginx -t && systemctl reload nginx
certbot --nginx -d editor.example.com -d pb.example.com
```

`certbot` agrega el HTTPS a ese archivo; si se reemplaza por un `nginx.conf` nuevo, volver a
correrlo.

`/etc/sudoers.d/sites` (permisos `440`) deja al build reiniciar este PocketBase:

```sh
echo 'sites ALL=(root) NOPASSWD: /usr/bin/systemctl restart memories-pocketbase' >> /etc/sudoers.d/sites
chmod 440 /etc/sudoers.d/sites && visudo -c
```

## Webhook de GitHub

En GitHub → el repo del sitio → Settings → Webhooks → **Add webhook**:

| Campo | Valor |
|---|---|
| Payload URL | `https://pb.example.com/api/deploy-hook` |
| Content type | `application/json` |
| Secret | `DEPLOY_WEBHOOK_SECRET` de `pocketbase.env`: `sed -n 's/^DEPLOY_WEBHOOK_SECRET=//p' /etc/memories/pocketbase.env` |
| Events | Just the push event |

En Recent Deliveries, el ping tiene que dar 200.

## Formularios

El sitio no envía formularios por correo: no usa el relay de formularios.

## Operación

| Para qué | Comando |
|---|---|
| Primer build (instala PocketBase y lo arranca) | `systemctl start memories-build && journalctl -u memories-build -n 50` |
| Pasar el código a producción (en tu máquina) | `git push origin main:deploy` |
| Reconstruir a mano | `sudo -u sites touch /srv/memories/build/requests/manual` |
| Log del build | `journalctl -u memories-build` |
| Aplicar un cambio de `pocketbase.env` | `systemctl restart memories-pocketbase` |
| Aplicar un cambio de `build.env` | reconstruir |
| Superusuario del dashboard (`https://pb.example.com/_/`) | `sudo -u sites /srv/memories/pocketbase/bin/pocketbase superuser upsert CORREO CONTRASEÑA --dir=/srv/memories/pocketbase/pb_data` |
| Importar el contenido inicial (en tu máquina; en `.env.production`, `PUBLIC_POCKETBASE_URL=https://pb.example.com` y `POCKETBASE_SUPERUSER_EMAIL` / `POCKETBASE_SUPERUSER_PASSWORD`, los del superusuario de arriba) | `npm run pb:import:prod` |

Backups: en `https://pb.example.com/_/` → Settings → Backups, con el cron de arriba (ver "Backups"
en `kit/deploy/vps.md`). Lo que se respalda es `/srv/memories/pocketbase/pb_data`.
