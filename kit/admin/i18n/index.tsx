// Pantalla "Traducciones" de /admin para los sitios que usan el traductor del kit
// (kit/i18n): correcciones manuales (colección translation_overrides) y vista
// previa para corregir haciendo clic en el sitio. Se agrega a `sections` del
// proyecto; con ella, pasar también `translations: true` en AdminConfig.
// `defaultLang`: el idioma que el sitio sirve sin prefijo (DEFAULT_LANG), si es uno
// de los traducidos.
import type { ScreenDef } from '../config';
import { TranslationsScreen } from './TranslationsScreen';

export function translationsScreen(
  langs: string[],
  { key = 'traducciones', title = 'Traducciones', defaultLang = '' } = {},
): ScreenDef {
  return {
    kind: 'screen',
    key,
    title,
    Screen: ({ route }) => <TranslationsScreen langs={langs} defaultLang={defaultLang} view={route[0]} />,
    content: { collection: 'translation_overrides', label: 'Correcciones de traducción' },
  };
}
