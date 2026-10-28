# Memories Travel Perú

Sitio web de Memories Travel Perú desarrollado con Astro: un sitio estático cuyo catálogo
sale de `src/data/catalog.seed.json`.

## Funcionalidades principales

- Contacto centralizado con WhatsApp **+51 954 669 589** y emergencias **+51 926 301 932**.
- Botón flotante de WhatsApp y formulario de cotización adaptados a móvil.
- Catálogo público separado en **Tours**, **Trekking** y **Paquetes**.
- Fichas completas con descripción, itinerario por día, incluye, no incluye, qué llevar, información importante, galería y SEO.

## Requisitos

- Node.js 22.12 o superior.
- npm 10 o superior.

## Instalación local

```bash
npm ci
cp .env.example .env
npm run dev
```

Sitio: `http://localhost:4321`

## Catálogo

Las páginas leen el catálogo solo a través de `src/lib/services/catalog.ts`, que publica lo
activo de `src/data/catalog.seed.json` ordenado por `sortOrder` y título.

## Comandos

```bash
npm run dev           # desarrollo
npm run check:catalog # valida contenido, cantidades e imágenes del catálogo
npm run build         # sitio estático en dist/
npm run preview       # sirve dist/
```

## Despliegue

`npm run build` genera un sitio estático en `dist/`. El workflow `.github/workflows/deploy.yml`
lo publica en GitHub Pages en cada push a `main`, con `BASE_PATH` y `SITE_URL` que entrega
Pages.

## Estructura relevante

```text
src/config/site.ts                       contacto único del sitio
src/data/catalog.seed.json               catálogo de 25 experiencias
src/lib/services/catalog.ts              lectura del catálogo para las páginas
src/lib/types.ts                         tipos del catálogo
src/lib/site-path.ts                     rutas internas con BASE_PATH
```

## Carrusel de video del hero

El hero utiliza un único archivo optimizado `public/videos/hero/hero_reel.mp4` de 720p, 24 fps, sin audio y con `faststart`. Se mantiene en H.264/MP4 porque ofrece la compatibilidad de autoplay más amplia —incluido Safari— y evita duplicar un reel de aproximadamente dos minutos con una segunda descarga WebM.

Los videos originales no se publican. El conjunto local debe incluir `machupicchu.mp4` y `machupicchu-ciudadela.mp4`; `machupicchu2.mp4` ya no forma parte del carrusel. Para regenerar el reel, extrae los videos en una carpeta local y ejecuta:

```bash
npm run build:hero_reel -- --input ./carrusel
```

El generador crea cortes de 3 y 4 segundos, intercala la primera parte de todos los destinos, continúa con la segunda parte de cada uno y genera también el poster y el manifiesto de tiempos usado por los controles del hero.
