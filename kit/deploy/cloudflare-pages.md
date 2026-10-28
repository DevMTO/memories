# Sitio público en Cloudflare Pages

Los visitantes ven el sitio en Cloudflare Pages, y el DNS del dominio está en Cloudflare.
El VPS (PocketBase, el editor `/admin` con su vista previa y los builds) se instala con la
guía del servidor del proyecto. Al publicar, el VPS construye el sitio y lo sube a Pages
con `wrangler`.

La otra opción para el sitio público es un hosting compartido con cPanel (`cpanel.md`).

| Qué | Dónde | En el repo |
|---|---|---|
| Sitio para los visitantes | Cloudflare Pages (`example.com`), subido por el build con `wrangler` | `kit/deploy/build.sh` (`deploy_pages`), `public/_headers` |
| Sitio para el editor (`/admin`) y vista previa | VPS, `editor.example.com` | `deploy/Caddyfile` o `deploy/nginx.conf` |
| PocketBase | VPS, `pb.example.com` | `pocketbase/`, `deploy/pocketbase.service` |
| Build (botón "Publicar", push a `deploy`, vista previa) | VPS, `<unit>-build.service` | `kit/deploy/build.sh`, `deploy/<unit>-build.*` |
| Credenciales de Pages | VPS, `/etc/<app>/cloudflare.env` | — |
| HTTPS del sitio público | Cloudflare (automático) | — |
| DNS | Cloudflare | — |

## Cuándo conviene

- Las visitas no pasan por el VPS: no gastan su tráfico de salida ni su CPU.
- El sitio sigue en línea aunque el VPS esté caído; solo dejan de funcionar `/admin`, los
  formularios y la publicación.
- Gratis: Pages no cobra el tráfico ni los builds subidos.
- Hace falta una cuenta de Cloudflare con el dominio, que ya es el DNS del sitio.

## Antes del VPS (una vez)

1. **DNS en Cloudflare.** Los subdominios (`editor`, `pb` y los que hagan falta) son
   registros que se crean gratis y sin límite en Cloudflare → DNS → Records. El dominio en
   sí se sigue pagando en su registrador. Con los nameservers en Cloudflare, el DNS de
   cualquier otro panel (p. ej. el **Zone Editor** de cPanel, si el correo está en un
   hosting) deja de publicar nada: todo registro nuevo, también los del correo, va en
   Cloudflare.
   1. En Cloudflare (plan Free), **Add a site** con el dominio. Importa los registros DNS
      actuales: comprobar que estén los del correo (`MX`, `mail`, los `TXT` de SPF/DKIM)
      antes de cambiar nada, o el correo deja de llegar. Los de `example.com` y `www` se
      cambian después del primer build.
   2. En el registrador del dominio, cambiar los nameservers por los dos que indica
      Cloudflare. Cloudflare avisa por correo cuando el dominio queda activo (minutos u
      horas).
   3. DNS → Records → **Add record**, los dos del VPS, **DNS only** (nube gris):

      | Type | Name | Target |
      |---|---|---|
      | `CNAME` | `editor` | `SUBDOMINIO.duckdns.org` (el nombre fijo de la VM) |
      | `CNAME` | `pb` | ídem |

      En **Name** va solo el subdominio: Cloudflare completa `editor.example.com`. Los
      registros del correo también quedan DNS only.
2. **El proyecto de Pages**, desde tu máquina (abre el navegador para entrar a Cloudflare):
   ```sh
   npx wrangler login
   npx wrangler pages project create NOMBRE --production-branch=main
   ```
   `NOMBRE` (p. ej. el nombre del sitio) es `CF_PAGES_PROJECT`.
3. **Token para que el build suba el sitio:** My Profile → API Tokens → Create Token →
   Custom token, permiso **Account → Cloudflare Pages → Edit**, solo para tu cuenta. El
   Account ID está en Workers & Pages (columna derecha).
4. **Cabeceras:** el proyecto tiene `public/_headers` con la caché de los archivos con hash:
   ```
   /_astro/*
     Cache-Control: public, max-age=31536000, immutable
   ```
   El HTML usa el valor por defecto de Pages, que se revalida siempre.

## En el VPS (una vez)

En el paso de los archivos de entorno de la guía del servidor, además,
`/etc/<app>/cloudflare.env` (`chmod 600`, dueño root; solo lo lee el build, no PocketBase):

```sh
CF_PAGES_PROJECT=NOMBRE
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_API_TOKEN=...
```

- Sin este archivo el build no sube nada y el sitio queda solo en el VPS.
- `SITE_URL` de `build.env` es la dirección de Pages (`https://example.com`), no la del
  editor: con ella se arman los canónicos y `hreflang`.
- `EDITOR_URL` va en la redirección de `/admin`.

## Después del primer build (una vez)

Cuando el VPS ya construyó el sitio con contenido (último paso de la guía del servidor):

1. **Dominio:** Workers & Pages → el proyecto → Custom domains → **Set up a custom domain**
   → `example.com`. Si existe un registro `A` de `example.com` que apunta a otro lado (el
   hosting anterior), Cloudflare pide borrarlo. Después crea el registro nuevo y el
   certificado.
2. **`www`:** Rules → Redirect Rules → plantilla **Redirect from WWW to root** (pide un
   registro `www` con proxy; la plantilla explica cuál).
3. **Comprobar** desde tu máquina:
   ```sh
   curl -I https://example.com/                 # 200
   curl -I https://example.com/admin/           # 302 a https://editor.example.com/admin/
   curl -I https://example.com/_astro/<un archivo de dist/_astro>   # Cache-Control: … immutable
   ```

## Cómo se reconstruye

La automatización está en el VPS (ver "Cómo se despliega" en la guía del servidor). Al
final de cada build, `deploy_pages`:

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
