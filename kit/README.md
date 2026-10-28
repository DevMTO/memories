# kit/

Piezas comunes a los sitios Astro con contenido en PocketBase: editor `/admin`, backend
PocketBase, traducción automática, publicación con vista previa, seed e imágenes, y
formularios. Nada de `kit/` importa del proyecto (`src/`): lo propio de cada sitio entra
por configuración.

**El kit se edita en un solo proyecto, el de origen**, y se copia a los demás con
`kit/sync.sh <proyecto>` desde ahí. La copia deja `kit/VERSION` (commit de origen) y
`kit/.manifest`; si alguien cambió el kit en el destino, `sync.sh` no lo pisa y muestra
qué cambió, para llevarlo al origen.

## Módulos

| Carpeta | Qué es | Depende de |
|---|---|---|
| `content/` | Lectura de contenido: PocketBase en el build o el seed (`CONTENT_SOURCE=seed`), imágenes optimizadas, carga de `.env` | — |
| `i18n/` | Traducción automática en el build con caché y correcciones manuales | `content/` (lo usa el proyecto para dar los textos) |
| `admin/` | Editor `/admin` (isla de React) | PocketBase módulo `core` |
| `admin/i18n/` | Pantalla "Traducciones" de `/admin` | `i18n/`, PocketBase módulo `i18n` |
| `admin/inbox/` | Bandeja de `/admin` (contactos y pestañas propias) | PocketBase módulo `forms` |
| `pocketbase/` | Migraciones y hooks por módulo (`core`, `i18n`, `forms`) y scripts (binario, servidor local, tipos, importar el seed) | — |
| `site/` | Componentes del sitio: hreflang y aviso de vista previa | — |
| `forms/` | Envío de formularios del sitio (`forms.ts`) y relays PHP para hostings con cPanel | PocketBase módulo `forms`, o `forms/relay/` |
| `deploy/` | Build y publicación en el VPS (`build.sh`) y plantillas de systemd, Caddy y nginx | todo lo anterior |

Requisitos: Astro 7, Node 22+ (corre `.ts` directamente), `react`/`react-dom` y
`@astrojs/react` (para `/admin`), `pocketbase` (SDK), `sharp` y `pocketbase-typegen`
(scripts).

## Llevarlo a un proyecto

1. `kit/sync.sh ../proyecto` desde el proyecto de origen.
2. `package.json`:
   - `"imports": { "#src/*": "./src/*", "#kit/*": "./kit/*" }`. `#kit/...` siempre con
     extensión (`#kit/admin/AdminApp.tsx`), porque también lo resuelve Node.
   - Las dependencias en `dependencies`/`devDependencies`. Si `@astrojs/react` no está
     declarado, el build falla con `Received protocol 'astro:'`.
   - Scripts (las secciones de abajo usan estos nombres):
     ```json
     "dev": "astro dev",
     "dev:pb": "astro dev --mode pocketbase",
     "build": "astro build",
     "build:static": "astro build --mode seed",
     "translate": "node --env-file-if-exists=.env scripts/translate.ts",
     "pb": "node --env-file=.env kit/pocketbase/scripts/pocketbase.ts serve",
     "pb:superuser": "node --env-file=.env kit/pocketbase/scripts/pocketbase.ts superuser",
     "pb:install": "node kit/pocketbase/scripts/pocketbase.ts install",
     "pb:schema": "node kit/pocketbase/scripts/pocketbase.ts schema src/lib/pocketbase-types.ts",
     "pb:import": "node --env-file=.env scripts/pb-import.ts"
     ```
3. `tsconfig.json`: los `.js` de PocketBase no son del proyecto TypeScript (su referencia
   a `pb_data/types.d.ts` falla si PocketBase nunca corrió):
   `"exclude": ["dist", "dist-preview", "kit/pocketbase/*/migrations", "kit/pocketbase/*/hooks", "pocketbase"]`.
4. PocketBase: `pocketbase/version` (p. ej. `0.40.5`), `pocketbase/kit.json` con los
   módulos y las migraciones/hooks propios en `pocketbase/pb_migrations` y
   `pocketbase/pb_hooks`. `.gitignore`: `pocketbase/bin/`, `pocketbase/pb_data/`,
   `pocketbase/.run/`, `.cache/`.
5. Contenido, traductor, `/admin`, formularios y deploy: cada sección de abajo.

## content/: de dónde sale el contenido

`astro.config.mjs` empieza con `setupEnv()` (carga `.env.<modo>` y `.env` y elige el
origen) y usa `pocketbaseImageDomains()` en `image.domains`:

```js
import { pocketbaseImageDomains, setupEnv } from '#kit/content/setup.ts';
setupEnv();
export default defineConfig({ site: process.env.SITE_URL || undefined, image: { domains: pocketbaseImageDomains() }, … });
```

| Comando | Contenido |
|---|---|
| `astro dev` | seed |
| `astro dev --mode pocketbase` | `PUBLIC_POCKETBASE_URL` |
| `astro build` | `PUBLIC_POCKETBASE_URL` |
| `astro build --mode seed` | seed (sitio estático sin PocketBase; `/admin` muestra un aviso) |

El proyecto arma su lector una vez (`src/lib/pocketbase.ts`) y su seed (`src/lib/seed.ts`):

```ts
// src/lib/pocketbase.ts
import { createContent } from '#kit/content/pocketbase.ts';
export { fileUrl, formsEndpoint, optional, type PbRecord } from '#kit/content/pocketbase.ts';
export const { fetchAll } = createContent({ seed: async () => (await import('#src/lib/seed.ts')).seed });

// src/lib/seed.ts: colección de PocketBase → registros { id, fields, images }
import { defineSeed, readJsonDir } from '#kit/content/seed.ts';
export const seed = defineSeed({
  load: async () => ({
    tours: (await readJsonDir('scripts/data/seed/tours')).map(({ slug, data }) => ({
      id: slug, fields: { slug, status: 'published', name: data.name }, images: { cover: data.cover_url },
    })),
  }),
  relations: { tours: { destination: 'destinations' } }, // campo de relación → colección
});
```

- **`fetchAll` se usa en los loaders de `src/content.config.ts`**, no en las páginas: los
  loaders corren desde el código fuente y las páginas se empaquetan. Por lo mismo, las
  rutas del seed van relativas a la raíz del proyecto (`process.cwd()`), no a
  `import.meta.url`.
- Las imágenes: `localImage(url, ancho)` de `#kit/content/images.ts` las descarga y
  optimiza en el build (con el seed deja la URL original).
- **Imágenes provisionales:** el contenido del seed se trata como provisional, y sus
  imágenes también. En `images` van, como texto:
  - rutas de `src/` (p. ej. `src/assets/cusco.webp`, la convención de Astro): el sitio las
    optimiza con o sin el seed, como un `import`. Las imágenes de `src/` que el sitio no
    usa van en carpetas que empiecen con `_` (p. ej. `src/assets/_archivo/`), o el build
    las copia igual;
  - rutas de `public/` que empiezan con `/` (p. ej. `/images/cusco.webp`): con el seed se
    sirven tal cual, sin optimizar, como todo `public/`;
  - URLs.

  Un campo de varias imágenes (galería, `images()` en las migraciones) lleva una lista de
  esas rutas; en los loaders, `fileUrls(record, record.gallery)` da sus URLs.

  `pb:import` sube cualquiera de las tres a PocketBase, y desde ahí el sitio las optimiza
  igual. No sirve un `import` de la imagen: el seed corre en Node, sin Vite.
- Importar el seed a PocketBase: `npm run pb:import` crea los registros que faltan y, en
  los que ya existen, solo completa los campos e imágenes vacíos (texto o lista vacía,
  relación o imagen sin valor; un número o un sí/no cuentan como puestos). Lo que el editor cambió en
  `/admin` (textos o imágenes reemplazadas) nunca se pisa, así que se puede repetir sin
  miedo. `-- --overwrite` devuelve los registros existentes a los valores del seed (las
  imágenes que ya tienen se mantienen), para rehacer una base de desarrollo; `-- --optimize`
  sube las imágenes reducidas en WebP. `matchKey` dice con qué campo se reconoce cada
  registro en PocketBase:
  ```ts
  // scripts/pb-import.ts
  import { importSeed, key } from '#kit/pocketbase/scripts/import.ts';
  import { seed } from '#src/lib/seed.ts';

  await importSeed({
    seed,
    matchKey: { tours: (f) => key(f.slug), settings: () => '' }, // '' = registro único
    userAgent: 'misitio-import/1.0 (https://misitio.com)', // Wikimedia lo exige
  });
  ```

## i18n/: traducción automática

El sitio se escribe en español (`sourceLang` en `kit/i18n/locales.ts`). Los idiomas de
`ENABLED_LANGS` (p. ej. `es,en,pt`) se traducen en el build con el endpoint gratuito de
Google (`provider.ts`; para otro proveedor se reemplaza solo ese archivo). Lo traducido
queda en `.cache/i18n/`. Las correcciones manuales (colección `translation_overrides`,
módulo PocketBase `i18n`) ganan siempre. Si el traductor falla, el build sigue y esos
textos salen en español.

```js
// astro.config.mjs
import { parseLangs } from '#kit/i18n/locales.ts';
import { translations } from '#kit/i18n/integration.ts';
import { translationConfig } from '#src/i18n/translation.ts';
integrations: [translations(parseLangs(process.env.ENABLED_LANGS), translationConfig)]
```

```ts
// src/i18n/translation.ts: qué se traduce
export const translationConfig: TranslationConfig = {
  sources: async () => [...collectDeep(strings), ...(await fetchAll('tours')).flatMap((r) => collectStrings(r, tourFields))],
  overrides: async () => (await fetchAll('translation_overrides')).map(({ lang, source, text }) => ({ lang, source, text })),
  protectedTerms: ['Nombre De La Marca'],
};
```

El idioma que se sirve sin prefijo (`/`) es `DEFAULT_LANG`, por defecto el español; los
demás van en `/<idioma>/`. Con `DEFAULT_LANG=en`, por ejemplo, el inglés (traducido) queda
en `/` y el español en `/es/`. `getLangParams`, `getLang`, `getBasePath` y `getHomePath`
lo siguen, y en `/admin` se pasa a `translationsScreen(langs, { defaultLang })` para que la
vista previa de traducciones abra las páginas en su URL.

En las páginas: `localizeRecord(record, fields, getTranslate(lang))` y
`localizeDeep(strings, getTranslate(lang))`. Las rutas van en `src/pages/[...lang]/` con
`getStaticPaths: () => getLangParams().map((params) => ({ params }))` y
`getLang(Astro.params.lang)`. `npm run translate` llena la caché sin build.

## admin/: el editor

Una página estática con la isla. La configuración tiene funciones (`label`, `Screen`…),
que no pasan como props de Astro a la isla: se arma dentro de ella.

```tsx
// src/admin/App.tsx
import { AdminApp } from '#kit/admin/AdminApp.tsx';
import { adminConfig } from '#src/admin/config.tsx'; // (langs) => AdminConfig

export default function App({ pocketbaseUrl, langs }: { pocketbaseUrl: string; langs: string[] }) {
  return <AdminApp config={adminConfig(langs)} pocketbaseUrl={pocketbaseUrl} />;
}
```

```astro
---
// src/pages/admin.astro (fuera de [...lang])
import App from '#src/admin/App.tsx';
import { translatedLangs } from '#kit/i18n/locales.ts';
import '#kit/admin/admin.css';
---
<html lang="es">
  <head><meta charset="utf-8" /><meta name="robots" content="noindex, nofollow" /></head>
  <body><App client:only="react" pocketbaseUrl={process.env.PUBLIC_POCKETBASE_URL} langs={translatedLangs} /></body>
</html>
```

`AdminConfig` (`kit/admin/config.ts`):

- `brand` (nombre en la barra y el login).
- `sections`, en el orden del menú (el tablero "Inicio" va siempre primero).
- `locale` (fechas, por defecto `es-PE`).
- `siteUrl` (enlace "Ver sitio", por defecto `/`).
- `translations: true` si el sitio usa `kit/i18n`.

Hay tres tipos de sección:

- **`collection`**: lista + ficha de una colección.
  - `key` (segmento de la URL), `collection`, `title`, `singular`, `label(record)`.
  - `filter` y `defaults` cuando varias secciones comparten colección (`defaults`
    también reconoce a qué sección pertenece un registro borrado).
  - `sortable`, `thumb`, `sitePath(record)`, `usedIn` (avisa al borrar algo elegido en
    otro lado), `duplicate(record)`.
- **`single`**: colección de un solo registro (lo crea una migración).
- **`screen`**: pantalla propia. `Screen` recibe el resto de la ruta, `useBadge` pone un
  número en el menú y `content` la suma a "cambios sin publicar". Listas para usar:
  `translationsScreen(langs)` (`#kit/admin/i18n/index.tsx`) e `inboxScreen([leadsTab,
  …])` (`#kit/admin/inbox/`).

Los campos de `fields` van en orden; `{ section: 'Título' }` separa grupos. Tipos:

- `text`, `email`, `url`, `textarea` (con `max`), `number`, `slug`.
- `status`: interruptor Visible/Oculto.
- `bool`: interruptor Sí/No.
- `lines`: lista de textos cortos (campo JSON con un arreglo de strings), uno por línea.
- `image`: con `minWidth` y `frames: { label, ratio, overlay?, round? }` para mostrar el
  recorte.
- `images`: galería (campo de archivos con `maxSelect` > 1, como `images()` de
  `schema.js`), con `minWidth` y `max`. Las imágenes se agregan, quitan y reordenan.
- `relation`: `collection`, `filter`, `multiple`.
- `custom`: lo propio del proyecto:
  ```tsx
  const days: CustomField<Day[]> & { name: string; label: string } = {
    name: 'itinerary',
    label: 'Días',
    type: 'custom',
    initial: (value) => (Array.isArray(value) ? value : []), // del registro al formulario
    clean: (list) => list, // del formulario a PocketBase
    isEmpty: (list) => list.length === 0, // para `required`
    validate: (list) => (list.some((d) => !d.title) ? 'Cada día necesita un título.' : undefined),
    Input: ({ id, value, onChange }) => <DaysEditor id={id} value={value} onChange={onChange} />,
  };
  ```

Lo que el editor da por hecho de PocketBase:

- Usuario en `editors`; las reglas lo reconocen con
  `@request.auth.collectionName = "editors"`.
- Colecciones `publishes` y `revisions` (módulo `core`).
- Convenciones de campos:
  - `status`: `draft` | `published`; la lectura pública filtra `status = "published"`.
  - `slug`.
  - `sort_order`, para `sortable`.
  - `updated`: autodate, que calcula qué falta publicar.

Las pantallas propias pueden usar `pb()`/`errorMessage` (`lib/pocketbase.ts`),
`useUnsavedGuard` (`lib/router.ts`), `SortableList` y las clases de `admin.css`. Las
pestañas propias de la bandeja son un `InboxTab`:

```tsx
const quotesTab: InboxTab = {
  key: 'cotizaciones', // #/bandeja/cotizaciones
  label: 'Cotizaciones',
  collection: 'quotes',
  pendingFilter: 'status = "new"', // el número del menú y "Solo nuevas"
  pendingLabel: 'Solo nuevas',
  Badge: ({ record }) => <span className="badge">{record.status}</span>,
  Detail: ({ record, onSaved }) => <QuoteDetail record={record} onSaved={onSaved} />,
};
inboxScreen([leadsTab, quotesTab]);
```

## pocketbase/: backend

`pocketbase/kit.json` elige los módulos (`core` va siempre):

```json
{ "modules": ["core", "i18n", "forms"] }
```

| Módulo | Colecciones | Hooks |
|---|---|---|
| `core` | `editors`, `publishes`, `revisions`; API batch, proxy de confianza, límite de `/api/files/` | `publish.pb.js` (`/api/publish`, `/api/preview`), `deploy.pb.js` (webhook de push), `editor.pb.js` (editor único desde `EDITOR_EMAIL`/`EDITOR_PASSWORD`), `revisions.pb.js` |
| `i18n` | `translation_overrides` | — |
| `forms` | `leads` (+ límite 5 por IP cada 10 min) | `leads.pb.js`: trampa para bots y aviso por correo |

`npm run pb` junta las migraciones y hooks de los módulos con los del proyecto en
`pocketbase/.run/` y levanta PocketBase. Al cambiar un hook, se reinicia. El VPS hace lo
mismo en cada build (`kit/deploy/build.sh`). Las migraciones del kit no hacen nada si la
colección ya existe, así que se pueden sumar a un proyecto que ya tiene esa colección. Las del
proyecto van con fecha posterior a `1700000300`.

### Contrato de esquema

Cada proyecto define sus colecciones (catálogo, páginas…) en `pocketbase/pb_migrations/`;
el kit no impone ninguna. Sí da por hecho:

- **Nombres reservados:** `editors`, `publishes`, `revisions` (módulo `core`),
  `translation_overrides` (`i18n`) y `leads` (`forms`).
- **Campos con significado en `/admin`** (en las colecciones que lo usan):

  | Campo | Para qué |
  |---|---|
  | `status` (`draft` / `published`) | Interruptor Visible/Oculto; la lectura pública filtra `status = "published"` |
  | `sort_order` (número) | Orden arrastrable (`sortable` en `AdminConfig`) |
  | `slug` | URL de la ficha; se propone desde el nombre |
  | `updated` (autodate) | Qué cambió desde la última publicación |

`kit/pocketbase/core/hooks/schema.js` trae esas piezas para las migraciones del proyecto:

```js
/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const { text, image, slug, status, sortOrder, timestamps, catalogRules } = require(`${__hooks}/schema.js`);
  app.save(new Collection(Object.assign({
    type: 'base',
    name: 'tours',
    fields: [slug(), text('name', 200, true), status(), sortOrder(), image('cover'), ...timestamps()],
  }, catalogRules)));
}, (app) => app.delete(app.findCollectionByNameOrId('tours')));
```

Si los datos del proyecto usan otros nombres (p. ej. `isActive`, `sortOrder`), el seed los
pasa a estos (`status: data.isActive === false ? 'draft' : 'published'`) y los servicios del
proyecto devuelven los registros con la forma que esperan las páginas.

Correo de `leads.pb.js`:

- Destinatario: `LEADS_EMAIL` o, si no está y el proyecto tiene una colección `settings`,
  su campo `email`. Sin ninguno de los dos, el contacto se guarda igual y no se avisa.
- Envío: por el SMTP de PocketBase (Settings → Mail). Con `MAIL_RELAY_URL` +
  `MAIL_RELAY_KEY` va por `forms/relay/relay.php`, para servidores que bloquean el SMTP
  saliente.

## forms/: formularios del sitio

`<script>import '#kit/forms/forms.ts';</script>` en la página y, en el `<form
data-collection="leads" data-messages={JSON.stringify(textos)}>`, uno de:

- `data-endpoint={formsEndpoint()}`: a PocketBase. Se guarda y aparece en la bandeja.
- `data-relay="https://relay.dominio.com/form.php"`: sitio sin PocketBase. Solo llega
  por correo, vía `forms/relay/form.php` en un hosting con PHP (ver
  `forms/relay/README.md`).

Textos (`data-messages`): `{ sending, sent, invalid, tooMany, failed }`. Trampa para bots:
un `<input name="website">` oculto.

## site/

- `<Hreflang alternates={[{ code, href }]} defaultHref="/…" />` en el `<head>`.
- `<PreviewRibbon />` al principio del `<body>`.
- `isPreview()` para el `noindex` en la vista previa.

## deploy/: VPS

`kit/deploy/README.md`: `build.sh` y sus variables, `render.sh` para los archivos de
systemd/Caddy/nginx, y varios sitios en un mismo VPS. El sitio público va a Cloudflare
Pages (`kit/deploy/cloudflare-pages.md`) o a un hosting compartido con cPanel
(`kit/deploy/cpanel.md`).
