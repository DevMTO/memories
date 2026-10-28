// Endpoint gratuito (no oficial) de Google Translate. Para cambiar de proveedor
// (DeepL, Azure…) basta con reemplazar este archivo manteniendo `translateBatch`.
import { sourceLang, type Lang } from './locales.ts';

const ENDPOINT = 'https://clients5.google.com/translate_a/t';

// Solo acepta GET, así que cada lote viaja en la URL: este es el máximo de
// texto codificado (encodeURIComponent) por solicitud.
export const MAX_REQUEST_CHARS = 6000;

export class RateLimitError extends Error {}

const marker = (i: number) => `XQZ${i}QZX`;

// `protectedTerms`: términos que no se mandan al traductor (marcas, nombres
// propios); viajan como un marcador y se reponen en la respuesta.
export async function translateBatch(texts: string[], to: Lang, protectedTerms: string[] = []): Promise<string[]> {
  const protect = (text: string) => protectedTerms.reduce((acc, term, i) => acc.split(term).join(marker(i)), text);
  const restore = (text: string) => protectedTerms.reduce((acc, term, i) => acc.split(marker(i)).join(term), text);

  const params = new URLSearchParams({ client: 'dict-chrome-ex', sl: sourceLang, tl: to });
  for (const text of texts) params.append('q', protect(text));

  const res = await fetch(`${ENDPOINT}?${params}`);
  if (res.status === 429) throw new RateLimitError('Google limitó las solicitudes (429)');
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: unknown = await res.json();
  if (!Array.isArray(data) || data.length !== texts.length) {
    throw new Error('Respuesta inesperada del traductor');
  }
  return data.map((item) => restore(Array.isArray(item) ? item[0] : item));
}
