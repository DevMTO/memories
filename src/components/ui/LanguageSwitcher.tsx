import { useCallback, useEffect, useRef, useState } from 'react';
import translate from 'translate';

type Language = 'es' | 'en' | 'pt';
type TextRecord = { node: Text; original: string };
type AttributeRecord = { element: HTMLElement; attribute: string; original: string };

const languages: Array<{ code: Language; label: string; name: string }> = [
  { code: 'es', label: 'ES', name: 'Español' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'pt', label: 'PT', name: 'Português' },
];

const storageKey = 'memories-language';
const cacheKey = 'memories-translation-cache-v2';
const excludedSelector = '.notranslate, [data-no-translate], [translate="no"], script, style, noscript, svg, code, pre, textarea, input';
const translatablePattern = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/;

const loadCache = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey) || '{}');
  } catch {
    return {};
  }
};

const preserveSpacing = (original: string, translated: string) => {
  const leading = original.match(/^\s*/)?.[0] || '';
  const trailing = original.match(/\s*$/)?.[0] || '';
  return `${leading}${translated.trim()}${trailing}`;
};

const translateText = async (source: string, target: Exclude<Language, 'es'>) => {
  if (source.length <= 700) return translate(source, { from: 'es', to: target });

  const chunks = source.match(/[\s\S]{1,700}(?:\s|$)/g) || [source];
  const translatedChunks = [];
  for (const chunk of chunks) translatedChunks.push(await translate(chunk.trim(), { from: 'es', to: target }));
  return translatedChunks.join(' ');
};

const getTextRecords = (): TextRecord[] => {
  const records: TextRecord[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      const value = node.nodeValue || '';
      if (!parent || parent.closest(excludedSelector) || !translatablePattern.test(value)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  let node: Node | null;
  while ((node = walker.nextNode())) records.push({ node: node as Text, original: node.nodeValue || '' });
  return records;
};

const getAttributeRecords = (): AttributeRecord[] => {
  const records: AttributeRecord[] = [];
  document.querySelectorAll<HTMLElement>('[placeholder], [title], [aria-label]').forEach((element) => {
    if (element.closest('.notranslate, [data-no-translate], [translate="no"]')) return;
    ['placeholder', 'title', 'aria-label'].forEach((attribute) => {
      const original = element.getAttribute(attribute);
      if (original && translatablePattern.test(original)) records.push({ element, attribute, original });
    });
  });
  return records;
};

export default function LanguageSwitcher() {
  const [language, setLanguage] = useState<Language>('es');
  const [busy, setBusy] = useState(false);
  const textRecords = useRef<TextRecord[]>([]);
  const attributeRecords = useRef<AttributeRecord[]>([]);
  const requestId = useRef(0);

  const updateControls = useCallback((nextLanguage: Language, loading: boolean) => {
    document.documentElement.lang = nextLanguage;
    document.documentElement.classList.toggle('is-translating', loading);
    document.querySelectorAll<HTMLButtonElement>('.language-switcher__button').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.language === nextLanguage));
      button.disabled = loading;
    });
  }, []);

  const translateValues = useCallback(async (values: string[], target: Exclude<Language, 'es'>, currentRequest: number) => {
    const cache = loadCache();
    const uniqueValues = Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
    const results = new Map<string, string>();
    let cursor = 0;

    const worker = async () => {
      while (cursor < uniqueValues.length && requestId.current === currentRequest) {
        const source = uniqueValues[cursor++];
        const key = `${target}:${source}`;
        if (cache[key]) {
          results.set(source, cache[key]);
          continue;
        }

        try {
          const translated = await translateText(source, target);
          if (translated) {
            cache[key] = translated;
            results.set(source, translated);
          }
        } catch (error) {
          console.warn(`No se pudo traducir: ${source}`, error);
        }
      }
    };

    await Promise.all(Array.from({ length: Math.min(6, uniqueValues.length) }, worker));
    try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch { /* cache opcional */ }
    return results;
  }, []);

  const changeLanguage = useCallback(async (nextLanguage: Language) => {
    const currentRequest = ++requestId.current;
    setLanguage(nextLanguage);
    localStorage.setItem(storageKey, nextLanguage);

    if (!textRecords.current.length) textRecords.current = getTextRecords();
    if (!attributeRecords.current.length) attributeRecords.current = getAttributeRecords();

    if (nextLanguage === 'es') {
      textRecords.current.forEach(({ node, original }) => { node.nodeValue = original; });
      attributeRecords.current.forEach(({ element, attribute, original }) => element.setAttribute(attribute, original));
      setBusy(false);
      updateControls('es', false);
      return;
    }

    setBusy(true);
    updateControls(nextLanguage, true);
    const values = [
      ...textRecords.current.map(({ original }) => original),
      ...attributeRecords.current.map(({ original }) => original),
    ];
    const translations = await translateValues(values, nextLanguage, currentRequest);

    if (requestId.current !== currentRequest) return;
    textRecords.current.forEach(({ node, original }) => {
      const translated = translations.get(original.trim());
      if (translated) node.nodeValue = preserveSpacing(original, translated);
    });
    attributeRecords.current.forEach(({ element, attribute, original }) => {
      const translated = translations.get(original.trim());
      if (translated) element.setAttribute(attribute, translated);
    });

    setBusy(false);
    updateControls(nextLanguage, false);
  }, [translateValues, updateControls]);

  useEffect(() => {
    document.cookie = 'googtrans=;path=/;max-age=0;SameSite=Lax';
    if (location.hostname.includes('.')) document.cookie = `googtrans=;path=/;domain=.${location.hostname};max-age=0;SameSite=Lax`;
    const stored = localStorage.getItem(storageKey);
    const initialLanguage: Language = stored === 'en' || stored === 'pt' ? stored : 'es';
    textRecords.current = getTextRecords();
    attributeRecords.current = getAttributeRecords();
    updateControls(initialLanguage, false);
    if (initialLanguage !== 'es') void changeLanguage(initialLanguage);

    const mobileButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('.mobile-language-switcher .language-switcher__button'));
    const handlers = mobileButtons.map((button) => {
      const handler = () => {
        const nextLanguage = button.dataset.language as Language;
        if (nextLanguage === 'es' || nextLanguage === 'en' || nextLanguage === 'pt') void changeLanguage(nextLanguage);
      };
      button.addEventListener('click', handler);
      return { button, handler };
    });

    return () => handlers.forEach(({ button, handler }) => button.removeEventListener('click', handler));
  }, [changeLanguage, updateControls]);

  return (
    <div className="language-switcher notranslate" aria-label="Seleccionar idioma" aria-busy={busy}>
      <svg className="language-switcher__icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M4 5h9M8.5 3v2m1.8 0c-.6 3-2.2 5.7-4.6 7.7M5.9 9.5c1.1 1.5 2.5 2.7 4.1 3.6M14.5 19l2.8-7 2.8 7m-4.7-2.3h3.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="language-switcher__options" role="group" aria-label="Idiomas disponibles">
        {languages.map((item) => (
          <button key={item.code} type="button" className="language-switcher__button" data-language={item.code} aria-label={item.name} aria-pressed={language === item.code} onClick={() => void changeLanguage(item.code)}>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
