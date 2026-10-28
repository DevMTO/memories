// Correcciones de traducción (translation_overrides). La traducción automática
// se hace en el build; aquí solo se corrigen textos puntuales: la corrección vale
// para todas las apariciones del mismo texto en español en ese idioma. Dos vistas:
// la página traducida para corregir con un clic (TranslationPreview) y la lista.
import { useEffect, useState } from 'react';
import { errorMessage, fieldErrors, pb, type RecordModel } from '../lib/pocketbase';
import { useUnsavedGuard } from '../lib/router';
import { TranslationOrigin, useAutoDictionary, type Dictionary } from './origin';
import { TranslationPreview } from './TranslationPreview';

const PAGE = 50;

export function TranslationsScreen({ langs, defaultLang, view }: { langs: string[]; defaultLang?: string; view?: string }) {
  const [lang, setLang] = useState(langs[0] ?? '');
  const showList = view === 'lista';
  const [records, setRecords] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [adding, setAdding] = useState(false);
  // Traducción automática del sitio publicado, para mostrarla junto a cada corrección.
  const auto = useAutoDictionary(showList ? lang : '');

  useEffect(() => {
    if (!lang) return;
    setRecords(null);
    setShown(PAGE);
    pb()
      .collection('translation_overrides')
      .getFullList({ filter: pb().filter('lang = {:lang}', { lang }), sort: 'source' })
      .then(setRecords, (err) => setError(errorMessage(err)));
  }, [lang]);

  if (!langs.length) {
    return (
      <section>
        <h1>Traducciones</h1>
        <p>El sitio está solo en español (ENABLED_LANGS).</p>
      </section>
    );
  }

  const query = search.trim().toLowerCase();
  const filtered = (records ?? []).filter(
    (r) => !query || r.source.toLowerCase().includes(query) || r.text.toLowerCase().includes(query),
  );

  return (
    <section>
      <header className="screen-header">
        <h1>Traducciones</h1>
        <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Idioma">
          {langs.map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </header>
      <p className="field-help">
        El sitio se traduce solo. Si una traducción quedó mal: <strong>1.</strong> haz clic en el texto y corrígelo
        (vale para todas las veces que aparece ese texto en español); <strong>2.</strong> actualiza la vista previa
        para verlo; <strong>3.</strong> <strong>Publicar</strong> lo lleva al sitio.
      </p>
      <div className="tabs">
        <a href="#/traducciones" className={showList ? '' : 'is-active'}>
          Vista previa
        </a>
        <a href="#/traducciones/lista" className={showList ? 'is-active' : ''}>
          Correcciones guardadas{records ? ` (${records.length})` : ''}
        </a>
      </div>

      {error && <p className="notice-error">{error}</p>}
      {!showList && records && (
        <TranslationPreview
          lang={lang}
          basePath={lang === defaultLang ? '' : `/${lang}`}
          overrides={records}
          onOverrideChange={(record, deleted) =>
            setRecords((prev) =>
              deleted
                ? prev!.filter((x) => x.id !== record.id)
                : prev!.some((x) => x.id === record.id)
                  ? prev!.map((x) => (x.id === record.id ? record : x))
                  : [record, ...prev!],
            )
          }
        />
      )}
      {showList && (
        <>
          <div className="toolbar">
            <button type="button" className="btn btn-primary" onClick={() => setAdding(true)} disabled={adding}>
              + Nueva corrección
            </button>
            <input
              type="search"
              placeholder="Buscar en español o en la traducción…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {adding && (
            <OverrideEditor
              lang={lang}
              auto={auto}
              record={null}
              onDone={(saved) => {
                setAdding(false);
                if (saved) setRecords((prev) => [saved, ...(prev ?? [])]);
              }}
            />
          )}
          {!records && !error && <p className="muted">Cargando…</p>}
          {records && filtered.length === 0 && <p className="muted">No hay correcciones.</p>}
          {filtered.slice(0, shown).map((r) => (
            <OverrideEditor
              key={r.id}
              lang={lang}
              auto={auto}
              record={r}
              onDone={(saved, deleted) =>
                setRecords((prev) =>
                  deleted ? prev!.filter((x) => x.id !== r.id) : prev!.map((x) => (x.id === r.id && saved ? saved : x)),
                )
              }
            />
          ))}
          {filtered.length > shown && (
            <button type="button" className="btn" onClick={() => setShown(shown + PAGE)}>
              Ver más ({filtered.length - shown})
            </button>
          )}
        </>
      )}
    </section>
  );
}

type EditorProps = {
  lang: string;
  auto: Dictionary | null;
  record: RecordModel | null;
  onDone: (saved: RecordModel | null, deleted?: boolean) => void;
};

function OverrideEditor({ lang, auto, record, onDone }: EditorProps) {
  const [source, setSource] = useState(record?.source ?? '');
  const [text, setText] = useState(record?.text ?? '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const dirty = source !== (record?.source ?? '') || text !== (record?.text ?? '');
  useUnsavedGuard(dirty);

  async function save() {
    if (!source.trim() || !text.trim()) return setError('Completa el texto en español y la traducción.');
    setSaving(true);
    setError('');
    try {
      const data = { lang, source: source.trim(), text: text.trim() };
      const saved = record
        ? await pb().collection('translation_overrides').update(record.id, data)
        : await pb().collection('translation_overrides').create(data);
      onDone(saved);
    } catch (err) {
      const errors = fieldErrors(err);
      setError(errors.source ? 'Ya hay una corrección para ese texto.' : errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!record || !confirm('¿Quitar esta corrección? Se volverá a usar la traducción automática.')) return;
    try {
      await pb().collection('translation_overrides').delete(record.id);
      onDone(null, true);
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <article className="card override">
      <label>
        Español
        <textarea rows={2} value={source} onChange={(e) => setSource(e.target.value)} readOnly={!!record} />
      </label>
      <label>
        {lang.toUpperCase()}
        <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      {record ? (
        <TranslationOrigin source={record.source} override={record} auto={auto} />
      ) : (
        auto?.[source.trim()] !== undefined && (
          <p className="field-help">
            Traducción automática actual: <span className="auto-text">{auto[source.trim()]}</span>
          </p>
        )
      )}
      {error && <p className="field-error">{error}</p>}
      <div className="form-bar-actions">
        {record ? (
          <button type="button" className="btn btn-ghost btn-danger" onClick={remove}>
            Quitar
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={() => onDone(null)}>
            Cancelar
          </button>
        )}
        <button type="button" className="btn btn-primary" onClick={save} disabled={saving || !dirty}>
          {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </article>
  );
}
