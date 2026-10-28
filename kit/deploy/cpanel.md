# Sitio público en un hosting compartido con cPanel

Los visitantes ven el sitio en un hosting compartido con cPanel (se asume Banahosting:
LiteSpeed, CloudLinux, sin SSH), y el DNS del dominio está en la zona DNS del hosting. El
VPS (PocketBase, el editor `/admin` con su vista previa y los builds) se instala con la
guía del servidor del proyecto. Al publicar, el VPS construye el sitio y sube por FTPS a
`public_html` solo los archivos que cambiaron.

La otra opción para el sitio público es Cloudflare Pages (`cloudflare-pages.md`).

| Qué | Dónde | En el repo |
|---|---|---|
| Sitio para los visitantes | Hosting compartido (`example.com`, carpeta `public_html`), subido por el build por FTPS | `kit/deploy/build.sh` (`deploy_ftp`), `kit/deploy/templates/public*.htaccess*` |
| Sitio para el editor (`/admin`) y vista previa | VPS, `editor.example.com` | `deploy/Caddyfile` o `deploy/nginx.conf` |
| PocketBase | VPS, `pb.example.com` | `pocketbase/`, `deploy/pocketbase.service` |
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
- El sitio sigue en línea aunque el VPS esté caído; solo dejan de funcionar `/admin`, los
  formularios y la publicación.
- El hosting no puede reemplazar al VPS. Un plan compartido no corre PocketBase ni el build:
  - no hay SSH (Banahosting no lo da en compartidos), solo FTP y el panel;
  - no hay procesos permanentes, y PocketBase tiene que estar siempre encendido;
  - CloudLinux limita CPU y memoria por cuenta, y `astro build` (con `sharp` para las
    imágenes) los pasaría.

## Antes del VPS (una vez)

En cPanel:

1. **DNS:** los nameservers del dominio (en su registrador) son los del hosting
   (p. ej. `ns1.banahosting.com` y `ns2.banahosting.com`); si el dominio se contrató con el
   hosting, ya lo son. `example.com`, `www` y los registros del correo ya apuntan al hosting.
   Faltan los dos del VPS, en **Zone Editor** → el dominio → **Manage**:

   | Type | Name | Record |
   |---|---|---|
   | `CNAME` | `editor.example.com.` | `SUBDOMINIO.duckdns.org.` (el nombre fijo de la VM) |
   | `CNAME` | `pb.example.com.` | ídem |

   Solo registros DNS: no se crean como subdominios en **Domains**, porque los atiende el
   VPS, no el hosting.
2. **Cuenta FTP solo para el build:** **FTP Accounts** → crear una cuenta (p. ej.
   `deploy@example.com`) con contraseña larga y **Directory** = `public_html` (o la carpeta
   del dominio adicional si el sitio no es el dominio principal). Así el build no puede
   tocar nada fuera del sitio.
3. **Servidor FTPS:** en esa cuenta, **Configure FTP Client** muestra el servidor. Usar el
   nombre del servidor del hosting (p. ej. `server123.banahosting.com`), que es el que
   figura en el certificado del FTP. `ftp.example.com` apunta al mismo lugar, pero el
   certificado suele no nombrarlo y entonces la conexión falla. Puerto 21, FTPS explícito
   (el build lo exige: no envía la contraseña sin cifrar).
4. **Vaciar `public_html`** del sitio anterior (File Manager), salvo `.well-known` y
   `cgi-bin`.
   - El build borra solo archivos que él mismo subió; cualquier otro archivo en
     `public_html` queda ahí indefinidamente.
   - Nada propio va en `public_html`. Los relays PHP (`kit/forms/relay/`), por ejemplo, van
     en un subdominio con su propia carpeta.
5. Nada que configurar para PHP, bases de datos ni Node.js: el sitio son archivos.

## En el VPS (una vez)

- **Paquetes:** en el paso de paquetes de la guía del servidor, además `lftp`
  (`apt install lftp`).
- **Archivos de entorno:** en ese paso, además `/etc/<app>/cpanel.env` (`chmod 600`, dueño
  root; solo lo lee el build, no PocketBase):
  ```sh
  CPANEL_FTP_HOST=server123.banahosting.com
  CPANEL_FTP_USER=deploy@example.com
  CPANEL_FTP_PASSWORD=...
  ```
  - `CPANEL_FTP_DIR` (opcional, por defecto `/`) es la carpeta dentro de la cuenta FTP. Con
    la cuenta de arriba, la raíz ya es `public_html`.
  - Sin este archivo el build no sube nada y el sitio queda solo en el VPS.
- **`build.env`:**
  - `SITE_URL=https://example.com`: la dirección del hosting, no la del editor. Con ella se
    arman los canónicos y `hreflang`.
  - `EDITOR_URL`: va en la redirección de `/admin`.
- **Servicio de build:** el `<unit>-build.service` que genera `kit/deploy/render.sh` lee
  `cpanel.env` si existe.

## Después del primer build (una vez)

Cuando el VPS ya construyó el sitio con contenido (último paso de la guía del servidor):

1. **HTTPS:** cPanel → **SSL/TLS Status**: `example.com` y `www` tienen que tener
   certificado. AutoSSL lo emite y lo renueva solo; **Run AutoSSL** lo fuerza.
2. **`www`:** cPanel → **Redirects** → permanente (301) de `www.example.com` a
   `https://example.com/`.
3. **Comprobar** desde tu máquina:
   ```sh
   curl -I https://example.com/                 # 200, Cache-Control: no-cache
   curl -I https://example.com/admin/           # 302 a https://editor.example.com/admin/
   curl -I https://example.com/_astro/<un archivo de dist/_astro>   # Cache-Control: … immutable
   ```

## Cómo se reconstruye

La automatización está en el VPS (ver "Cómo se despliega" en la guía del servidor). Al
final de cada build, `deploy_ftp`:

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
