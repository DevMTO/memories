# El VPS de los sitios (Google Cloud)

Una VM Linux (la e2-micro del nivel gratuito de Google Cloud) con, para cada sitio,
PocketBase, el editor `/admin` con su vista previa y los builds. Se construye sola, sin
Docker ni servicios externos de CI. Los visitantes ven el sitio público en otro lado
(Cloudflare Pages o un hosting con cPanel, ver "Sitio público"): nunca pasan por la VM.

Esta guía explica cómo funciona y prepara la VM una vez. Lo que necesita cada sitio (DNS,
archivos y su contenido, webhook), ya con sus valores, está en su `deploy/despliegue.md`
(generado por `kit/deploy/render.sh`). Aquí `<app>` es el nombre del sitio.

| Qué | En la VM | En el repo |
|---|---|---|
| Repo (rama `deploy`) y caché de traducciones | `/srv/<app>/repo/` | — |
| Editor (`/admin`) y vista previa | `/srv/<app>/preview/`, servido por Caddy o nginx en `editor.<dominio>` solo a quien tenga la cookie de `/admin` (sin ella, solo el login) | `deploy/Caddyfile` o `deploy/nginx.conf` |
| Último sitio publicado | `/srv/<app>/site/` (lo usa el build; no se sirve) | — |
| PocketBase (base, API, auth, archivos) | `/srv/<app>/pocketbase/`, servicio `<app>-pocketbase` en un puerto local propio | `pocketbase/`; `deploy/<app>-pocketbase.service` |
| Build | `<app>-build.service`, lanzado por `<app>-build.path` | `kit/deploy/build.sh`, `deploy/<app>-build.*` |
| Variables | `/etc/<app>/` (`pocketbase.env`, `build.env`, `cpanel.env` o `cloudflare.env`) | — |
| HTTPS | Let's Encrypt: automático con Caddy, con certbot en nginx | — |

Todos los sitios corren con un solo usuario del sistema, `sites`: un solo usuario que
mantener, a cambio de que el build de un sitio (que corre `npm ci`, código de terceros)
pueda leer los archivos de los demás.

La VM atiende, por sitio, `editor.<dominio>` (`/admin` y la vista previa, `noindex`) y
`pb.<dominio>` (proxy a PocketBase). `/admin` y la vista previa tienen que estar en el mismo
origen (la pestaña Traducciones lee la página dentro de un iframe), por eso el editor trabaja
en `editor.<dominio>/admin`; `<dominio>/admin` redirige ahí (el build lo configura en el sitio
público). Quien llega a `editor.<dominio>` sin sesión solo ve el login.

Costo: ver "Nivel gratuito" (abajo).

## Sitio público

El build sube el sitio a uno de estos destinos, según qué archivo de entorno tenga el sitio
en la VM. Los dos se publican igual (botón "Publicar", push a `deploy`); la vista previa
queda siempre en la VM.

| Destino | Archivo de entorno | Guía |
|---|---|---|
| **Cloudflare Pages**: gratis, sin límite de tráfico, despliegues de una vez | `/etc/<app>/cloudflare.env` | `kit/deploy/cloudflare-pages.md` |
| **Hosting compartido con cPanel**: el sitio junto al correo, en el plan que ya se paga; sube por FTPS solo lo que cambió | `/etc/<app>/cpanel.env` | `kit/deploy/cpanel.md` |

Cada guía explica su opción; la configuración del sitio en ella (cuenta, archivo de entorno,
dominio) está en la sección "Sitio público" de su `deploy/despliegue.md`.

## Cómo se despliega

Todo pasa por `kit/deploy/build.sh` (ver `kit/deploy/README.md`), que corre como servicio
aparte (no dentro de PocketBase, porque a veces tiene que reiniciarlo). Cada pedido de
build es un archivo en `/srv/<app>/build/requests/`; `<app>-build.path` lanza el build en
cuanto la carpeta tiene algo. Los builds de todos los sitios usan un candado común: si otro
sitio está construyendo, este espera (en `/admin` la publicación sigue "En cola"). Con el
turno tomado consume los pedidos: los que llegaron durante la espera entran en ese build, y
los que lleguen durante el build se juntan en uno solo al terminar.

- **Botón "Publicar"** (cambios de contenido): el hook deja un archivo con el id de la
  publicación.
- **Push a `deploy`** (cambios de código): el webhook de GitHub llama a `/api/deploy-hook`,
  que crea una publicación con el commit (se ve en el historial de `/admin`). Si nada de lo
  que cambió está en `BUILD_PATHS` (`kit/deploy/build.sh`), no reconstruye: marca la
  publicación "Sin cambios en el sitio".
- **Botón "Vista previa"** (opcional): arma el sitio con lo guardado, ocultos incluidos, en
  `/srv/<app>/preview/`. Usa el código ya publicado y **nunca** publica. Ver "Vista previa".
- **A mano**: `sudo -u sites touch /srv/<app>/build/requests/manual`.

Qué hace el script: `git reset` a `origin/deploy`; `npm ci` si cambió `package-lock.json`;
si el binario, las migraciones o los hooks de PocketBase no son los del repo, los actualiza
y reinicia PocketBase (unos segundos sin API); `npm run build`; copia `dist/` al sitio del
editor; lo sube al sitio público; y reporta `building` / `done` / `failed` a cada
publicación pendiente. Compara contra el último commit publicado con éxito, así que un build
fallido no saltea nada en el siguiente. Log: `journalctl -u <app>-build` o
`/srv/<app>/build/last.log`.

Si la subida al sitio público falla, el sitio nuevo ya está en `editor.<dominio>` pero los
visitantes siguen viendo el anterior: la publicación queda `failed` con ese aviso y basta
con volver a publicar. El editor no pierde trabajo: lo que guarda va directo a PocketBase,
y si guarda mientras PocketBase se reinicia, `/admin` avisa y el formulario queda como
estaba.

Un webhook que llega con PocketBase caído se pierde (GitHub no reintenta solo). Al terminar
cada build el script vuelve a hacer `git fetch` y pide otro si `deploy` avanzó; para los
casos raros: GitHub → Settings → Webhooks → Recent Deliveries → **Redeliver**, o el pedido
a mano.

`main` es la rama de trabajo y **no** despliega. Para pasar a producción:
`git push origin main:deploy`. "Publicar" construye lo que la VM tenga de `deploy`.

### Cambiar los archivos de entorno

systemd los lee al arrancar cada servicio:

- `pocketbase.env`: `sudo systemctl restart <app>-pocketbase`.
- `build.env`: sus valores quedan dentro del sitio, así que hay que reconstruir (pedido a
  mano).
- `cloudflare.env` / `cpanel.env`: se leen en el próximo build.

## Crear la VM (una vez para todos los sitios)

En la consola de Google Cloud, con una cuenta de facturación (pide tarjeta aunque no se
cobre). Para quedar dentro del nivel gratuito:

- Compute Engine → VM instances → Create instance:
  - Región `us-east1` (la más cercana a Perú de las tres gratuitas; también valen
    `us-central1` y `us-west1`).
  - Tipo de máquina **e2-micro**.
  - Disco de arranque: Debian, **Standard persistent disk** (el "Balanced" que viene por
    defecto no es gratuito), 30 GB.
  - Firewall: **Allow HTTP traffic** y **Allow HTTPS traffic**.
- La IP externa es efímera: cambia cada vez que la VM se detiene y arranca (un reboot la
  conserva). Una IP estática no es gratuita: DuckDNS (abajo) da un nombre fijo que sigue a la
  IP, y los subdominios `editor` y `pb` de cada sitio apuntan a ese nombre.
- Billing → Budgets & alerts: un presupuesto (p. ej. 5 USD) con aviso por correo.

Se entra con `gcloud compute ssh NOMBRE --zone ZONA` o con el botón SSH de la consola; los
pasos van como root (`sudo -i`).

### Nombre fijo con DuckDNS

[DuckDNS](https://www.duckdns.org) da gratis un nombre `SUBDOMINIO.duckdns.org` que apunta a
la IP de la VM. Uno solo sirve para todos los sitios. `editor` y `pb` de cada dominio son
`CNAME` a ese nombre, nunca registros `A` a la IP: si la IP cambia, la VM avisa a DuckDNS y
todos los subdominios la siguen sin tocar el DNS. Los certificados no dependen de la IP.

- **Al cambiar la IP:** la VM avisa al arrancar y cada 5 minutos; `/admin` vuelve en cuanto
  vencen las cachés del DNS (unos minutos). Los sitios públicos no se enteran.
- **Si DuckDNS se cae:** dejan de resolver `editor` y `pb`; los sitios públicos y sus
  formularios siguen en línea.

1. En duckdns.org, entrar (GitHub o Google), crear el subdominio y copiar el **token**.
2. En la VM (si falta cron: `apt install cron`):
   ```sh
   URL='https://www.duckdns.org/update?domains=SUBDOMINIO&token=TOKEN&ip='
   cat > /etc/cron.d/duckdns <<EOF
   @reboot root sleep 20 && curl -fsS -o /dev/null "$URL"
   */5 * * * * root curl -fsS -o /dev/null "$URL"
   EOF
   chmod 600 /etc/cron.d/duckdns
   ```
3. Comprobar: `curl "$URL"` responde `OK`, y desde tu máquina `dig +short
   SUBDOMINIO.duckdns.org` da la IP de la VM.

## Preparar la VM (una vez para todos los sitios)

Requisitos: Linux x86_64 con `sudo`, puertos 80 y 443 libres y 1 GB de RAM. Medido en un VPS
chico, un build llega a ~580 MB y tarda ~1 min la primera vez (genera las imágenes, sin la
caché de `node_modules/.astro`), y a ~450 MB en unos segundos después. Entra en la e2-micro
junto con los PocketBase (unos 20-30 MB cada uno sin uso) y el servidor web, porque los
builds de los sitios nunca corren a la vez; la swap de 1 GB es margen. Los comandos son para
Debian/Ubuntu; en AlmaLinux/Rocky cambian la instalación de paquetes (`dnf`) y `adduser`
(`useradd -m`).

1. Paquetes: `git`, `rsync`, `curl`, `unzip`, `lftp` (para los sitios en cPanel), `vnstat`
   (tráfico del mes, ver "Nivel gratuito") y Node 22.12 o más nuevo
   (de [nodejs.org](https://nodejs.org/en/download) o NodeSource; el de la distro suele ser
   viejo). Swap de 1 GB:
   ```sh
   fallocate -l 1G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
   echo '/swapfile none swap sw 0 0' >> /etc/fstab
   ```
2. El usuario `sites`, que corre los PocketBase y los builds de todos los sitios:
   ```sh
   adduser --disabled-password --gecos '' sites
   ```
3. Servidor web, uno de los dos para todos los sitios:
   - **Caddy** (HTTPS automático): [caddyserver.com/docs/install](https://caddyserver.com/docs/install).
   - **nginx**: `nginx` y `certbot` con su plugin (`python3-certbot-nginx`), `systemctl
     enable --now nginx`. En Debian/Ubuntu, borrar `/etc/nginx/sites-enabled/default` si
     atiende el puerto 80, y poner `map_hash_bucket_size 128;` en el bloque `http` de
     `/etc/nginx/nginx.conf` (antes de los `include`; ver el comentario del `nginx.conf` de
     cada sitio).
   - En AlmaLinux/Rocky con SELinux activo, permitir que el servidor web lea `/srv` y
     conecte con PocketBase: `setsebool -P httpd_can_network_connect 1`, y por sitio
     `semanage fcontext -a -t httpd_sys_content_t '/srv/<app>/(site|preview)(/.*)?'` y
     `restorecon -R /srv/<app>`.
4. Firewall: en Google Cloud, 80 y 443 los abren las casillas HTTP/HTTPS de la VM. Si la VM
   tiene además `ufw` o `firewalld`, abrir 80 y 443 ahí. Los puertos de PocketBase **no** se
   abren: solo escuchan en `127.0.0.1`.

## DNS (por sitio)

El DNS del dominio depende del sitio público: con Cloudflare Pages, en Cloudflare; con
cPanel, en la zona DNS del hosting. Los registros de cada sitio, con sus nombres, están en
su `deploy/despliegue.md`. Son dos, a la VM:

| Registro | Apunta a | Para qué |
|---|---|---|
| `editor` | `SUBDOMINIO.duckdns.org` (`CNAME`) | El editor `/admin` y la vista previa |
| `pb` | ídem | PocketBase (API de `/admin`) |

Los dos sin proxy (si el DNS tiene uno): la VM los atiende con su propio certificado y el
realtime de `/admin` no aguanta los cortes de un proxy.

## HTTPS (por sitio)

Los nombres que pide el navegador son `editor.<dominio>` y `pb.<dominio>`: el `CNAME` solo
dice a qué IP conectarse. El certificado tiene que ser de esos nombres; uno de
`SUBDOMINIO.duckdns.org` no sirve para ellos.

Los comandos, con los nombres de cada sitio, están en su `deploy/despliegue.md` ("Servicios y
servidor web"), justo después de poner la configuración del sitio. Antes, el DNS tiene que
apuntar a la VM (`dig +short editor.<dominio> pb.<dominio>` da su IP): Let's Encrypt
comprueba cada nombre por HTTP, en el puerto 80.

- **Caddy:** los pide y los renueva solo, al recargar con los bloques del sitio.
- **nginx:** con certbot, una vez por sitio y después de que nginx ya sirva su archivo
  (`/etc/nginx/conf.d/<app>.conf`, con `CLAVE` reemplazada y `nginx -t` sin errores):
  `certbot --nginx` pide el certificado y edita ese mismo archivo (agrega `listen 443 ssl`,
  las rutas del certificado y la redirección de 80 a 443). La renovación es automática
  (timer de certbot); `certbot renew --dry-run` la prueba. Al reemplazar el archivo por un
  `nginx.conf` nuevo del repo se pierden esas líneas: volver a correr el mismo
  `certbot --nginx` (reusa el certificado que ya tiene).

## Instalar un sitio (una vez por sitio)

Lo que necesita cada sitio (DNS, sitio público, archivos y su contenido, webhook) está en su
`deploy/despliegue.md`, con sus valores. El orden:

1. DNS y sitio público (sección "Sitio público" de la guía).
2. En la VM: carpetas y clon del repo, archivos de `/etc/<app>/`, servicios, servidor web
   con HTTPS ("HTTPS", arriba), permiso en `sudoers.d`.
3. Primer build (`systemctl start <app>-build`) y superusuario.
4. Contenido desde tu máquina (`npm run pb:import:prod`), webhook de GitHub y reconstruir.
5. Formularios, si el sitio los usa.

Lo que conviene saber:

- **Deploy keys:** GitHub no deja usar la misma en dos repos, así que cada sitio tiene la
  suya, con un nombre de host propio (`github-<app>`) en `~sites/.ssh/config`.
- **Variables:** `/etc/<app>/pocketbase.env` (secretos de PocketBase y del build),
  `build.env` (lo que el build mete en el sitio: URL pública, PocketBase, idiomas,
  formularios) y el del sitio público (`cpanel.env` o `cloudflare.env`; sin él el build no
  sube nada). Dueño root, `chmod 600`: systemd los lee antes de pasar a `sites`. Sin
  comentarios al final de una línea: systemd toma el valor entero.
- **Editor:** `EDITOR_EMAIL` / `EDITOR_PASSWORD` son el acceso inicial; después el editor
  cambia su contraseña en `/admin` → Mi cuenta.
- **Superusuario:** la cuenta técnica del dashboard (`https://pb.<dominio>/_/`), distinta de
  la del editor. Mientras no exista, PocketBase deja en el log de su servicio un enlace de
  instalación de un solo uso (`/_/#/pbinstall/...`). Con él, en el dashboard (`editors`): la
  contraseña del editor si la olvidó, o su correo.
- **Primer build:** instala PocketBase y lo arranca; sin contenido todavía el sitio sale
  vacío o el build falla. El contenido se importa desde tu máquina
  (`npm run pb:import:prod`) y se reconstruye.

## Vista previa

`editor.<dominio>` sirve **solo la vista previa**: el sitio con lo guardado (ocultos
incluidos), en las mismas URLs que el sitio público, con una barra "EDITOR · Vista previa"
(botones **Editar**, a `/admin`, y **Sitio publicado**). El sitio publicado está solo en el
hosting.

- **Acceso:** al entrar a `/admin`, este pide la clave a PocketBase (`PREVIEW_KEY`, solo para
  el editor) y pone la cookie `site_preview` (30 días; se renueva al abrir `/admin` y se borra
  al cerrar la sesión). Sin la cookie, el servidor web solo sirve `/admin` y `/_astro/`; lo
  demás redirige a `/admin/`. `PREVIEW_KEY` es obligatoria: en `pocketbase.env` y en lugar de
  `CLAVE` en el `Caddyfile` / `nginx.conf`.
- **Al día:** después de cada publicación el build la rearma (unos segundos o un minuto más,
  sin tráfico de salida), salvo que ya muestre lo mismo: armada con el mismo código, sin
  cambios de contenido desde entonces (`/srv/<app>/build/content-changed`, que reescribe
  PocketBase) y sin traducciones nuevas en esa publicación. El botón "Vista previa" de
  `/admin` la rearma con lo guardado en cualquier momento.
- Cada vista previa es un build completo y queda en la cola junto con las publicaciones. La
  del botón, por defecto, no llama al traductor: lo nuevo se ve en el idioma de origen en los
  otros idiomas hasta publicar, salvo que el editor pida "Traducir textos nuevos". Los
  formularios de la vista previa son los de verdad: lo que se envíe llega al buzón del sitio.

## Correo del dominio

Los buzones del dominio están en el hosting con cPanel. Lo que cambia es dónde está el DNS:
en la zona de cPanel (sitio público en cPanel) o en Cloudflare (sitio público en Pages).

- cPanel → **Email Routing**: el dominio en **Local Mail Exchanger**. Con los nameservers
  fuera del hosting (Cloudflare), cPanel puede detectarlo como "Remote" y entonces no entrega
  en sus propios buzones el correo del dominio.
- cPanel → **Email Deliverability**: SPF y DKIM válidos. Con el DNS en cPanel, **Repair** los
  corrige; con el DNS en Cloudflare, copiar los registros `TXT` que propone a Cloudflare →
  DNS.
- Los registros `MX` y `mail` apuntan al hosting; si se pierden (p. ej. al pasar el dominio
  a Cloudflare), el correo deja de llegar.

Los formularios de los sitios van por el relay de formularios (`kit/forms/relay/`), no por la
VM.

## Copias de seguridad

Lo único que hay que respaldar de cada sitio es `/srv/<app>/pocketbase/pb_data` (base SQLite
y archivos subidos): el sitio se regenera desde el repo y PocketBase.

- **Una por publicación con cambios de contenido:** al terminar de publicar, el build pide a
  PocketBase una copia (`publish-<id>.zip` en `pb_data/backups/`) si algo cambió desde la
  anterior. Quedan las 5 últimas. Mientras se arma, PocketBase queda unos segundos en solo
  lectura.
- **El editor la baja una vez:** en `/admin` (aviso de "Publicado" e Inicio) aparece
  "Descargar copia de seguridad (NN MB) — una sola vez". Bajada, el botón desaparece y el
  servidor no la vuelve a dar: cada descarga es tráfico de salida de la VM (ver "Nivel
  gratuito"). Es la copia fuera de la VM: conviene guardarla.
- **Sin backups automáticos del dashboard ni copia a S3:** el zip es entero (imágenes
  incluidas) y subirlo cada día a un bucket pasaría el GB de salida gratis. En
  `https://pb.<dominio>/_/` → Settings → Backups, **Enable auto backups** queda apagado.

**Restaurar**, desde `/admin` → **Copias de seguridad** (el editor): la lista de las copias de la
VM con **Restaurar**, y **Subir una copia** (un zip bajado antes; subir no gasta tráfico de
salida). Restaurar pide escribir RESTAURAR y:

1. guarda antes una copia del estado actual (`before-restore-<fecha>.zip`, para deshacerlo;
   quedan las 3 últimas, igual que las subidas);
2. reemplaza `pb_data` y PocketBase se reinicia solo (unos segundos);
3. al arrancar, PocketBase pide la vista previa con lo restaurado (`preview-auto`);
4. el sitio publicado no cambia hasta **Publicar**, que queda disponible aunque la base
   restaurada diga que todo estaba publicado (`/srv/<app>/build/restored`).

Lo mismo hace el superusuario en `https://pb.<dominio>/_/` → Settings → Backups (**Upload
backup** y **Restore**), sin la copia previa ni la vista previa automática: después, el
pedido a mano para regenerar el sitio. nginx deja subir hasta 1 GB a `pb.<dominio>`
(`client_max_body_size`). Si el dashboard no arranca, por consola, con el servicio detenido:

```sh
systemctl stop <app>-pocketbase
sudo -u sites mv /srv/<app>/pocketbase/pb_data /srv/<app>/pocketbase/pb_data.roto
sudo -u sites unzip BACKUP.zip -d /srv/<app>/pocketbase/pb_data
systemctl start <app>-pocketbase
sudo -u sites touch /srv/<app>/build/requests/manual
```

## Nivel gratuito

La VM y su disco entran en el nivel gratuito de Google Cloud, que es **una** e2-micro por
cuenta de facturación (todos los sitios van en la misma), con 30 GB de disco y **1 GB de
tráfico de salida al mes** para toda la VM. La CPU no se cobra por uso: los builds y las
vistas previas no cuestan. Lo que puede cobrar:

| Qué | Cuánto sale | Cómo se controla |
|---|---|---|
| Subidas por FTPS al hosting (sitios en cPanel) | Solo lo que cambió; un cambio que toca todas las páginas (menú, pie) sube todo el HTML | El build lo dice en cada publicación ("Subidos N MB; este sitio lleva M MB en el mes", en `/srv/<app>/build/egress-<año>-<mes>`) |
| El editor viendo la vista previa | Páginas e imágenes que abre; comprimido y con caché larga para `/_astro/` | Sin sesión no se sirve nada más que el login (ni bots ni curiosos) |
| Descargas de copias de seguridad | El zip entero cada vez | Una por publicación con cambios |
| IP externa | Revisar en Billing el primer mes | — |
| Snapshots de disco | No son gratis | No programarlos |

Lo que entra (npm, git, PocketBase, lo que sube el editor) no cuenta.

Redes de seguridad, una vez:

- **Alerta de presupuesto:** Billing → Budgets & alerts → Create budget, USD 1, con aviso por
  correo. Si algo empieza a cobrar, llega el mismo día.
- **Tráfico del mes:** `apt install vnstat` y después `vnstat -m` (cuenta toda la interfaz;
  la columna `tx` es la salida).
