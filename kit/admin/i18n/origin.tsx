// De dónde sale la traducción de un texto: corrección manual (translation_overrides),
// traducción automática del build (/_i18n/<idioma>.auto.json) o ninguna todavía.
import { useEffect, useState } from 'react';
import type { RecordModel } from '../lib/pocketbase';

export type Dictionary = Record<string, string>;

// Traducción automática publicada por el último build (o la vista previa). null
// mientras carga o si el sitio todavía no la tiene: entonces no se muestra el origen.
export function useAutoDictionary(lang: string, reloadKey: unknown = null) {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  useEffect(() => {
    setDictionary(null);
    if (!lang) return;
    let cancelled = false;
    fetch(`/_i18n/${lang}.auto.json`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((dict) => !cancelled && setDictionary(dict), () => !cancelled && setDictionary(null));
    return () => {
      cancelled = true;
    };
  }, [lang, reloadKey]);
  return dictionary;
}

export type Origin = 'manual' | 'auto' | 'pending';

// null: sin la traducción automática del sitio no se puede saber.
export function originOf(source: string, override: RecordModel | undefined, auto: Dictionary | null): Origin | null {
  if (override) return 'manual';
  if (!auto) return null;
  return source in auto ? 'auto' : 'pending';
}

const SHORT: Record<Origin, [string, string]> = {
  manual: ['Manual', 'badge-manual'],
  auto: ['Automática', 'badge-auto'],
  pending: ['Sin traducir', 'badge-pending'],
};

// Versión corta, para listas.
export function OriginBadge({ origin }: { origin: Origin | null }) {
  if (!origin) return null;
  const [label, className] = SHORT[origin];
  return <span className={`badge ${className}`}>{label}</span>;
}

type Props = {
  source: string;
  override: RecordModel | undefined;
  auto: Dictionary | null;
  // Lo que muestra la página ahora (vista previa); sin él no se avisa si la
  // corrección todavía no se ve.
  shown?: string;
};

export function TranslationOrigin({ source, override, auto, shown }: Props) {
  const origin = originOf(source, override, auto);
  if (origin === 'manual' && override) {
    const automatic = auto?.[source];
    return (
      <div className="translation-origin">
        <span className="badge badge-manual">Corrección manual</span>
        {shown !== undefined && shown !== override.text && (
          <p className="field-help">Guardada, pero la página todavía muestra la anterior: actualiza la vista previa o publica.</p>
        )}
        {automatic !== undefined && automatic !== override.text && (
          <p className="field-help">
            Traducción automática: <span className="auto-text">{automatic}</span>
          </p>
        )}
      </div>
    );
  }
  if (!origin) return null;
  if (origin === 'auto') {
    return (
      <div className="translation-origin">
        <span className="badge badge-auto">Traducción automática</span>
      </div>
    );
  }
  return (
    <div className="translation-origin">
      <span className="badge badge-pending">Sin traducir todavía</span>
      <p className="field-help">
        Es un texto nuevo: se traduce solo al publicar (o al armar la vista previa con "Traducir textos nuevos").
        Escribe la traducción solo si quieres fijarla a mano.
      </p>
    </div>
  );
}
