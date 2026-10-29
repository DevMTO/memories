// Lectura de PocketBase en el build (sin sesión: las reglas solo dejan ver lo
// visible; la vista previa pasa POCKETBASE_TOKEN y ve también lo oculto). No
// depende de Astro, así que también la usan los scripts de Node. Con
// CONTENT_SOURCE=seed (`npm run dev`, `npm run build:static`) lee el seed del
// proyecto (ver seed.ts).
import type { SeedSource } from './seed.ts';

export type PbRecord = Record<string, any> & { id: string; collectionId: string };

export function pocketbaseUrl() {
  const url = process.env.PUBLIC_POCKETBASE_URL;
  if (!url) throw new Error('Falta PUBLIC_POCKETBASE_URL (ver .env.example).');
  return url.replace(/\/$/, '');
}

export const usesSeed = () => process.env.CONTENT_SOURCE === 'seed';

// El proyecto lo arma una vez (src/lib/pocketbase.ts) con su seed; se carga
// solo si se usa.
export function createContent({ seed }: { seed: () => Promise<SeedSource> }) {
  async function fetchAll(
    collection: string,
    { expand, sort }: { expand?: string; sort?: string } = {},
  ): Promise<PbRecord[]> {
    if (usesSeed()) return (await seed()).records(collection, expand);
    const records: PbRecord[] = [];
    for (let page = 1; ; page++) {
      const params = new URLSearchParams({ page: String(page), perPage: '500' });
      if (expand) params.set('expand', expand);
      if (sort) params.set('sort', sort);
      const url = `${pocketbaseUrl()}/api/collections/${collection}/records?${params}`;
      // Con token (vista previa, ver kit/deploy/build.sh) se lee como el editor: incluye lo oculto.
      const token = process.env.POCKETBASE_TOKEN;
      const res = await fetch(url, token ? { headers: { Authorization: token } } : undefined);
      if (!res.ok) throw new Error(`PocketBase: ${url} → ${res.status} ${await res.text()}`);
      const data = await res.json();
      records.push(...data.items);
      if (page >= data.totalPages) return records;
    }
  }
  return { fetchAll };
}

// URL pública de un archivo; el build la descarga y la optimiza (ver images.ts).
// Los registros del seed ya traen la imagen completa: una URL o una ruta del
// proyecto (/… de public/, src/…), que se devuelve tal cual.
export function fileUrl(record: PbRecord, filename: string | undefined) {
  if (filename && (usesSeed() || /^https?:\/\//.test(filename))) return filename;
  return filename
    ? `${pocketbaseUrl()}/api/files/${record.collectionId}/${record.id}/${encodeURIComponent(filename)}`
    : undefined;
}

// Las de un campo de varias imágenes (galería), en orden.
export function fileUrls(record: PbRecord, filenames: string[] | undefined) {
  return (filenames ?? []).map((filename) => fileUrl(record, filename)!);
}

// PocketBase devuelve '' y 0 para los campos vacíos; el sitio espera undefined.
export const optional = <T>(value: T) => (value === '' || value === 0 || value === null ? undefined : value);
