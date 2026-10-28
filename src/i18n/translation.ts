// Qué traduce el traductor del kit (kit/i18n): los textos de interfaz (cada t('…')
// del código, ver src/i18n/i18n.ts) y el catálogo. Corre en Node desde
// astro.config.mjs y scripts/translate.ts.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { collectStrings } from '#kit/i18n/core.ts';
import type { TranslationConfig } from '#kit/i18n/fill.ts';
import { destinationFields, productFields } from '#src/i18n/fields.ts';
import { fetchAll } from '#src/lib/pocketbase.ts';
import { destinationFromRecord, productFromRecord } from '#src/lib/records.ts';

// t('…') o t("…") con un literal sin interpolaciones.
const T_CALL = /\bt\(\s*(['"])((?:\\.|(?!\1)[^\\])*)\1\s*[,)]/g;

async function sourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(astro|ts|tsx)$/.test(entry.name) ? [path] : [];
    }),
  );
  return files.flat();
}

// Textos de interfaz del código.
export async function uiStrings() {
  const texts = new Set<string>();
  for (const file of await sourceFiles('src')) {
    for (const [, , literal] of (await readFile(file, 'utf8')).matchAll(T_CALL)) {
      texts.add(literal.replace(/\\(.)/g, '$1'));
    }
  }
  return texts;
}

export const translationConfig: TranslationConfig = {
  async sources() {
    const sources = await uiStrings();
    for (const record of await fetchAll('products')) {
      for (const text of collectStrings(productFromRecord(record), productFields)) sources.add(text);
    }
    for (const record of await fetchAll('destinations')) {
      for (const text of collectStrings(destinationFromRecord(record), destinationFields)) sources.add(text);
    }
    return sources;
  },
  overrides: async () => (await fetchAll('translation_overrides')).map(({ lang, source, text }) => ({ lang, source, text })),
  protectedTerms: ['Memories Travel Perú', 'Memories Travel', 'Memories'],
};
