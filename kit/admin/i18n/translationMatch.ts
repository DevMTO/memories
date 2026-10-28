// Vista previa de traducciones: a partir del texto clickeado en la página
// traducida, encontrar qué texto en español lo generó. El diccionario es
// /_i18n/<idioma>.json (español → texto mostrado), con las correcciones
// guardadas después del último build encima. En la vista previa del editor
// cada texto trae una marca invisible con su original (kit/i18n/core.ts):
// eso da el texto exacto; sin marcas (sitio publicado) se busca por parecido.
import { readMarkers, stripMarkers } from '../../i18n/core.ts';

export type Dictionary = Record<string, string>;
export type Candidate = { source: string; shown: string };

// Con las marcas: los textos del bloque clickeado, sin repetir y en orden.
export function markedCandidates(dictionary: Dictionary, ids: Dictionary, clicked: string[]): Candidate[] {
  const sources = [...new Set(clicked.flatMap(readMarkers))].map((hash) => ids[hash]).filter(Boolean);
  return [...new Set(sources)].map((source) => ({ source, shown: dictionary[source] ?? source }));
}

export const normalize = (text: string) => stripMarkers(text).replace(/\s+/g, ' ').trim();

// Los textos largos se traducen enteros y el sitio los parte en párrafos: un
// párrafo clickeado es parte de una traducción. Al revés, un bloque clickeado
// (una tarjeta) contiene varias traducciones cortas.
const MIN_PART = 8;
const MIN_CONTAINED = 12;

export function findCandidates(dictionary: Dictionary, clicked: string[], limit = 8): Candidate[] {
  const texts = [...new Set(clicked.map(normalize).filter((t) => t.length >= 2))];
  const entries = Object.entries(dictionary).map(([source, shown]) => ({ source, shown, norm: normalize(shown) }));
  const ranked: { candidate: Candidate; score: number }[] = [];

  for (const text of texts) {
    for (const { source, shown, norm } of entries) {
      let score = 0;
      if (norm === text) score = 3;
      // Texto sin traducir: el sitio muestra el español.
      else if (normalize(source) === text) score = 2.5;
      else if (text.length >= MIN_PART && norm.includes(text)) score = 2 - norm.length / 1e6;
      else if (norm.length >= MIN_CONTAINED && text.includes(norm)) score = 1 + norm.length / 1e6;
      if (score) ranked.push({ candidate: { source, shown }, score });
    }
  }

  const seen = new Set<string>();
  return ranked
    .sort((a, b) => b.score - a.score)
    .map((r) => r.candidate)
    .filter((c) => !seen.has(c.source) && seen.add(c.source))
    .slice(0, limit);
}

// Textos de un elemento clickeado: su texto visible y los atributos que el
// sitio traduce (alt, title, placeholder, aria-label).
export function elementTexts(el: Element): string[] {
  const out: string[] = [];
  for (const attr of ['alt', 'title', 'placeholder', 'aria-label']) {
    const value = el.getAttribute(attr);
    if (value) out.push(value);
  }
  let node: Element | null = el;
  // Un ícono o un <span> vacío: subir hasta algo con texto.
  while (node && !(node as HTMLElement).innerText?.trim() && node.parentElement) node = node.parentElement;
  const text = (node as HTMLElement | null)?.innerText ?? '';
  if (text.length <= 3000) out.push(text);
  return out;
}
