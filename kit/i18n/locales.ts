// Código de idioma (ISO 639-1, p. ej. 'en', 'pt'). Agregar o quitar un idioma
// es solo cambiar ENABLED_LANGS: rutas, selector, hreflang y traducción lo siguen.
export type Lang = string;

const LANG_CODE = /^[a-z]{2,3}(-[A-Z]{2})?$/;

// Idioma en el que se escribe el sitio: el traductor parte de él y es el que se
// muestra sin traducir.
export const sourceLang: Lang = 'es';

// Idioma que se sirve sin prefijo en la URL (`/`); los demás van en `/<idioma>/`.
// DEFAULT_LANG, por defecto el idioma fuente.
export const defaultLang: Lang = process.env.DEFAULT_LANG?.trim() || sourceLang;
if (!LANG_CODE.test(defaultLang)) throw new Error(`DEFAULT_LANG inválido: ${defaultLang}`);

// "es,en,pt" → ['es', 'en', 'pt']. El idioma sin prefijo va primero y el idioma
// fuente siempre está, aunque no figuren en la lista.
export function parseLangs(value: string | undefined): Lang[] {
  const langs = (value ?? '').split(',').map((lang) => lang.trim()).filter(Boolean);
  const invalid = langs.filter((lang) => !LANG_CODE.test(lang));
  if (invalid.length) throw new Error(`ENABLED_LANGS tiene códigos inválidos: ${invalid.join(', ')}`);
  return [...new Set([defaultLang, sourceLang, ...langs])];
}

export const enabledLangs = parseLangs(process.env.ENABLED_LANGS);

// Los que hay que traducir.
export const translatedLangs = enabledLangs.filter((lang) => lang !== sourceLang);

// Parámetro `[...lang]` de las rutas: vacío para el idioma sin prefijo.
export function getLangParams() {
  return enabledLangs.map((lang) => ({ lang: lang === defaultLang ? undefined : lang }));
}

export function getLang(param: string | undefined): Lang {
  return enabledLangs.find((lang) => lang === param) ?? defaultLang;
}

export function getBasePath(lang: Lang) {
  return lang === defaultLang ? '' : `/${lang}`;
}

export function getHomePath(lang: Lang) {
  return `${getBasePath(lang)}/`;
}
