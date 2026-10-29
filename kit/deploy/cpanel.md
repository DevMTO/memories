# Sitio público en un hosting compartido con cPanel

Los visitantes ven el sitio en un hosting compartido con cPanel (se asume Banahosting:
LiteSpeed, CloudLinux, sin SSH), y el DNS del dominio está en la zona DNS del hosting. El
VPS (PocketBase, el editor `/admin` con su vista previa y los builds) se instala con
`kit/deploy/vps.md`. Al publicar, el VPS construye el sitio y sube por FTPS a
`public_html` solo los archivos que cambiaron.

La otra opción para el sitio público es Cloudflare Pages (`cloudflare-pages.md`).

| Qué | Dónde | En el repo |
|---|---|---|
| Sitio para los visitantes | Hosting compartido (`example.com`, carpeta `public_html`), subido por el build por FTPS | `kit/deploy/build.sh` (`deploy_ftp`), `kit/deploy/templates/public*.htaccess*` |
| Sitio para el editor (`/admin`) y vista previa | VPS, `editor.example.com` | `deploy/Caddyfile` o `deploy/nginx.conf` |
| PocketBase | VPS, `pb.example.com` | `pocketbase/`, `deploy/<PB_SERVICE>.service` |
| Build (botón "Publicar", push a `deploy`, vista previa) | VPS, `<unit>-build.service` | `kit/deploy/build.sh`, `deploy/<unit>-build.*` |
| Credenciales de FTP | VPS, `/etc/<app>/cpanel.env` | — |
| HTTPS del sitio público | AutoSSL de cPanel | — |
| DNS | Zona DNS del hosting (cPanel → **Zone Editor**) | — |

## Cuándo conviene

- El sitio, el correo y el DNS quedan en el hosting que ya se paga. No hace falta ninguna
  cuenta más.
- Las visitas no pasan por el VPS. Las subidas sí salen del VPS: el tráfico de salida de la
  VM (1 GB al mes gratis en Google Cloud) lo gastan el editor y las subidas. Por eso cada
  publicación sube solo lo que cambió: una corrección de texto son unas pocas páginas
  HTML, no el sitio entero.
- El sitio sigue en línea aunque el VPS esté caído; solo dejan de funcionar `/admin` y la
  publicación (los formularios van por el relay, no por el VPS).
- El hosting no puede reemplazar al VPS. Un plan compartido no corre PocketBase ni el build:
  - no hay SSH (Banahosting no lo da en compartidos), solo FTP y el panel;
  - no hay procesos permanentes, y PocketBase tiene que estar siempre encendido;
  - CloudLinux limita CPU y memoria por cuenta, y `astro build` (con `sharp` para las
    imágenes) los pasaría.

## Instalarlo

Los pasos, con los valores del sitio, están en su `deploy/despliegue.md`: "Antes del VPS",
el `cpanel.env` en "En la VM" y "Después del primer build". Lo que conviene saber:

- **DNS:** los nameservers del dominio son los del hosting (si el dominio se contrató con el
  hosting, ya lo son). `editor` y `pb` son solo registros DNS a la VM en el **Zone Editor**:
  no se crean como subdominios en **Domains**, porque los atiende la VM, no el hosting.
- **Cuenta FTP limitada a `public_html`** (o a la carpeta del dominio): así el build no puede
  tocar nada fuera del sitio.
- **Servidor FTPS:** el nombre del servidor del hosting (el de **Configure FTP Client**, p.
  ej. `server123.banahosting.com`), que es el que figura en el certificado del FTP.
  `ftp.<dominio>` apunta al mismo lugar, pero el certificado suele no nombrarlo y la
  conexión falla. Puerto 21, FTPS explícito: el build no envía la contraseña sin cifrar.
  `CPANEL_FTP_DIR` (opcional, por defecto `/`) es la carpeta dentro de la cuenta FTP.
- **`public_html` vacío al empezar** (salvo `.well-known` y `cgi-bin`): el build borra solo
  lo que él mismo subió. Nada propio va en `public_html`; el relay de formularios, por
  ejemplo, va en un subdominio con su propia carpeta (`kit/forms/relay/`).
- Nada que configurar para PHP, bases de datos ni Node.js: el sitio son archivos.
- **`build.env`:** `SITE_URL` es la dirección del hosting, no la del editor (canónicos y
  `hreflang`); `EDITOR_URL` va en la redirección de `/admin`.
- **HTTPS y `www`:** AutoSSL de cPanel emite y renueva el certificado; `www` se redirige con
  un 301 en **Redirects**.

## Cómo se reconstruye

La automatización está en el VPS (ver "Cómo se despliega" en `kit/deploy/vps.md`). Al final
de cada build, `deploy_ftp`:

- **Botón "Publicar"** (cambios de contenido) y **push a `deploy`** (cambios de código):
  construye, copia el sitio al editor y lo sube al hosting. Si el push no toca el sitio, no
  hay build ni subida.
- **Vista previa:** se arma y se sirve solo en el VPS; nunca se sube al hosting.
- **A mano:** `sudo -u <user> touch /srv/<app>/build/requests/manual`.

Cada subida:

- **`.htaccess`:** con el sitio van dos `.htaccess` generados por el build: el de la raíz
  redirige `/admin` a `EDITOR_URL`, marca el HTML como `no-cache` y, si el sitio tiene
  `404.html`, lo usa como página de error; el de `_astro/` guarda un año los archivos con
  hash.
- **Qué sube:** compara el sitio nuevo con `/srv/<app>/build/ftp-state/` (copia de lo último
  subido) por contenido, no por fecha, y sube solo lo nuevo o cambiado.
- **Orden:** primero lo que no es HTML (CSS, JS, imágenes), después el HTML, así una página
  nunca llega antes que sus archivos. Al final borra lo que ya no está en el sitio.
- **Si falla:** la publicación queda `failed` en `/admin` con el aviso "no se pudo subir al
  hosting". El sitio nuevo ya está en el editor y los visitantes ven el anterior, o una
  mezcla si se cortó a mitad. `ftp-state/` no cambia, así que basta con volver a publicar:
  la próxima subida repite todo lo pendiente.

## Problemas comunes

- **`Login failed: 530`:** usuario o contraseña de `cpanel.env`. El usuario es la
  dirección completa (`deploy@example.com`).
- **Error de certificado** (`certificate verification failed`, `hostname mismatch`):
  `CPANEL_FTP_HOST` tiene que ser el nombre del servidor que muestra **Configure FTP
  Client**, no `ftp.example.com`.
- **`editor` o `pb` no resuelven:** los registros del Zone Editor tardan lo que diga su TTL
  (minutos). `dig +short editor.example.com` tiene que dar `SUBDOMINIO.duckdns.org.` y la
  IP de la VM.
- **Se corta a mitad o rechaza conexiones:** el hosting limita conexiones y velocidad por
  cuenta. `build.sh` usa una sola conexión con reintentos; volver a publicar completa lo
  pendiente.
- **El hosting quedó distinto de lo esperado** (alguien tocó archivos por el File Manager o
  se restauró un backup): borrar `/srv/<app>/build/ftp-state/` en el VPS y pedir un build a
  mano. La próxima subida vuelve a subir todo, sin borrar nada (el estado está vacío).
- **`/admin` en `example.com` da 404:** el `.htaccess` no llegó o el hosting no lee
  `.htaccess` en esa carpeta. Revisar que exista en `public_html` (File Manager →
  Settings → **Show Hidden Files**).
- **Cambios que no se ven:** el HTML lleva `Cache-Control: no-cache`, así que no es la
  caché. Revisar en el log del build que la página haya subido (`FTPS: …`).
