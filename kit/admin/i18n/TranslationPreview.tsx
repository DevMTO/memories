// Vista previa interactiva de traducciones (kit/README.md, "i18n/"): la página traducida
// en un iframe del mismo dominio; en modo corrección, un clic en un texto busca
// qué texto en español lo generó y abre el panel para corregirlo. Lo que no se
// guarda queda en localStorage para no perderlo al recargar.
// Si hay vista previa del editor, el iframe la muestra (mismas URLs, con la
// cookie): ahí se ven las correcciones sin publicar y cada texto trae su marca.
import { useCallback, useEffect, useRef, useState } from 'react';
import { formatTime } from '../components/RecordEditor';
import { errorMessage, fieldErrors, pb, type RecordModel } from '../lib/pocketbase';
import { NOTHING_TO_PUBLISH, PreviewButton, PreviewChip, useConfirmPublish, usePublish } from '../lib/publish';
import { OriginBadge, TranslationOrigin, originOf, useAutoDictionary } from './origin';
import {
  elementTexts,
  findCandidates,
  markedCandidates,
  type Candidate,
  type Dictionary,
} from './translationMatch';

const DRAFTS_KEY = 'admin:translation-drafts';
type Drafts = Record<string, Record<string, string>>; // idioma → español → corrección

function readDrafts(): Drafts {
  try {
    return JSON.parse(localStorage.getItem(DRAFTS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

function useDrafts(lang: string) {
  const [all, setAll] = useState<Drafts>(readDrafts);
  const update = (source: string, text: string | null) => {
    setAll((prev) => {
      const forLang = { ...(prev[lang] ?? {}) };
      if (text === null) delete forLang[source];
      else forLang[source] = text;
      const next = { ...prev, [lang]: forLang };
      try {
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };
  return { drafts: all[lang] ?? {}, setDraft: update };
}

const HOVER_CLASS = '__translation-hover';

type Props = {
  lang: string;
  // Prefijo de las páginas de ese idioma: '' si el sitio lo sirve sin prefijo.
  basePath: string;
  overrides: RecordModel[];
  onOverrideChange: (record: RecordModel, deleted?: boolean) => void;
};

export function TranslationPreview({ lang, basePath, overrides, onOverrideChange }: Props) {
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);
  const [dictionaryError, setDictionaryError] = useState('');
  const [path, setPath] = useState(`${basePath}/`);
  const [address, setAddress] = useState(path);
  const [editMode, setEditMode] = useState(true);
  const [candidates, setCandidates] = useState<Candidate[] | null>(null);
  const [active, setActive] = useState<Candidate | null>(null);
  const { drafts, setDraft } = useDrafts(lang);
  const iframe = useRef<HTMLIFrameElement>(null);
  const [ids, setIds] = useState<Dictionary | null>(null);
  const [ready, setReady] = useState(false);

  // editor.<dominio> sirve solo la vista previa (se rearma después de cada
  // publicación), con la cookie que pone /admin mientras la sesión es válida.
  const { previewEnabled, lastPreview, enterPreview, previewInProgress } = usePublish();
  const preview = lastPreview?.status === 'done' ? lastPreview : undefined;
  const source = `preview:${preview?.id ?? ''}`;
  // Traducción automática de la misma versión del sitio (para mostrar el origen).
  const auto = useAutoDictionary(lang, source);
  useEffect(() => {
    enterPreview();
    setReady(true);
  }, [source, enterPreview]);
  const editModeRef = useRef(editMode);
  editModeRef.current = editMode;

  // Las correcciones guardadas después del último build mandan sobre el JSON.
  const overrideBySource = new Map(overrides.map((r) => [r.source as string, r]));
  const effective = useCallback(
    (dict: Dictionary) => ({ ...dict, ...Object.fromEntries(overrides.map((r) => [r.source, r.text])) }),
    [overrides],
  );

  useEffect(() => {
    setDictionary(null);
    setDictionaryError('');
    setCandidates(null);
    setActive(null);
    if (!ready) return;
    fetch(`/_i18n/${lang}.json`, { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then(setDictionary, (err) =>
        setDictionaryError(
          `No se encontró el diccionario de traducciones (${err.message}). Se genera al publicar el sitio.`,
        ),
      );
    // Solo existe en la vista previa: hash de cada texto en español → el texto.
    setIds(null);
    fetch('/_i18n/ids.json', { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then(setIds, () => setIds(null));
  }, [lang, source, ready]);

  // Al cambiar de idioma se vuelve a su inicio; al actualizar la vista previa se
  // queda en la página donde estaba.
  useEffect(() => {
    setPath(`${basePath}/`);
    setAddress(`${basePath}/`);
  }, [lang, basePath]);

  const dictRef = useRef<Dictionary>({});
  dictRef.current = dictionary ? effective(dictionary) : {};
  const idsRef = useRef<Dictionary | null>(null);
  idsRef.current = ids;

  // Se engancha a cada página del iframe apenas existe su <head> (sin
  // esperar a las imágenes: el editor puede hacer clic antes del `load`).
  useEffect(() => {
    const hooked = new WeakSet<Document>();
    const timer = setInterval(() => {
      const frame = iframe.current;
      const doc = frame?.contentDocument;
      if (!frame || !doc || !doc.head || hooked.has(doc) || doc.URL === 'about:blank') return;
      hooked.add(doc);
      const current = frame.contentWindow!.location.pathname;
      setPath(current);
      setAddress(current);
      hookDocument(doc);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  function hookDocument(doc: Document) {
    const style = doc.createElement('style');
    style.textContent = `.${HOVER_CLASS}{outline:2px dashed #1f6f50 !important;outline-offset:2px;cursor:text !important}`;
    doc.head.appendChild(style);

    let hovered: Element | null = null;
    doc.addEventListener('mouseover', (e) => {
      hovered?.classList.remove(HOVER_CLASS);
      hovered = null;
      const target = e.target as Element | null;
      if (!editModeRef.current || target?.nodeType !== 1) return;
      hovered = target;
      hovered.classList.add(HOVER_CLASS);
    });
    doc.addEventListener(
      'click',
      (e) => {
        const target = e.target as Element | null;
        if (!editModeRef.current || target?.nodeType !== 1) return;
        e.preventDefault();
        e.stopPropagation();
        const texts = elementTexts(target);
        const marked = idsRef.current ? markedCandidates(dictRef.current, idsRef.current, texts) : [];
        const found = marked.length ? marked : findCandidates(dictRef.current, texts);
        setCandidates(found);
        setActive(found.length === 1 ? found[0] : null);
      },
      true,
    );
  }

  // Con el modo corrección apagado se navega normalmente; al volver a
  // encenderlo se limpia el resaltado.
  useEffect(() => {
    if (!editMode) iframe.current?.contentDocument?.querySelector(`.${HOVER_CLASS}`)?.classList.remove(HOVER_CLASS);
  }, [editMode]);

  const draftCount = Object.keys(drafts).length;

  async function saveDraft(source: string) {
    const text = drafts[source]?.trim();
    if (!text) return;
    const existing = overrideBySource.get(source);
    const saved = existing
      ? await pb().collection('translation_overrides').update(existing.id, { text })
      : await pb().collection('translation_overrides').create({ lang, source, text });
    onOverrideChange(saved);
    setDraft(source, null);
  }

  return (
    <div className="preview-layout">
      <div className="preview-main">
        <div className="toolbar preview-toolbar">
          <form
            className="preview-address"
            onSubmit={(e) => {
              e.preventDefault();
              const next = address.startsWith(`${basePath}/`) ? address : `${basePath}/${address.replace(/^\/+/, '')}`;
              setPath(next);
              if (iframe.current) iframe.current.src = next;
            }}
          >
            <input value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Página" />
          </form>
          <label className="checkbox">
            <input type="checkbox" checked={editMode} onChange={(e) => setEditMode(e.target.checked)} />
            Modo corrección
          </label>
        </div>
        <p className="field-help">
          {editMode
            ? 'Haz clic en un texto para corregir su traducción. Apaga el modo corrección para navegar por el sitio.'
            : 'Navega hasta la página que quieras corregir y vuelve a encender el modo corrección.'}
        </p>
        <p className="notice-info">
          Mostrando la <strong>vista previa</strong>
          {preview ? <> armada el {formatTime(preview.updated)}</> : null}: las correcciones guardadas después se ven
          al actualizarla. <PreviewChip />{' '}
          {previewEnabled && !previewInProgress && <PreviewButton className="btn btn-ghost" label="Actualizar" />}
        </p>
        {ready && <iframe key={source} ref={iframe} className="preview-frame" src={path} title="Vista previa" />}
      </div>

      <aside className="preview-panel card">
        {dictionaryError && <p className="notice-error">{dictionaryError}</p>}
        {!dictionary && !dictionaryError && <p className="muted">Cargando traducciones…</p>}
        {dictionary && !candidates && <p className="muted">Elige un texto en la página.</p>}
        {candidates && candidates.length === 0 && (
          <p className="muted">
            Ese texto no sale de las traducciones (puede ser un nombre propio, un precio o un texto que no se traduce).
            Prueba haciendo clic justo sobre el texto.
          </p>
        )}
        {candidates && candidates.length > 1 && !active && (
          <>
            <p>Ese bloque tiene varios textos. ¿Cuál quieres corregir?</p>
            <ul className="plain candidate-list">
              {candidates.map((c) => (
                <li key={c.source}>
                  <button type="button" className="btn btn-ghost" onClick={() => setActive(c)}>
                    {c.shown.length > 90 ? c.shown.slice(0, 90) + '…' : c.shown}
                  </button>{' '}
                  <OriginBadge origin={originOf(c.source, overrideBySource.get(c.source), auto)} />
                </li>
              ))}
            </ul>
          </>
        )}
        {active && (
          <CandidateEditor
            key={`${lang}:${active.source}`}
            lang={lang}
            candidate={active}
            override={overrideBySource.get(active.source)}
            auto={auto}
            draft={drafts[active.source]}
            onDraft={(text) => setDraft(active.source, text)}
            onSave={() => saveDraft(active.source)}
            onRemove={async () => {
              const existing = overrideBySource.get(active.source);
              if (!existing) return;
              await pb().collection('translation_overrides').delete(existing.id);
              onOverrideChange(existing, true);
            }}
            onBack={candidates && candidates.length > 1 ? () => setActive(null) : undefined}
          />
        )}
        {draftCount > 0 && (
          <div className="drafts">
            <p>
              {draftCount} {draftCount === 1 ? 'corrección sin guardar' : 'correcciones sin guardar'} en{' '}
              {lang.toUpperCase()}.
            </p>
            <button
              type="button"
              className="btn"
              onClick={async () => {
                for (const source of Object.keys(drafts)) {
                  try {
                    await saveDraft(source);
                  } catch {
                    // Queda como borrador; el panel muestra el error al abrirla.
                  }
                }
              }}
            >
              Guardar todas
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

type EditorProps = {
  lang: string;
  candidate: Candidate;
  override: RecordModel | undefined;
  auto: Record<string, string> | null;
  draft: string | undefined;
  onDraft: (text: string | null) => void;
  onSave: () => Promise<void>;
  onRemove: () => Promise<void>;
  onBack?: () => void;
};

function CandidateEditor({ lang, candidate, override, auto, draft, onDraft, onSave, onRemove, onBack }: EditorProps) {
  const saved = override?.text ?? candidate.shown;
  const value = draft ?? saved;
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<void>, ok: string) => {
    setBusy(true);
    setMessage(null);
    try {
      await action();
      setMessage({ kind: 'ok', text: ok });
    } catch (err) {
      const errors = fieldErrors(err);
      setMessage({ kind: 'error', text: Object.values(errors)[0] ?? errorMessage(err) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="candidate-editor">
      {onBack && (
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          ← Otros textos de ese bloque
        </button>
      )}
      <p className="field-label">Español (original)</p>
      <p className="source-text">{candidate.source}</p>
      <label className="field-label" htmlFor="translation-text">
        {lang.toUpperCase()}
      </label>
      <TranslationOrigin source={candidate.source} override={override} auto={auto} shown={candidate.shown} />
      <textarea
        id="translation-text"
        rows={Math.min(12, Math.max(3, Math.ceil(value.length / 45)))}
        value={value}
        onChange={(e) => {
          setMessage(null);
          onDraft(e.target.value === saved ? null : e.target.value);
        }}
      />
      {!auto && !override && draft === undefined && candidate.shown === candidate.source && (
        <p className="field-help">
          Se ve igual que en español: si es un texto nuevo y la vista previa se armó sin "Traducir textos nuevos",
          se traduce solo al publicar. Escribe aquí la traducción solo si quieres fijarla a mano.
        </p>
      )}
      {draft !== undefined && <p className="field-help">Sin guardar (se conserva aunque recargues la página).</p>}
      <p className="field-help">Vale para todas las veces que aparece este texto en {lang.toUpperCase()}.</p>
      {message && <p className={message.kind === 'ok' ? 'notice-ok' : 'notice-error'}>{message.text}</p>}
      {message?.kind === 'ok' && <NextStep />}
      <div className="form-bar-actions inline-actions">
        {override && draft === undefined && (
          <button
            type="button"
            className="btn btn-ghost btn-danger"
            disabled={busy}
            onClick={() =>
              confirm('¿Quitar la corrección? Se volverá a usar la traducción automática.') &&
              run(onRemove, 'Corrección quitada. Todavía no se ve en el sitio.')
            }
          >
            Quitar corrección
          </button>
        )}
        {draft !== undefined && (
          <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => onDraft(null)}>
            Descartar
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy || draft === undefined || !draft.trim()}
          onClick={() => run(onSave, 'Guardado. Todavía no está en el sitio.')}
        >
          {busy ? 'Guardando…' : 'Guardar'}
        </button>
      </div>
    </div>
  );
}

// Qué hacer para ver la corrección: actualizar la vista previa o publicar.
function NextStep() {
  const { previewEnabled, canPublish } = usePublish();
  const confirmPublish = useConfirmPublish();
  return (
    <p className="field-help inline-actions">
      {previewEnabled ? 'Para verla: ' : 'Para que se vea: '}
      <PreviewButton className="btn btn-ghost" label="Actualizar vista previa" />
      {previewEnabled && 'y, para que llegue al sitio, '}
      <button
        type="button"
        className="btn btn-ghost"
        disabled={!canPublish}
        title={canPublish ? undefined : NOTHING_TO_PUBLISH}
        onClick={confirmPublish}
      >
        Publicar
      </button>
    </p>
  );
}
