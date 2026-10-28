// Utilidades puras (sin Astro ni red): las usan tanto el build como el script
// `npm run translate`, que corre directamente con Node.

export type Dictionary = Record<string, string>;

// Rutas relativas a la raíz del proyecto (fuera de git): la caché de traducciones
// automáticas y las correcciones descargadas de PocketBase en cada build.
export const CACHE_DIR = '.cache/i18n';
export const OVERRIDES_DIR = '.cache/i18n/overrides';
// Todos los textos en español de la última corrida (para las marcas de la vista previa).
export const SOURCES_FILE = '.cache/i18n/sources.json';
export type Translate = (text: string) => string;

// Qué campos de un registro se traducen. Cada proyecto define los suyos (p. ej.
// en src/i18n/fields.ts); slugs, URLs, precios e iconos no van.
export type FieldSpec = {
  text?: string[];
  html?: string[];
  lists?: string[];
  nested?: Record<string, FieldSpec>;
};

export const isTranslatable = (text: string) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(text);

const ENTITIES: Dictionary = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
const decode = (text: string) => text.replace(/&(amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]);
const encode = (text: string) =>
  text.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);

// Solo se traduce el texto entre etiquetas; el marcado se conserva tal cual.
function htmlTextSegments(html: string) {
  return html.split(/(<[^>]+>)/).map((part) => ({
    part,
    text: part.startsWith('<') ? null : decode(part),
  }));
}

function translateHtml(html: string, translate: Translate) {
  return htmlTextSegments(html)
    .map(({ part, text }) => {
      if (text === null || !isTranslatable(text)) return part;
      const lead = text.match(/^\s*/)![0];
      const trail = text.match(/\s*$/)![0];
      return lead + encode(translate(text.trim())) + trail;
    })
    .join('');
}

function htmlStrings(html: string) {
  return htmlTextSegments(html)
    .filter(({ text }) => text !== null && isTranslatable(text))
    .map(({ text }) => text!.trim());
}

type AnyRecord = Record<string, any>;

export function collectStrings(record: AnyRecord, spec: FieldSpec): string[] {
  const out: string[] = [];
  for (const key of spec.text ?? []) if (typeof record[key] === 'string') out.push(record[key]);
  for (const key of spec.html ?? []) if (typeof record[key] === 'string') out.push(...htmlStrings(record[key]));
  for (const key of spec.lists ?? []) if (Array.isArray(record[key])) out.push(...record[key]);
  for (const [key, child] of Object.entries(spec.nested ?? {})) {
    for (const item of record[key] ?? []) out.push(...collectStrings(item, child));
  }
  return out.filter(isTranslatable);
}

export function localizeRecord<T extends AnyRecord>(record: T, spec: FieldSpec, translate: Translate): T {
  const out: AnyRecord = { ...record };
  for (const key of spec.text ?? []) if (typeof out[key] === 'string') out[key] = translate(out[key]);
  for (const key of spec.html ?? []) if (typeof out[key] === 'string') out[key] = translateHtml(out[key], translate);
  for (const key of spec.lists ?? []) if (Array.isArray(out[key])) out[key] = out[key].map(translate);
  for (const [key, child] of Object.entries(spec.nested ?? {})) {
    if (Array.isArray(out[key])) out[key] = out[key].map((item: AnyRecord) => localizeRecord(item, child, translate));
  }
  return out as T;
}

// Textos de interfaz: todas las cadenas del objeto, a cualquier profundidad.
export function collectDeep(value: unknown): string[] {
  if (typeof value === 'string') return isTranslatable(value) ? [value] : [];
  if (value && typeof value === 'object') return Object.values(value).flatMap(collectDeep);
  return [];
}

export function localizeDeep<T>(value: T, translate: Translate): T {
  if (typeof value === 'string') return (isTranslatable(value) ? translate(value) : value) as T;
  if (Array.isArray(value)) return value.map((item) => localizeDeep(item, translate)) as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeDeep(item, translate)]),
    ) as T;
  }
  return value;
}

export function createTranslate(cache: Dictionary, overrides: Dictionary): Translate {
  return (text) => overrides[text] ?? cache[text] ?? text;
}

// Marcas invisibles de la vista previa: cada texto traducido lleva el hash de su
// texto en español, para que la pestaña Traducciones de /admin sepa exactamente
// cuál es al hacer clic. Caracteres sin ancho ni salto de línea: U+2063 enmarca
// y U+2062 / U+2064 son los bits.
const FRAME = '⁣';
const BITS = ['⁢', '⁤'];
const MARKER = /⁣([⁢⁤]{32})⁣/g;

export function sourceHash(text: string) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193);
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const marker = (source: string) =>
  FRAME +
  [...parseInt(sourceHash(source), 16).toString(2).padStart(32, '0')].map((bit) => BITS[Number(bit)]).join('') +
  FRAME;

// Marca el texto al principio y en cada línea (el sitio parte los textos largos
// en párrafos y algunos en líneas).
export function withMarker(source: string, shown: string) {
  if (!isTranslatable(source)) return shown;
  const m = marker(source);
  return m + shown.replace(/(\n\s*)(?=\S)/g, `$1${m}`);
}

export function readMarkers(text: string): string[] {
  return [...text.matchAll(MARKER)].map(([, bits]) =>
    parseInt([...bits].map((c) => String(BITS.indexOf(c))).join(''), 2)
      .toString(16)
      .padStart(8, '0'),
  );
}

export const stripMarkers = (text: string) => text.replace(MARKER, '');
