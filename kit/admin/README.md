# El editor `/admin`

Cómo funciona el editor del kit para quien lo usa y para quien lo mantiene. Cómo se arma en
un proyecto (configuración, tipos de campo, pantallas propias): "admin/" en `kit/README.md`.

## Principios

- El sitio es **estático**: los visitantes nunca consultan PocketBase.
- `/admin` es **una sola página** del sitio con una isla de React (`client:only`) que habla
  directo con la API de PocketBase desde el navegador. Es lo único con JavaScript pesado; el
  resto del sitio no se ve afectado. Navegación interna por hash (`#/tours/<id>`), sin
  rutas en el servidor.
- El editor escribe **en el idioma de origen** (español). Guardar no cambia el sitio;
  **Publicar** lanza el build en el VPS (`kit/deploy/build.sh`) y el sitio se regenera con
  lo publicado.
- Ningún secreto llega al navegador ni al `.env` del sitio.
- `/admin` es solo para editar el contenido: lo que envían los visitantes (formularios) no
  pasa por PocketBase, llega por correo (`kit/forms/`).
- Textos largos en **texto plano**, con párrafos separados por una línea en blanco; el
  sitio los convierte en `<p>`. El formato visual es del diseño del sitio, no del
  contenido.

## Sesión y cuenta

- Inicio de sesión con el SDK de PocketBase contra `editors` (un solo editor); el SDK guarda
  el token en el navegador y lo renueva. Si vence, el login aparece encima sin perder el
  formulario abierto.
- Sin registro ni "olvidé mi contraseña". **Mi cuenta** (arriba a la derecha) muestra el
  correo con el que entra y cambia la contraseña (pide la actual; cierra las otras sesiones
  abiertas). El acceso inicial sale de `EDITOR_EMAIL` / `EDITOR_PASSWORD`
  (`kit/pocketbase/core/hooks/editor.pb.js`); contraseña olvidada o cambio de correo: el
  superusuario, en el dashboard de PocketBase (`/_/` → editors).

## Pantallas comunes

| Pantalla | Qué hace |
|---|---|
| **Inicio (tablero)** | Estado de la última publicación, cambios sin publicar, botón **Publicar** (siempre visible en la barra superior) |
| Secciones del proyecto | Listas con búsqueda, filtros (visibles, ocultos, sin publicar), orden arrastrable y borrados; fichas con sus campos. Las define `src/admin/config.tsx` del proyecto |
| **Traducciones** | Vista previa interactiva de las páginas traducidas para corregir textos (abajo) y lista de correcciones |
| **Mi cuenta** | Correo del editor y cambio de contraseña |

## Detalles de edición

- **Visible / Oculto:** el estado de cada registro (`status`) dice si sale en el sitio;
  **Publicar** es lo que sube los cambios guardados. Son cosas distintas y la interfaz no
  usa "publicado" para el estado. Es un interruptor con su texto: en la ficha, junto a
  Guardar (se aplica al guardar); en cada fila de la lista, se guarda al momento.
- **Sin publicar:** cada fila, cada ficha y el tablero marcan lo que cambió después de la
  última publicación que terminó bien; el botón Publicar muestra cuántos cambios hay y la
  confirmación los lista (incluidos los borrados). Reordenar no marca las filas: la lista
  muestra "El orden cambió" y cuenta como un cambio por lista. Al guardar, el aviso dice
  "Todavía no está en el sitio" con **Vista previa** y **Publicar** al lado.
- **Publicación en curso:** arriba de cada pantalla, qué se está publicando (los cambios
  guardados o un cambio de código por push a `deploy`) y si terminó bien o falló. Un push
  que no toca el sitio queda "Sin cambios en el sitio".
- **No se pierde trabajo:**
  - Copia del formulario en el navegador mientras hay cambios sin guardar; al volver se
    ofrece recuperarla (sin las imágenes elegidas).
  - Aviso al guardar si el registro se guardó desde otro lugar después de abrirlo.
  - Contador de caracteres y error si se pasa del límite (pegar un texto largo no se corta
    en silencio).
  - **Historial** en cada ficha: cómo estaba antes de cada guardado (50 por registro),
    comparar con lo actual y restaurar (carga la versión en el formulario; hay que guardar).
  - **Borrar** pide confirmación, avisa si está elegido en otro lugar (`usedIn` de la
    configuración) y se puede deshacer desde **Borrados** en la lista: vuelve con el mismo
    id, oculto y sin imágenes.
  - Aviso al salir de una ficha con cambios.
- **Rapidez:** formularios largos por secciones con atajos arriba; Ctrl/⌘+S guarda;
  **Duplicar** crea una copia oculta (con imágenes y la primera URL libre); relaciones con
  buscador.
- **Imágenes:** subir con vista previa (JPG/PNG/WebP, hasta 5 MB); muestra el tamaño y avisa
  si es más angosta que el ancho al que el sitio la muestra (`minWidth`). Debajo, cómo se
  recorta en cada lugar del sitio donde aparece (`frames` de la configuración, con las
  proporciones medidas en el sitio: si el sitio cambia de diseño, hay que volver a medirlas).
  Las galerías (`images`) se agregan, quitan y reordenan.
- **Slug (URL):** se propone a partir del nombre mientras esté oculto; una vez visible,
  cambiarlo pide confirmación porque rompe los enlaces existentes.
- **Orden:** arrastrar en las listas guarda `sort_order` de todos los registros en un solo
  lote (API batch de PocketBase). Cambiar solo el orden no deja versión en el historial.
- Textos de la interfaz en español; funciona en celular (una columna).

## Vista previa

El botón **Vista previa** arma el sitio con lo guardado, ocultos incluidos y en todos los
idiomas, sin tocar el sitio publicado. Se ve en las mismas URLs del sitio del editor
(`editor.<dominio>`, donde vive `/admin`) gracias a una cookie que pone `/admin` (ver "Vista
previa" en `kit/deploy/vps.md`); una cinta abajo avisa que es la vista previa y tiene
"Salir". El botón abre un panel con "Traducir textos nuevos" (apagado por defecto): apagado
no usa el traductor y lo nuevo se ve en el idioma de origen en los otros idiomas hasta
publicar. Tarda uno o dos minutos; cuando está lista, un aviso la abre y cada ficha tiene
"Vista previa ↗" a su página. Lo no guardado no entra: es un build, no una vista en vivo.

## Traducciones: vista previa interactiva

La traducción se hace en el build (`kit/i18n/README.md`). PocketBase solo guarda las
**correcciones** (`translation_overrides`), que deberían ser pocas.

1. Al terminar el build, la integración de traducción escribe `dist/_i18n/<idioma>.json`
   (texto de origen → traducción, ya con las correcciones; en `astro dev` lo sirve un
   middleware). Solo lo descarga `/admin`; no contiene nada que no esté en las páginas
   públicas.
2. En **Traducciones**, el editor elige idioma y página; `/admin` la carga en un iframe
   (mismo dominio, así que puede leer lo que se clickea). Si hay vista previa, el iframe la
   muestra (y lo dice, con "Actualizar vista previa"); si no, el sitio publicado.
3. Al hacer clic en un texto se abre un panel con el original, la traducción actual y un
   campo para corregirla. En la vista previa cada texto traducido lleva una marca invisible
   con el hash de su original (`withMarker` en `kit/i18n/core.ts`; tabla en
   `_i18n/ids.json`): el clic da el texto exacto, y en un bloque con varios textos lista
   justo esos. En el sitio publicado no hay marcas: se busca por parecido
   (`kit/admin/i18n/translationMatch.ts`), que puede fallar con textos parecidos, en
   mayúsculas por CSS o partidos en párrafos.
4. Cada texto dice de dónde sale su traducción: **Corrección manual** (con la automática al
   lado, para comparar), **Traducción automática** o **Sin traducir todavía** (se traduce
   al publicar). Para eso el build publica también `_i18n/<idioma>.auto.json`, solo con la
   traducción automática.
5. Las correcciones sin guardar quedan en `localStorage`; al guardarlas se crean o
   actualizan en `translation_overrides`.
6. Se ven en la vista previa al actualizarla y en el sitio después de **Publicar**.

Una corrección vale para todas las apariciones del mismo texto de origen en ese idioma (la
clave es el texto original). Si un clic coincide con más de un texto, el panel muestra las
opciones.
