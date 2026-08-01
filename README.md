# Memories Travel Perú

Sitio web de Memories Travel Perú desarrollado con Astro, React y SQLite. El catálogo público y el panel privado comparten una sola base de datos local, sin Firebase.

## Funcionalidades principales

- Contacto centralizado con WhatsApp **+51 954 669 589** y emergencias **+51 926 301 932**.
- Botón flotante de WhatsApp y formulario de cotización adaptados a móvil.
- Catálogo público separado en **Tours**, **Trekking** y **Paquetes**.
- Fichas completas con descripción, itinerario por día, incluye, no incluye, qué llevar, información importante, galería y SEO.
- Panel privado en `/gestion` para crear, editar, publicar, destacar y eliminar experiencias.
- Persistencia con SQLite y carga inicial automática de los 25 programas entregados.
- Sesiones administrativas firmadas mediante cookie `httpOnly`.

## Requisitos

- Node.js 22.12 o superior. El proyecto usa el módulo nativo `node:sqlite`.
- npm 10 o superior.

## Instalación local

```bash
npm ci
cp .env.example .env
npm run dev
```

Sitio público: `http://localhost:4321`

Panel administrativo: `http://localhost:4321/gestion`

Antes de iniciar, cambia `ADMIN_USER`, `ADMIN_PASSWORD` y `SESSION_SECRET` en `.env`. La clave de sesión debe tener al menos 32 caracteres.

## Base de datos

La ruta predeterminada es `data/memories.sqlite`. Si el archivo no existe o la tabla está vacía, el sistema crea el esquema e importa automáticamente `src/data/catalog.seed.json`.

En producción, configura `SQLITE_PATH` dentro de un volumen persistente. No reemplaces el archivo mientras la aplicación está ejecutándose; SQLite también puede crear archivos temporales `-wal` y `-shm`.

## Comandos

```bash
npm run dev       # desarrollo
npm run check:catalog # valida contenido, cantidades e imágenes del catálogo
npm run build         # compilación SSR
npm run start     # servidor Node de producción
npm run preview   # previsualización de Astro
```

## Despliegue

Este proyecto usa renderizado del lado del servidor y una base SQLite escribible. **GitHub Pages no es compatible** porque solo aloja archivos estáticos.

Puede desplegarse en un servidor Node, VPS o plataforma con disco persistente. Variables obligatorias:

```text
ADMIN_USER
ADMIN_PASSWORD
SESSION_SECRET
SQLITE_PATH
```

Ejemplo con Docker:

```bash
docker build -t memories-travel .
docker run --rm -p 4321:4321 \
  -e HOST=0.0.0.0 \
  -e PORT=4321 \
  -e ADMIN_USER=administrador \
  -e ADMIN_PASSWORD='una-clave-segura' \
  -e SESSION_SECRET='una-cadena-aleatoria-de-mas-de-32-caracteres' \
  -e SQLITE_PATH=/app/data/memories.sqlite \
  -v memories_data:/app/data \
  memories-travel
```

## Estructura relevante

```text
src/config/site.ts                       contacto único del sitio
src/data/catalog.seed.json               catálogo inicial de 25 experiencias
src/infrastructure/sqlite/database.ts    esquema y carga inicial
src/infrastructure/repositories/         acceso al catálogo SQLite
src/pages/gestion/                       interfaz administrativa
src/pages/api/admin/                     API privada del catálogo
src/server/auth/                         sesión firmada
```

## Seguridad operativa

- No subas `.env` ni el archivo SQLite al repositorio.
- Usa HTTPS en producción para que la cookie de sesión sea segura.
- Protege las copias de seguridad de `memories.sqlite`.
- Cambia las credenciales administrativas periódicamente.

## Carrusel de video del hero

El hero utiliza un único archivo optimizado `public/videos/hero/hero_reel.mp4` de 720p, 24 fps, sin audio y con `faststart`. Se mantiene en H.264/MP4 porque ofrece la compatibilidad de autoplay más amplia —incluido Safari— y evita duplicar un reel de aproximadamente dos minutos con una segunda descarga WebM.

Los videos originales no se publican. El conjunto local debe incluir `machupicchu.mp4` y `machupicchu-ciudadela.mp4`; `machupicchu2.mp4` ya no forma parte del carrusel. Para regenerar el reel, extrae los videos en una carpeta local y ejecuta:

```bash
npm run build:hero_reel -- --input ./carrusel
```

El generador crea cortes de 3 y 4 segundos, intercala la primera parte de todos los destinos, continúa con la segunda parte de cada uno y genera también el poster y el manifiesto de tiempos usado por los controles del hero.
