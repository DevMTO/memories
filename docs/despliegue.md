# Despliegue: VPS compartido y hosting con cPanel

El despliegue tiene dos partes:

- **El VPS:** una e2-micro del nivel gratuito de Google Cloud, compartida con otros sitios
  hechos con el kit. Tiene PocketBase, el editor `/admin` con su vista previa y los builds.
  Se construye solo, sin Docker ni servicios externos de CI.
- **El sitio público:** lo que ven los visitantes, en el hosting compartido de Banahosting
  (cPanel). Al publicar, el build lo sube por FTPS (`kit/deploy/cpanel.md`).

| Qué | En el VPS | En el repo |
|---|---|---|
| Repo (rama `deploy`) y caché de traducciones | `/srv/memories/repo/` | — |
| Sitio para los visitantes | Fuera del VPS: el hosting con cPanel (`example.com`), subido por el build | `kit/deploy/build.sh` |
| Sitio para el editor (`/admin`) | `/srv/memories/site/`, servido por Caddy o nginx en `editor.example.com` | `deploy/Caddyfile` o `deploy/nginx.conf` |
| Vista previa del editor (opcional) | `/srv/memories/preview/`, en las mismas URLs de `editor.example.com` | ídem |
| PocketBase | `/srv/memories/pocketbase/`, servicio `memories-pocketbase` en `127.0.0.1:8091` | `pocketbase/`; `deploy/memories-pocketbase.service` |
| Build | `memories-build.service`, lanzado por `memories-build.path` | `kit/deploy/build.sh`, `deploy/memories-build.*` |
| HTTPS | Let's Encrypt (Caddy o certbot) en el VPS; AutoSSL en cPanel | — |
| DNS | Zona DNS de cPanel | — |

El VPS atiende `editor.example.com` (el mismo sitio, `noindex`, con `/admin` y la vista
previa) y `pb.example.com` (proxy a PocketBase). `/admin` y la vista previa tienen que estar
en el mismo origen (la pestaña Traducciones lee la página dentro de un iframe), por eso el
editor trabaja en `editor.example.com/admin`; `example.com/admin` redirige ahí. Los dominios
son marcadores: reemplazarlos por los reales en el `Caddyfile` / `nginx.conf` del VPS, en
`/etc/memories/build.env` y en este documento.

Costo: la VM y su disco entran en el nivel gratuito, y el hosting es el plan de Banahosting.
Lo único que puede cobrar Google es la IP externa (revisar Billing el primer mes) y el
tráfico de salida que pase de 1 GB al mes (el editor y las subidas del sitio, de todos los
sitios de la VM).

## Cómo se despliega

Todo pasa por `kit/deploy/build.sh` (ver `kit/deploy/README.md`): cada pedido de build es un
archivo en `/srv/memories/build/requests/`, y `memories-build.path` lanza el build en cuanto
la carpeta tiene algo.

- **Botón "Publicar"** en `/admin`: publica el contenido guardado.
- **Push a `deploy`**: el webhook de GitHub avisa a PocketBase y se construye el código
  nuevo. Si el push no toca nada del sitio, no reconstruye.
- **Botón "Vista previa"** (opcional): arma el sitio con lo guardado, ocultos incluidos, en
  `/srv/memories/preview/`. Nunca publica.
- **A mano**: `sudo -u memories touch /srv/memories/build/requests/manual`.

El build actualiza el repo, PocketBase (binario, migraciones y hooks) si cambiaron, construye,
copia `dist/` al sitio del editor y lo sube al hosting. `/admin` muestra el estado en vivo.
Log: `journalctl -u memories-build` o `/srv/memories/build/last.log`.

`main` es la rama de trabajo y **no** despliega. Para pasar a producción lo que está en
`main`: `git push origin main:deploy`.

Con varios sitios en la VM, los builds nunca corren a la vez: si otro sitio está
construyendo, este espera (en `/admin` la publicación sigue "En cola").

### Archivos de `deploy/`

Se generan con las plantillas del kit. Para regenerarlos (después de un cambio en las
plantillas o en los dominios):

```sh
kit/deploy/render.sh deploy APP=memories PB_PORT=8091 PB_SERVICE=memories-pocketbase \
  EDITOR_HOST=editor.example.com PB_HOST=pb.example.com
```

`PB_PORT` y `PB_SERVICE` son propios de este sitio para no chocar con los demás de la VM.
Los archivos se commitean y se copian al VPS como dice cada uno.

### Cambiar los archivos de entorno

- `pocketbase.env`: `sudo systemctl restart memories-pocketbase`.
- `build.env`: sus valores quedan dentro del sitio, así que hay que reconstruir (pedido a
  mano, arriba).
- `cpanel.env`: se lee en el próximo build.

## La VM (una vez para todos los sitios)

El nivel gratuito de Google Cloud es **una** e2-micro por cuenta de facturación: los sitios
comparten la misma VM, cada uno con su usuario, su PocketBase y sus subdominios. Si la VM
ya existe (porque otro sitio la preparó), saltar a "DNS".

1. **Crear la VM:** Compute Engine → VM instances → Create instance:
   - Región `us-east1` (también valen `us-central1` y `us-west1`).
   - Tipo de máquina **e2-micro**.
   - Disco de arranque: Debian, **Standard persistent disk** (el "Balanced" que viene por
     defecto no es gratuito), 30 GB.
   - Firewall: **Allow HTTP traffic** y **Allow HTTPS traffic**.
   - Billing → Budgets & alerts: un presupuesto (p. ej. 5 USD) con aviso por correo.

   Se entra con `gcloud compute ssh NOMBRE --zone ZONA` o el botón SSH de la consola; los
   pasos van como root (`sudo -i`).
2. **Nombre fijo con DuckDNS:** la IP externa cambia cada vez que la VM se detiene y
   arranca, y una IP estática no es gratuita. [DuckDNS](https://www.duckdns.org) da un
   nombre `SUBDOMINIO.duckdns.org` que sigue a la IP; los subdominios `editor` y `pb` de cada
   sitio son `CNAME` a ese nombre. En duckdns.org, crear el subdominio y copiar el token; en
   la VM:
   ```sh
   URL='https://www.duckdns.org/update?domains=SUBDOMINIO&token=TOKEN&ip='
   cat > /etc/cron.d/duckdns <<EOF
   @reboot root sleep 20 && curl -fsS -o /dev/null "$URL"
   */5 * * * * root curl -fsS -o /dev/null "$URL"
   EOF
   chmod 600 /etc/cron.d/duckdns
   ```
   Comprobar: `dig +short SUBDOMINIO.duckdns.org` da la IP de la VM.
3. **Paquetes:** `git`, `rsync`, `curl`, `unzip`, `lftp` y Node 22 (de
   [nodejs.org](https://nodejs.org/en/download) o NodeSource; el de la distro suele ser
   viejo). Y 1 GB de swap, margen para los builds:
   ```sh
   fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```
4. **Servidor web**, uno solo para todos los sitios: Caddy
   ([caddyserver.com/docs/install](https://caddyserver.com/docs/install)) o nginx con
   `certbot` (`python3-certbot-nginx`). En Debian, borrar
   `/etc/nginx/sites-enabled/default` si atiende el puerto 80.

## DNS (una vez)

En la zona DNS de cPanel, como dice "Antes del VPS" de `kit/deploy/cpanel.md`:

| Registro | Apunta a | Para qué |
|---|---|---|
| `editor` | `SUBDOMINIO.duckdns.org` (`CNAME`) | El editor `/admin` y la vista previa |
| `pb` | ídem | PocketBase (API de `/admin`) |

Ahí mismo: la cuenta FTP del build y vaciar `public_html`. Comprobar con
`dig +short editor.example.com` (da `SUBDOMINIO.duckdns.org.` y la IP de la VM).

## Instalar el sitio en la VM (una vez)

Como root:

1. Usuario `memories` (corre PocketBase y el build) y carpetas:
   ```sh
   adduser --disabled-password --gecos '' memories
   mkdir -p /srv/memories/{site,preview,build/requests,pocketbase/pb_data} /etc/memories
   chown -R memories:memories /srv/memories
   ```
2. Acceso de solo lectura al repo: como `memories`, `ssh-keygen -t ed25519 -N ''` y agregar
   `~/.ssh/id_ed25519.pub` en GitHub → repo → Settings → Deploy keys (sin escritura):
   ```sh
   sudo -u memories git clone -b deploy git@github.com:DevMTO/memories.git /srv/memories/repo
   ```
3. Que `memories` reinicie su PocketBase (y nada más) sin contraseña:
   ```sh
   echo 'memories ALL=(root) NOPASSWD: /usr/bin/systemctl restart memories-pocketbase' > /etc/sudoers.d/memories
   chmod 440 /etc/sudoers.d/memories
   ```
4. Archivos de entorno (`chmod 600`, dueño root; systemd los lee antes de pasar a
   `memories`):
   - `/etc/memories/pocketbase.env`:
     ```sh
     EDITOR_EMAIL=...
     EDITOR_PASSWORD=...
     BUILD_REQUEST_DIR=/srv/memories/build/requests
     PUBLISH_CALLBACK_SECRET=...
     DEPLOY_WEBHOOK_SECRET=...
     PREVIEW_KEY=...
     ```
     Cada secreto con `openssl rand -hex 32` (el valor solo, sin comentarios en la línea).
     `PREVIEW_KEY` es opcional (ver "Vista previa"). `EDITOR_EMAIL` /
     `EDITOR_PASSWORD` son el acceso inicial: el hook crea el editor con ellas la primera
     vez. Después el editor cambia su contraseña en `/admin` → Mi cuenta, y estas variables
     ya no la pisan. Contraseña olvidada o cambio de correo: en el dashboard de PocketBase
     (`/_/` → editors), con el superusuario.
   - `/etc/memories/build.env`:
     ```sh
     SITE_URL=https://example.com
     ENABLED_LANGS=es,en,pt
     DEFAULT_LANG=en
     PUBLIC_POCKETBASE_URL=https://pb.example.com
     EDITOR_URL=https://editor.example.com
     ```
     `SITE_URL` es la dirección del hosting, no la del editor (canónicos y `hreflang`).
   - `/etc/memories/cpanel.env`: los datos de la cuenta FTP (`kit/deploy/cpanel.md`, "En el
     VPS"). Sin él el build no sube nada.
5. Servicios: copiar `deploy/memories-pocketbase.service`, `deploy/memories-build.service` y
   `deploy/memories-build.path` a `/etc/systemd/system/` y:
   ```sh
   systemctl daemon-reload
   systemctl enable memories-pocketbase
   systemctl enable --now memories-build.path
   ```
   Sin `--now` el path no arranca hasta reiniciar: "Publicar" queda "En cola".
6. Servidor web:
   - **Caddy:** agregar los bloques de `deploy/Caddyfile` a `/etc/caddy/Caddyfile` (junto a
     los de los otros sitios), con los dominios reales y `PREVIEW_KEY` en lugar de `CLAVE`,
     y `systemctl reload caddy`.
   - **nginx:** copiar `deploy/nginx.conf` a `/etc/nginx/conf.d/memories.conf` con los
     dominios reales y `PREVIEW_KEY` en lugar de `CLAVE`, y:
     ```sh
     nginx -t && systemctl reload nginx
     certbot --nginx -d editor.example.com -d pb.example.com
     ```
7. Primer build: `systemctl start memories-build`. Instala PocketBase y lo arranca; sin
   contenido todavía, el sitio sale vacío (o el build falla): es normal.
8. Superusuario (abajo) y contenido: en `.env.production` de tu máquina,
   `PUBLIC_POCKETBASE_URL=https://pb.example.com` y `POCKETBASE_SUPERUSER_EMAIL` /
   `POCKETBASE_SUPERUSER_PASSWORD`; después `npm run pb:import:prod`.
9. Backups (abajo).
10. Webhook de GitHub: repo → Settings → Webhooks → Add webhook:
    - Payload URL: `https://pb.example.com/api/deploy-hook`
    - Content type: `application/json`
    - Secret: el `DEPLOY_WEBHOOK_SECRET` de `pocketbase.env`
    - Events: "Just the push event"

    En Recent Deliveries el ping tiene que dar 200.
11. Reconstruir con el contenido: `sudo -u memories touch /srv/memories/build/requests/manual`.
    Después, "Después del primer build" de `kit/deploy/cpanel.md` (HTTPS, `www` y
    comprobaciones).

### Superusuario de PocketBase

La cuenta técnica para el dashboard (`https://pb.example.com/_/`), distinta de la del
editor. Por consola:

```sh
sudo -u memories /srv/memories/pocketbase/bin/pocketbase superuser upsert CORREO CONTRASEÑA \
  --dir=/srv/memories/pocketbase/pb_data
```

## Vista previa

Con `PREVIEW_KEY` en `pocketbase.env`, `/admin` ofrece "Vista previa": arma el sitio con lo
guardado (ocultos incluidos) y el editor lo ve en las mismas URLs de `editor.example.com`
gracias a una cookie con esa clave. La cinta "Vista previa · Salir" la quita. Sin
`PREVIEW_KEY` no hay botón. Necesita la misma clave en lugar de `CLAVE` en el `Caddyfile` /
`nginx.conf` y la carpeta `/srv/memories/preview` (paso 1).

## Correo

El sitio no envía correos (la cotización va por WhatsApp): PocketBase no necesita SMTP. Los
buzones del dominio siguen en el hosting, sin cambios.

## Backups

Lo único que hay que respaldar es `pb_data` (base SQLite e imágenes subidas): el sitio se
regenera desde el repo y PocketBase. **No hay backups automáticos hasta activarlos**, en
`https://pb.example.com/_/` → Settings → Backups:

1. **Enable auto backups**, con cron `30 9 * * *` (9:30 UTC = 4:30 en Perú; el cron va en
   UTC). Un horario distinto al de los otros sitios de la VM, para no generar dos a la vez.
2. **Max @auto backups to keep**: `7`.
3. Copia fuera de la VM: **Store backups in S3 storage** con un bucket compatible
   (Cloudflare R2 tiene 10 GB gratis) y **Test connection**. Sin eso, los zips quedan en
   `/srv/memories/pocketbase/pb_data/backups/`, en el mismo disco.
4. Probar con **Initialize new backup**.

Restaurar: **Upload backup** (si hace falta) y **Restore** en el mismo panel; PocketBase se
reinicia solo. Después, "Publicar" o el pedido a mano para regenerar el sitio. Si el
dashboard no arranca:

```sh
sudo systemctl stop memories-pocketbase
sudo -u memories mv /srv/memories/pocketbase/pb_data /srv/memories/pocketbase/pb_data.roto
sudo -u memories unzip BACKUP.zip -d /srv/memories/pocketbase/pb_data
sudo systemctl start memories-pocketbase
```
