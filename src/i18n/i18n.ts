// Idiomas del sitio. Se escribe en español; los demás idiomas de ENABLED_LANGS se
// traducen en el build (kit/i18n). Las páginas van en src/pages/[...lang]/.
//
// Textos de interfaz: siempre literales y en español dentro de t('…'), así
// src/i18n/translation.ts los encuentra en el código para traducirlos:
//
//   const t = useT(lang);
//   <h2>{t('Paquetes destacados')}</h2>
import { getTranslate } from '#kit/i18n/runtime.ts';
import { getBasePath, getLang, type Lang } from '#kit/i18n/locales.ts';
import { sitePath } from '../lib/site-path';

export { defaultLang, enabledLangs, getBasePath, getLang, getLangParams, sourceLang, type Lang } from '#kit/i18n/locales.ts';

// Idioma de la página que se está armando: cualquier componente lo lee de
// Astro.params (`pageLang(Astro.params)`).
export const pageLang = (params: Record<string, string | undefined>) => getLang(params.lang);

export const useT = (lang: Lang) => getTranslate(lang);

// Ruta interna del sitio en un idioma (con BASE_URL): pagePath('en', '/tours') → /en/tours.
export const pagePath = (lang: Lang, path: string) => sitePath(`${getBasePath(lang)}${path}`);

// La misma página en otro idioma (selector de idioma y hreflang).
export function localeHref(url: URL, from: Lang, to: Lang) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const path = url.pathname.slice(base.length).slice(getBasePath(from).length) || '/';
  return pagePath(to, path);
}
