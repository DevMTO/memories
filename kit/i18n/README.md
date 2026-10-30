# Traducción automática

Cómo funciona el traductor del kit. Cómo se instala en un proyecto (integración,
`translationConfig`, rutas por idioma): "i18n/" en `kit/README.md`. Lo propio de cada sitio
(qué textos y campos traduce): su `src/i18n/`.

## Flujo

El sitio se escribe **solo en el idioma de origen** (español). Los demás idiomas se generan
en el build y se publican como páginas estáticas.

1. `astro.config.mjs` registra la integración (`integration.ts`) con los idiomas activos y
   la configuración del proyecto (`src/i18n/translation.ts`).
2. Al iniciar `astro build` (o `astro dev`), la integración traduce los textos que falten y
   los guarda en `.cache/i18n/<idioma>.json` (fuera de git). Lo que ya está en la caché no
   se vuelve a pedir. Si el traductor falla, el build sigue y esos textos salen en el idioma
   de origen hasta la próxima corrida.
   La caché no pierde lo que un build no usa (lo oculto no está en el build público, sí en la
   vista previa): `<idioma>.seen.json` guarda el último día en que algún build usó cada
   texto, y se borra recién después de 90 días sin usarse. Así ocultar y volver a mostrar,
   restaurar una copia o una vista previa no vuelven a pedir lo mismo al traductor gratuito,
   que bloquea si se le pide de más.
3. Las páginas de `src/pages/[...lang]/` se generan una vez por idioma; los servicios y las
   páginas aplican la traducción con lo que haya en la caché y en las correcciones.
4. Las correcciones manuales (colección `translation_overrides`, editadas en `/admin` →
   Traducciones, ver `kit/admin/README.md`) ganan siempre sobre la traducción automática.

## Archivos del kit

| Archivo | Para qué |
|---|---|
| `locales.ts` | Idiomas activos (`ENABLED_LANGS`), idioma sin prefijo (`DEFAULT_LANG`) y rutas (`getLangParams`, `getLang`, `getBasePath`…) |
| `core.ts` | Recorrer y traducir registros (`localizeRecord`, `localizeDeep`, `collectStrings`) y las marcas de la vista previa |
| `runtime.ts` | `getTranslate(lang)`: lee la caché y las correcciones; nunca llama a internet |
| `fill.ts` | Llena la caché (lo usan la integración y `npm run translate`) |
| `provider.ts` | El traductor (endpoint gratuito de Google); para otro proveedor se reemplaza solo este archivo |
| `integration.ts` | La integración de Astro: traduce al empezar el build y, solo en la vista previa (donde vive `/admin`), publica `_i18n/` con los textos de ese build |

`.cache/i18n/` se puede borrar: se regenera en el próximo build (pidiendo todo otra vez al
traductor).
`npm run translate` la llena sin hacer build.

## Tareas comunes

- **Corregir una traducción:** en `/admin` → Traducciones (o un registro en
  `translation_overrides` con el texto de origen exacto en `source`).
- **Agregar o quitar un idioma:** cambiar `ENABLED_LANGS` (p. ej. `es,en,pt,fr`) en `.env` y
  en `build.env` del VPS; no hace falta tocar código.
- **Servir otro idioma en `/`:** `DEFAULT_LANG` (p. ej. `en`); el idioma de origen pasa a
  `/<idioma>/`.
- **Que una marca no se traduzca:** `protectedTerms` en `src/i18n/translation.ts`.
- **Traducir un campo nuevo del contenido:** agregarlo a los campos que el proyecto declara
  en `src/i18n/fields.ts`.
