// Llena la caché de traducciones (.cache/i18n/<idioma>.json) con lo que falte y
// descarga de PocketBase las correcciones manuales (.cache/i18n/overrides/).
// Nunca rompe el build: si el traductor falla, lo que no se tradujo se sigue
// mostrando en español y se reintenta en la próxima corrida. Con
// TRANSLATE_OFFLINE=1 (vista previa sin "traducir textos nuevos") no se llama al
// traductor: se usa lo que ya está en la caché.
//
// Lo que un build no usa NO se borra enseguida: el build público no ve lo oculto
// (sí la vista previa), y borrarlo haría pedir otra vez esas traducciones al
// volver a mostrarlo, al restaurar una copia o en la próxima vista previa; pedir
// de más es lo que hace que el traductor gratuito bloquee. Cada texto guarda el
// último día en que algún build lo usó (<idioma>.seen.json) y se borra recién
// después de UNUSED_DAYS sin usarse.
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Lang } from './locales.ts';
import { CACHE_DIR, OVERRIDES_DIR, SOURCES_FILE, type Dictionary } from './core.ts';
import { MAX_REQUEST_CHARS, RateLimitError, translateBatch } from './provider.ts';

// Lo que aporta cada proyecto (ver kit/README.md).
export type TranslationConfig = {
  // Todos los textos en español que el sitio muestra (interfaz y contenido).
  // Se usa collectDeep / collectStrings de core.ts para armarlos.
  sources: () => Promise<Iterable<string>>;
  // Correcciones manuales (colección translation_overrides de PocketBase).
  overrides: () => Promise<{ lang: string; source: string; text: string }[]>;
  // Términos que no se traducen (marcas, nombres propios).
  protectedTerms?: string[];
};

const MAX_BATCH_ITEMS = 40;
const PAUSE_MS = 400;
const UNUSED_DAYS = 90;

const today = () => Math.floor(Date.now() / 86_400_000);

export type Logger = { info: (message: string) => void; warn: (message: string) => void };

async function readJson(path: string): Promise<Dictionary> {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return {};
  }
}

// Correcciones manuales: se guardan por idioma para que el build las lea igual
// que la caché.
async function downloadOverrides(root: string, langs: Lang[], config: TranslationConfig) {
  const records = await config.overrides();
  await mkdir(join(root, OVERRIDES_DIR), { recursive: true });
  for (const lang of langs) {
    const entries = records.filter((r) => r.lang === lang).map((r) => [r.source, r.text]);
    await writeFile(join(root, OVERRIDES_DIR, `${lang}.json`), JSON.stringify(Object.fromEntries(entries), null, 2) + '\n');
  }
}

function batches(texts: string[]) {
  const out: string[][] = [];
  let current: string[] = [];
  let size = 0;
  for (const text of texts) {
    const length = encodeURIComponent(text).length;
    if (current.length && (size + length > MAX_REQUEST_CHARS || current.length >= MAX_BATCH_ITEMS)) {
      out.push(current);
      current = [];
      size = 0;
    }
    current.push(text);
    size += length;
  }
  if (current.length) out.push(current);
  return out;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fillLang(root: string, lang: Lang, sources: Set<string>, log: Logger, protectedTerms: string[]) {
  const cachePath = join(root, CACHE_DIR, `${lang}.json`);
  const seenPath = join(root, CACHE_DIR, `${lang}.seen.json`);
  const cache = await readJson(cachePath);
  // Día (desde 1970) en que un build usó cada texto por última vez. Lo que ya está
  // en la caché sin fecha (cachés de antes de esto) cuenta como usado hoy.
  const seen = (await readJson(seenPath)) as unknown as Record<string, number>;
  const overrides = await readJson(join(root, OVERRIDES_DIR, `${lang}.json`));

  const missing = [...sources].filter((text) => !(text in overrides) && !(text in cache));
  let done = 0;
  let failed = 0;

  for (const batch of process.env.TRANSLATE_OFFLINE === '1' ? [] : batches(missing)) {
    try {
      const results = await translateBatch(batch, lang, protectedTerms);
      batch.forEach((text, i) => (cache[text] = results[i]));
      done += batch.length;
    } catch (error) {
      failed += batch.length;
      if (error instanceof RateLimitError) {
        log.warn(`[${lang}] ${error.message}; se detiene y se reintenta en la próxima corrida.`);
        break;
      }
      log.warn(`[${lang}] lote de ${batch.length} textos falló: ${(error as Error).message}`);
    }
    await sleep(PAUSE_MS);
  }

  const now = today();
  for (const text of Object.keys(cache)) {
    if (sources.has(text) || !(text in seen)) seen[text] = now;
  }
  const kept = Object.entries(cache)
    .filter(([text]) => now - seen[text] <= UNUSED_DAYS)
    .sort(([a], [b]) => a.localeCompare(b, 'es'));
  const keptSeen = Object.fromEntries(kept.map(([text]) => [text, seen[text]]));
  await mkdir(join(root, CACHE_DIR), { recursive: true });
  await writeFile(cachePath, JSON.stringify(Object.fromEntries(kept), null, 2) + '\n');
  await writeFile(seenPath, JSON.stringify(keptSeen) + '\n');

  const pending = missing.length - done;
  const message =
    `[${lang}] ${done} traducidos, ${pending} pendientes` +
    (failed ? ` (${failed} fallaron)` : '') +
    `, ${Object.keys(cache).length - kept.length} sin usar en ${UNUSED_DAYS} días eliminados.`;
  if (pending) log.warn(message);
  else log.info(message);
}

export async function fillTranslations(langs: Lang[], config: TranslationConfig, log: Logger, root = process.cwd()) {
  if (!langs.length) return;
  await downloadOverrides(root, langs, config);
  const sources = new Set(await config.sources());
  await mkdir(join(root, CACHE_DIR), { recursive: true });
  await writeFile(join(root, SOURCES_FILE), JSON.stringify([...sources]));
  for (const lang of langs) await fillLang(root, lang, sources, log, config.protectedTerms ?? []);
}
