// Importa a PocketBase el seed de un proyecto (ver kit/content/seed.ts). Lo llama
// el script del proyecto (scripts/pb-import.ts), con PUBLIC_POCKETBASE_URL y
// POCKETBASE_SUPERUSER_EMAIL / _PASSWORD del entorno.
//
// Se puede correr varias veces sin pisar al editor: busca cada registro por su
// clave (`matchKey`: slug, título…), crea los que faltan y, en los que ya existen,
// solo completa los campos e imágenes vacíos. Con `--overwrite` los existentes
// vuelven a los valores del seed (las imágenes que ya tienen se mantienen).
//
// Imágenes del seed: URLs (se descargan) o rutas de archivos del proyecto: las que
// empiezan con / son de public/ (p. ej. /images/cusco.webp), las demás relativas a
// la raíz. JPG, PNG o WebP, hasta 5 MB.
//
// Con `--optimize` las imágenes se reducen (máx. 1920 px de ancho) y se pasan a
// WebP antes de subirlas: útil si el VPS tiene poco disco o un proxy que limita el
// tamaño de las solicitudes. Solo afecta a las imágenes que se suben en esa corrida.
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import sharp from 'sharp';
import type { SeedSource } from '../../content/seed.ts';

type Fields = Record<string, unknown>;
type PbRecord = Fields & { id: string };

export type ImportOptions = {
  seed: SeedSource;
  // Colección → clave con la que se busca en PocketBase cada registro del seed
  // (usar `key`). Los registros únicos devuelven ''.
  matchKey: Record<string, (fields: Fields) => string>;
  // Wikimedia exige un User-Agent identificable: "<proyecto>-import/1.0 (<url>)".
  userAgent: string;
};

// Claves de búsqueda sin depender de \r\n vs \n.
export const key = (...parts: unknown[]) => parts.map((p) => String(p).replace(/\r\n/g, '\n')).join('\u0000');

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Wikimedia limita la frecuencia de descargas.
const DOWNLOAD_PAUSE_MS = 2000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const OPTIMIZE = process.argv.includes('--optimize');
const OVERWRITE = process.argv.includes('--overwrite');
const LOCAL_TYPES: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const OPTIMIZED_WIDTH = 1920;
const OPTIMIZED_QUALITY = 80;

const warnings: string[] = [];
let token = '';
let URL_BASE = '';
let USER_AGENT = '';

async function api(method: string, path: string, body?: BodyInit, json = false) {
  const res = await fetch(`${URL_BASE}/api${path}`, {
    method,
    body,
    headers: { ...(token ? { Authorization: token } : {}), ...(json ? { 'content-type': 'application/json' } : {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(data)}`);
  return data;
}

async function listAll(collection: string): Promise<PbRecord[]> {
  const out: PbRecord[] = [];
  for (let page = 1; ; page++) {
    const data = await api('GET', `/collections/${collection}/records?perPage=500&page=${page}`);
    out.push(...data.items);
    if (page >= data.totalPages) return out;
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchImage(url: string) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { Accept: IMAGE_TYPES.join(','), 'User-Agent': USER_AGENT } });
    await sleep(DOWNLOAD_PAUSE_MS);
    if (res.status !== 429 || attempt === 4) return res;
    await sleep(Number(res.headers.get('retry-after') || 0) * 1000 || 30_000 * attempt);
  }
}

// Imagen del seed como archivo para PocketBase: una URL se descarga; una ruta que
// empieza con / es de public/ (la misma que sirve el sitio con el seed); otra
// ruta es relativa a la raíz del proyecto. null (con aviso) si no se puede.
async function loadImage(src: string, name: string): Promise<File | null> {
  try {
    let bytes: ArrayBuffer | Uint8Array<ArrayBuffer>;
    let type: string;
    if (/^https?:\/\//.test(src)) {
      const res = await fetchImage(src);
      type = (res.headers.get('content-type') ?? '').split(';')[0];
      if (!res.ok || !IMAGE_TYPES.includes(type)) throw new Error(`HTTP ${res.status}, ${type || 'sin tipo'}`);
      bytes = await res.arrayBuffer();
    } else {
      const path = src.startsWith('/') ? join(process.cwd(), 'public', src) : join(process.cwd(), src);
      type = LOCAL_TYPES[extname(path).slice(1).toLowerCase()] ?? '';
      if (!type) throw new Error('solo JPG, PNG o WebP');
      bytes = new Uint8Array(await readFile(path));
    }
    if (OPTIMIZE) bytes = await optimize(bytes);
    if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error(`${(bytes.byteLength / 1e6).toFixed(1)} MB`);
    if (OPTIMIZE) return new File([bytes], `${name}.webp`, { type: 'image/webp' });
    return new File([bytes], `${name}.${type.split('/')[1].replace('jpeg', 'jpg')}`, { type });
  } catch (error) {
    warnings.push(`imagen ${name}: ${src} (${(error as Error).message})`);
    return null;
  }
}

// Rota según EXIF (sharp descarta los metadatos), achica sin agrandar y pasa a WebP.
async function optimize(bytes: ArrayBuffer | Uint8Array<ArrayBuffer>) {
  const out = await sharp(bytes)
    .rotate()
    .resize({ width: OPTIMIZED_WIDTH, withoutEnlargement: true })
    .webp({ quality: OPTIMIZED_QUALITY })
    .toBuffer();
  return new Uint8Array(out);
}

// Imágenes del seed para los campos que el registro tiene vacíos: las que el
// editor ya puso (o reemplazó) nunca se pisan.
// Vacío para PocketBase: texto '', lista [], relación o JSON sin valor. Un número o un
// sí/no siempre tienen valor (0 y false también son valores del editor).
const isBlank = (value: unknown) =>
  value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0);

// Los campos del seed que el registro tiene vacíos; null si no hay ninguno.
function blankFields(existing: PbRecord, fields: Fields): Fields | null {
  const blanks = Object.fromEntries(
    Object.entries(fields).filter(([field, value]) => !isBlank(value) && isBlank(existing[field])),
  );
  return Object.keys(blanks).length ? blanks : null;
}

// En un campo de varias imágenes (galería), la lista entera, solo si está vacío.
async function missingImages(
  collection: string,
  existing: PbRecord | undefined,
  fields: Fields,
  images: Record<string, string | string[] | undefined>,
) {
  const files: [string, File][] = [];
  for (const [field, value] of Object.entries(images)) {
    const current = existing?.[field];
    if (!value || (Array.isArray(current) ? current.length : current)) continue;
    const srcs = [value].flat();
    for (const [i, src] of srcs.entries()) {
      const name = `${collection}-${fields.slug ?? field}${srcs.length > 1 ? `-${i + 1}` : ''}`;
      const file = await loadImage(src, name);
      if (file) files.push([field, file]);
    }
  }
  return files;
}

// Crea o actualiza un registro en una sola solicitud multipart: los campos van en
// `@jsonPayload` (como JSON, porque en multipart los saltos de línea se convierten
// en \r\n) y las imágenes como archivos. Sin `fields`, solo las imágenes.
async function save(collection: string, existing: PbRecord | undefined, fields: Fields | null, files: [string, File][]) {
  const form = new FormData();
  if (fields) {
    form.append('@jsonPayload', JSON.stringify(
      Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== null)),
    ));
  }
  for (const [field, file] of files) form.append(field, file);
  return existing
    ? api('PATCH', `/collections/${collection}/records/${existing.id}`, form)
    : api('POST', `/collections/${collection}/records`, form);
}

export async function importSeed({ seed, matchKey: MATCH_KEY, userAgent }: ImportOptions) {
  const { PUBLIC_POCKETBASE_URL, POCKETBASE_SUPERUSER_EMAIL: EMAIL, POCKETBASE_SUPERUSER_PASSWORD: PASSWORD } = process.env;
  if (!PUBLIC_POCKETBASE_URL || !EMAIL || !PASSWORD) {
    console.error('Faltan PUBLIC_POCKETBASE_URL, POCKETBASE_SUPERUSER_EMAIL o POCKETBASE_SUPERUSER_PASSWORD.');
    process.exit(1);
  }
  URL_BASE = PUBLIC_POCKETBASE_URL.replace(/\/$/, '');
  USER_AGENT = userAgent;

  token = (await api('POST', '/collections/_superusers/auth-with-password',
    JSON.stringify({ identity: EMAIL, password: PASSWORD }), true)).token;
  console.log(
    `Importando en ${URL_BASE}` +
      (OPTIMIZE ? ' (imágenes optimizadas)' : '') +
      (OVERWRITE ? ' (--overwrite: los registros existentes vuelven a los valores del seed)' : ''),
  );

  // Id del seed → id en PocketBase, por colección, para resolver las relaciones.
  const ids: Record<string, Map<string, string>> = {};
  const counts: string[] = [];
  const totals = { created: 0, updated: 0, completed: 0, untouched: 0, images: 0 };
  for (const [collection, records] of Object.entries(await seed.read())) {
    const matchKey = MATCH_KEY[collection];
    if (!matchKey) throw new Error(`Falta matchKey para la colección ${collection}.`);
    const existing = new Map<string, PbRecord>();
    for (const record of await listAll(collection)) {
      if (!existing.has(matchKey(record))) existing.set(matchKey(record), record);
    }
    ids[collection] = new Map();
    for (const { id, fields, images } of records) {
      const resolved = { ...fields };
      for (const [field, target] of Object.entries(seed.relations[collection] ?? {})) {
        const value = fields[field];
        if (value === undefined) continue;
        const toId = (seedId: unknown) => ids[target].get(seedId as string);
        resolved[field] = Array.isArray(value) ? value.map(toId).filter(Boolean) : toId(value);
      }
      // Lo que ya existe es del editor: sin --overwrite solo se completan sus
      // campos e imágenes vacíos (p. ej. un registro único que crea la migración).
      const current = existing.get(matchKey(fields));
      const files = await missingImages(collection, current, fields, images);
      let record = current;
      if (!current) {
        record = await save(collection, undefined, resolved, files);
        totals.created++;
      } else if (OVERWRITE) {
        record = await save(collection, current, resolved, files);
        totals.updated++;
      } else {
        const blanks = blankFields(current, resolved);
        if (files.length || blanks) record = await save(collection, current, blanks, files);
        if (blanks) totals.completed++;
        else totals.untouched++;
      }
      totals.images += files.length;
      ids[collection].set(id, record!.id);
    }
    counts.push(`${records.length} ${collection}`);
  }

  console.log(`Listo: ${counts.join(', ')}.`);
  console.log(
    `${totals.created} creados, ${totals.updated} actualizados, ${totals.completed} completados` +
      ` (campos vacíos), ${totals.untouched} sin tocar, ${totals.images} imágenes subidas.`,
  );
  if (warnings.length) console.warn(`\n${warnings.length} imágenes no se pudieron importar:\n- ${warnings.join('\n- ')}`);
}
