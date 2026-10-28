// Lado del build: lee la caché generada y las correcciones manuales.
// Nunca llama al traductor; si falta una traducción se muestra el español.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { sourceLang, type Lang } from './locales.ts';
import { CACHE_DIR, OVERRIDES_DIR, createTranslate, withMarker, type Dictionary, type Translate } from './core.ts';

const identity: Translate = (text) => text;
const translators = new Map<Lang, Translate>();

export function readDictionary(dir: string, lang: Lang): Dictionary {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), dir, `${lang}.json`), 'utf8'));
  } catch {
    return {};
  }
}

export function getTranslate(lang: Lang): Translate {
  if (lang === sourceLang) return identity;
  let translate = translators.get(lang);
  if (!translate) {
    const base = createTranslate(readDictionary(CACHE_DIR, lang), readDictionary(OVERRIDES_DIR, lang));
    // En la vista previa (PREVIEW=1, ver kit/deploy/build.sh) cada texto lleva la marca de su original.
    translate = process.env.PREVIEW === '1' ? (text) => withMarker(text, base(text)) : base;
    translators.set(lang, translate);
  }
  return translate;
}

// Texto en español → texto que muestra el sitio (caché + correcciones). Lo lee
// la vista previa de traducciones de /admin (ver integration.ts); son los mismos
// textos que ya están en las páginas públicas.
export function shownDictionary(lang: Lang): Dictionary {
  return { ...readDictionary(CACHE_DIR, lang), ...readDictionary(OVERRIDES_DIR, lang) };
}

// Solo la traducción automática, sin correcciones: /admin la muestra junto a cada
// texto para que se vea de dónde sale lo que el sitio muestra.
export function autoDictionary(lang: Lang): Dictionary {
  return readDictionary(CACHE_DIR, lang);
}
