// Llena la caché de traducciones a mano (el build ya lo hace solo).
//
//   npm run translate          → idiomas de ENABLED_LANGS
//   npm run translate -- en pt → idiomas indicados, estén activos o no
import { parseLangs, sourceLang, translatedLangs } from '#kit/i18n/locales.ts';
import { fillTranslations } from '#kit/i18n/fill.ts';
import { translationConfig } from '#src/i18n/translation.ts';

const requested = process.argv.slice(2);
// parseLangs valida los códigos; se traducen solo los pedidos.
const langs = requested.length
  ? parseLangs(requested.join(',')).filter((lang) => requested.includes(lang) && lang !== sourceLang)
  : translatedLangs;

if (!langs.length) console.log('No hay idiomas para traducir (revisa ENABLED_LANGS).');
else await fillTranslations(langs, translationConfig, console);
