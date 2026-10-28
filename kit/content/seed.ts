// Contenido inicial del proyecto con la forma de los registros de PocketBase. El
// proyecto define cómo se arma (`load`) y qué campos son relaciones; el kit lo usa
// para construir el sitio sin PocketBase (CONTENT_SOURCE=seed: `npm run dev`,
// `npm run build:static`) y para importarlo a PocketBase (kit/pocketbase/scripts/import.ts).
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

export type SeedRecord = {
  // Identificador dentro del seed; las relaciones apuntan a él.
  id: string;
  // Campos de PocketBase; los de relación (ver `relations`) llevan ids del seed.
  fields: Record<string, unknown>;
  // Campo de archivo → imagen original (ruta o URL), o lista de imágenes para los
  // campos de varias (galerías).
  images: Record<string, string | string[] | undefined>;
};

// Colección de PocketBase → registros, en el orden en que hay que importarlas
// (cada una solo apunta a las anteriores).
export type Seed = Record<string, SeedRecord[]>;

// Colección → campo de relación → colección a la que apunta.
export type SeedRelations = Record<string, Record<string, string>>;

export type SeedSource = ReturnType<typeof defineSeed>;

export function defineSeed({ load, relations = {} }: { load: () => Promise<Seed>; relations?: SeedRelations }) {
  let cached: Promise<Seed> | undefined;
  const read = () => (cached ??= load());

  // Registros como los devuelve PocketBase sin sesión: solo lo publicado, con
  // `expand` resuelto. Los campos de imagen llevan la URL original.
  async function records(collection: string, expand?: string) {
    const seed = await read();
    const visible = (record: SeedRecord) => record.fields.status === undefined || record.fields.status === 'published';
    const toRecord = (name: string, record: SeedRecord) => ({
      ...record.fields,
      ...record.images,
      id: record.id,
      collectionId: name,
    });

    const list = seed[collection];
    if (!list) throw new Error(`El seed no tiene la colección ${collection}.`);
    return list.filter(visible).map((record) => {
      const out: Record<string, any> = toRecord(collection, record);
      for (const field of expand?.split(',') ?? []) {
        const target = relations[collection]?.[field];
        if (!target) continue;
        const ids = [record.fields[field] ?? []].flat();
        const related = seed[target].filter((r) => ids.includes(r.id) && visible(r)).map((r) => toRecord(target, r));
        out.expand ??= {};
        out.expand[field] = Array.isArray(record.fields[field]) ? related : related[0];
      }
      return out as Record<string, any> & { id: string; collectionId: string };
    });
  }

  return { read, records, relations };
}

// Ayudas para `load`.
export const readJson = async (path: string) => JSON.parse(await readFile(path, 'utf8'));

// Una carpeta con un JSON por registro: el nombre del archivo es el slug.
export async function readJsonDir(dir: string) {
  const files = (await readdir(dir)).filter((file) => file.endsWith('.json')).sort();
  return Promise.all(files.map(async (file) => ({ slug: file.replace(/\.json$/, ''), data: await readJson(join(dir, file)) })));
}
