import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { usesSeed } from './pocketbase.ts';

// Imágenes del contenido, ya listas para el sitio:
//
// - De PocketBase (URL; requiere su dominio en `image.domains` de astro.config.mjs,
//   ver setup.ts): en el build se descargan y se optimizan dentro de dist/, así los
//   visitantes nunca le piden nada a PocketBase.
// - Del proyecto en src/ (p. ej. `src/assets/cusco.webp`, imágenes provisionales del
//   seed): Astro las optimiza igual que un `import`, con o sin el seed.
// - Con el seed, las demás (rutas de public/ como `/images/cusco.webp`, o URLs) se
//   usan tal cual: public/ se sirve sin procesar.

// Imágenes de src/, por ruta. Carga perezosa: solo se procesan las que se usan, pero
// el build copia a dist/ las que no se usan en ningún lado: las que no son del sitio
// van en una carpeta que empiece con _ (p. ej. src/assets/_archivo/), que no entra.
const srcImages = import.meta.glob<{ default: ImageMetadata }>(['/src/**/*.{jpg,jpeg,png,webp}', '!/src/**/_*/**']);

// Una vez por imagen y ancho en todo el build: `inferSize` descarga la imagen
// en cada llamada y la misma tarjeta aparece en decenas de páginas; sin caché,
// el build pasaría el límite de pedidos por IP de PocketBase.
const cache = new Map<string, Promise<string>>();

async function optimize(url: string, width: number) {
  if (url.startsWith('src/')) {
    const load = srcImages[`/${url}`];
    if (!load) throw new Error(`No existe la imagen ${url}`);
    return (await getImage({ src: (await load()).default, width, format: 'webp' })).src;
  }
  return (await getImage({ src: url, width, inferSize: true, format: 'webp' })).src;
}

export async function localImage(url: string | undefined, width: number) {
  if (!url) return undefined;
  if (usesSeed() && !url.startsWith('src/')) return url;
  const key = `${width} ${url}`;
  let src = cache.get(key);
  if (!src) {
    src = optimize(url, width);
    // Si falla, que el próximo intento vuelva a descargar.
    src.catch(() => cache.delete(key));
    cache.set(key, src);
  }
  return src;
}
