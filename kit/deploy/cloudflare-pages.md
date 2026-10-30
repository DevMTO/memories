# Sitio público en Cloudflare Pages

Los visitantes ven el sitio en Cloudflare Pages, y el DNS del dominio está en Cloudflare.
El VPS (PocketBase, el editor `/admin` con su vista previa y los builds) se instala con
`kit/deploy/vps.md`. Al publicar, el VPS construye el sitio y lo sube a Pages
con `wrangler`.

La otra opción para el sitio público es un hosting compartido con cPanel (`cpanel.md`).

| Qué | Dónde | En el repo |
|---|---|---|
| Sitio para los visitantes | Cloudflare Pages (`example.com`), subido por el build con `wrangler` | `kit/deploy/build.sh` (`deploy_pages`) |
| Sitio para el editor (`/admin`) y vista previa | VPS, `editor.example.com` | `deploy/Caddyfile` o `deploy/nginx.conf` |
| PocketBase | VPS, `pb.example.com` | `pocketbase/`, `deploy/<PB_SERVICE>.service` |
| Build (botón "Publicar", push a `deploy`, vista previa) | VPS, `<unit>-build.service` | `kit/deploy/build.sh`, `deploy/<unit>-build.*` |
| Credenciales de Pages | VPS, `/etc/<app>/cloudflare.env` | — |
| HTTPS del sitio público | Cloudflare (automático) | — |
| DNS | Cloudflare | — |

## Cuándo conviene

- Las visitas no pasan por el VPS: no gastan su tráfico de salida ni su CPU.
- El sitio sigue en línea aunque el VPS esté caído; solo dejan de funcionar `/admin` y la
  publicación. Los formularios van por el relay PHP de un hosting con cPanel
  (`kit/forms/relay/`), no por el VPS.
- Gratis: Pages no cobra el tráfico ni los builds subidos.
- Hace falta una cuenta de Cloudflare con el dominio, que ya es el DNS del sitio.

## Instalarlo

La configuración, con los valores del sitio, está en su `deploy/despliegue.md`: secciones
"DNS", "Sitio público" y `cloudflare.env` en "Archivos en el VPS". Lo que conviene saber:

- **DNS en Cloudflare:** los subdominios son registros gratis y sin límite; el dominio en sí
  se sigue pagando en su registrador. Con los nameservers en Cloudflare, el DNS de cualquier
  otro panel (p. ej. el **Zone Editor** de cPanel, si el correo está en un hosting) deja de
  publicar nada: todo registro, también los del correo, va en Cloudflare. Al agregar el
  dominio, comprobar que se importaron los del correo (`MX`, `mail`, los `TXT` de SPF/DKIM)
  antes de cambiar los nameservers, o el correo deja de llegar.
- **`editor` y `pb` en DNS only** (nube gris): la VM los atiende con su propio certificado.
  Los del correo también quedan DNS only.
- **Token del build:** permiso **Account → Cloudflare Pages → Edit**, solo para tu cuenta.
- **Cabeceras:** el build agrega un `_headers` con la caché de los archivos con hash
  (`/_astro/*`: `Cache-Control: public, max-age=31536000, immutable`); el HTML usa el valor
  por defecto de Pages, que se revalida siempre.
- **`build.env`:** `SITE_URL` es la dirección de Pages, no la del editor (canónicos y
  `hreflang`); `EDITOR_URL` va en la redirección de `/admin`.
- **Dominio:** se conecta en Workers & Pages → el proyecto → Custom domains; si un registro
  `A` del dominio apunta a otro lado, Cloudflare pide borrarlo y crea el suyo con su
  certificado. `www` se redirige con la plantilla **Redirect from WWW to root**.

## Cómo se reconstruye

La automatización está en el VPS (ver "Cómo se despliega" en `kit/deploy/vps.md`). Al final
de cada build, `deploy_pages`:

- **Botón "Publicar"** (cambios de contenido) y **push a `deploy`** (cambios de código):
  construye, copia el sitio al editor y lo sube a Pages. Si el push no toca el sitio, no
  hay build ni subida.
- **Vista previa:** se arma y se sirve solo en el VPS; nunca se sube a Pages.
- **A mano:** `sudo -u <user> touch /srv/<app>/build/requests/manual`.

Cada subida:

- **`_redirects`:** el build escribe `dist/_redirects` con la redirección de `/admin` a
  `EDITOR_URL`.
- **Despliegue:** `wrangler pages deploy` sube el sitio como un despliegue nuevo de la rama
  `main`, con el commit. Pages sube solo los archivos que no tenía y cambia al despliegue
  nuevo de una vez: los visitantes nunca ven una mezcla.
- **Historial:** cada despliegue queda en el panel de Pages, desde donde se puede volver a
  uno anterior.
- **Si falla:** la publicación queda `failed` en `/admin` con el aviso "no se pudo subir a
  Cloudflare Pages". El sitio nuevo ya está en el editor y los visitantes siguen viendo el
  anterior; basta con volver a publicar.

## Problemas comunes

- **`Authentication error` / `10000`:** el token de `cloudflare.env` no tiene el permiso
  **Cloudflare Pages → Edit** o es de otra cuenta que `CLOUDFLARE_ACCOUNT_ID`.
- **`Project not found`:** `CF_PAGES_PROJECT` no coincide con el nombre del proyecto
  (Workers & Pages).
- **El dominio queda "Pending" o sin certificado:** quedó un registro `A`/`CNAME` de
  `example.com` apuntando a otro lado; borrarlo en Cloudflare → DNS.
- **`/admin` en `example.com` da 404:** el despliegue activo no tiene `_redirects`, p. ej.
  porque se subió a mano con `wrangler` sin pasar por `build.sh`. Volver a publicar.
- **Cambios que no se ven:** abrir el despliegue más reciente en Workers & Pages → el
  proyecto (debe tener el commit nuevo). Si está, es caché del navegador.
