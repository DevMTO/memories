# Memories Travel Perú

Sitio estático en Astro (es/en/pt) cuyo contenido (tours, trekkings, paquetes, destinos y
datos de contacto) vive en PocketBase y se edita desde `/admin`. El build lee PocketBase,
traduce y genera HTML; los visitantes nunca consultan PocketBase. El formulario de
cotización abre WhatsApp con la solicitud armada.

El editor, PocketBase, el traductor y la publicación son los de `kit/` (ver
`kit/README.md`); aquí está lo propio del sitio.

## Desarrollo local

Requisitos: Node 22.12 o superior y `unzip` (para PocketBase). PocketBase no se instala en
el sistema: `npm run pb` (y los demás `pb:*`) descarga en `pocketbase/bin/` la versión de
`pocketbase/version`.

### Solo el sitio (estilos, plantillas)

```sh
npm ci
cp .env.example .env
npm run dev    # http://localhost:4321
```

`npm run dev` lee el contenido inicial (`src/lib/seed.ts`: `src/data/*.seed.json` y las
imágenes de `public/images/`), sin PocketBase. Los cambios al seed se ven al reiniciar.
`/admin` no funciona en este modo. La primera vez traduce todos los textos (unos minutos);
después usa `.cache/i18n/`.

### Con PocketBase (editor, build)

Primera vez:

1. En `.env`, completar `SITE_URL=http://localhost:4321`,
   `PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090` y las cuentas locales (pueden ser datos
   inventados, p. ej. `admin@local.test`):
   - `POCKETBASE_SUPERUSER_EMAIL` / `POCKETBASE_SUPERUSER_PASSWORD`: dashboard de PocketBase.
   - `EDITOR_EMAIL` / `EDITOR_PASSWORD`: inicio de sesión de `/admin` (el acceso inicial;
     después la contraseña se cambia en `/admin` → Mi cuenta).
2. Superusuario (no necesita el servidor encendido): `npm run pb:superuser`.
3. En una terminal, PocketBase (aplica las migraciones y crea el editor): `npm run pb`.
4. En otra terminal, el contenido inicial: `npm run pb:import`. Se puede repetir: solo crea
   lo que falta y completa campos e imágenes vacíos, sin tocar lo que se cambió en
   `/admin`. `npm run pb:import -- --overwrite` devuelve el contenido importado a los
   valores del seed.

Día a día, dos terminales:

```sh
npm run pb       # terminal 1: PocketBase en http://127.0.0.1:8090
npm run dev:pb   # terminal 2: sitio en http://localhost:4321
```

PocketBase tiene que estar encendido **antes** de `npm run dev:pb`: Astro lee el contenido
al arrancar. Lo que se cambia en `/admin` se ve en el sitio al reiniciar `npm run dev:pb`
(en producción, con el botón "Publicar"). Solo aparece lo publicado, no los borradores.

| Qué | Dónde | Cuenta |
|---|---|---|
| Sitio | http://localhost:4321 | — |
| Editor | http://localhost:4321/admin/ | `EDITOR_EMAIL` |
| Dashboard de PocketBase | http://127.0.0.1:8090/_/ | `POCKETBASE_SUPERUSER_EMAIL` |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | `astro dev` con el contenido inicial (sin PocketBase) |
| `npm run dev:pb` | `astro dev` con el PocketBase local (necesita `npm run pb`) |
| `npm run pb` | PocketBase local con las variables de `.env` |
| `npm run pb:superuser` | Crea/actualiza el superusuario local |
| `npm run pb:import` | Importa el contenido inicial al PocketBase local |
| `npm run pb:import:prod` | Lo mismo contra producción (`.env.production`) |
| `npm run pb:install` | Solo descarga el binario de PocketBase |
| `npm run pb:schema` | Regenera `src/lib/pocketbase-types.ts` desde las migraciones |
| `npm run build` | Build de producción (`.env.production`); lo corre el VPS |
| `npm run build:local` | Build contra el PocketBase local (`.env`) |
| `npm run build:static` | Build con el contenido inicial (sin PocketBase) |
| `npm run preview` | Sirve `dist/` |
| `npm run translate` | Llena la caché de traducciones sin hacer build |
| `npm run check:catalog` | Valida `src/data/catalog.seed.json` (textos, listas e imágenes) |
| `npm run build:hero_reel` | Regenera el video del hero (abajo) |

## Dónde está cada cosa

```text
pocketbase/pb_migrations/   colecciones del sitio (products, destinations, settings)
src/lib/seed.ts             contenido inicial, con src/data/*.seed.json
src/content.config.ts       colecciones de Astro: leen PocketBase o el seed
src/lib/services/           lo que leen las páginas (catálogo, destinos, contacto)
src/pages/[...lang]/        páginas, una por idioma (inglés en la raíz, DEFAULT_LANG)
src/i18n/                   textos de interfaz y qué campos se traducen
src/admin/                  configuración de /admin (secciones, campos, itinerario)
deploy/                     servicios de systemd, Caddyfile y nginx.conf del VPS
```

Los textos de interfaz se escriben en español dentro de `t('…')` (ver `src/i18n/i18n.ts`);
el traductor del kit los encuentra en el código y los traduce en el build.

## Documentación

- `kit/README.md`: el editor, PocketBase, el traductor y la publicación del kit, y cómo
  actualizarlo con `kit/sync.sh`.
- `deploy/despliegue.md`: lo que necesita este sitio en el VPS y en el hosting (DNS, archivos
  y su contenido, webhook), generado desde `deploy/site.env`. La VM se prepara con
  `kit/deploy/vps.md`.
- `kit/deploy/cpanel.md`: el sitio público en el hosting con cPanel.

## Carrusel de video del hero

El hero utiliza un único archivo optimizado `public/videos/hero/hero_reel.mp4` de 720p, 24 fps, sin audio y con `faststart`. Se mantiene en H.264/MP4 porque ofrece la compatibilidad de autoplay más amplia —incluido Safari— y evita duplicar un reel de aproximadamente dos minutos con una segunda descarga WebM.

Los videos originales no se publican. El conjunto local debe incluir `machupicchu.mp4` y `machupicchu-ciudadela.mp4`. Para regenerar el reel, extrae los videos en una carpeta local y ejecuta:

```bash
npm run build:hero_reel -- --input ./carrusel
```

El generador crea cortes de 3 y 4 segundos, intercala la primera parte de todos los destinos, continúa con la segunda parte de cada uno y genera también el poster y el manifiesto de tiempos usado por los controles del hero.
