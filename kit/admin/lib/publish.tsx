// Estado de las publicaciones (realtime de PocketBase) y de lo que falta subir
// al sitio, compartido por la barra, el tablero, las listas y las fichas. Ver
// pocketbase/pb_hooks/publish.pb.js.
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { config, contentDefs } from '../config';
import { Switch } from '../components/Switch';
import { errorMessage, pb, type RecordModel } from './pocketbase';
import { hasUnsaved } from './router';
import { PREVIEW_COOKIE } from '../../site/preview.ts';

// Si el build nunca avisa (p. ej. falta PUBLISH_CALLBACK_SECRET), no bloquear
// el botón para siempre.
const STALE_MS = 30 * 60 * 1000;

export const STATUS_LABEL: Record<string, string> = {
  queued: 'En cola',
  building: 'Publicando…',
  done: 'Publicado',
  failed: 'Falló',
  skipped: 'Sin cambios en el sitio',
};

const FINISHED = ['done', 'failed', 'skipped'];

// count: registros con cambios de contenido; reordered: además cambió el orden.
export type PendingRow = { label: string; href?: string; count: number; reordered?: boolean };

export const pendingText = (row: PendingRow) =>
  row.count ? `${row.count}${row.reordered ? ' y el orden' : ''}` : 'el orden';

type PublishState = {
  // Solo publicaciones (las vistas previas van aparte).
  history: RecordModel[] | null;
  inProgress: boolean;
  error: string;
  publish: () => void;
  // Cuándo empezó el último deploy que terminó bien: null = nunca, undefined = cargando.
  publishedAt: string | null | undefined;
  pending: PendingRow[] | null;
  pendingTotal: number;
  // Registros con cambios de contenido sin publicar (sin contar el orden).
  changed: Set<string>;
  // Deploy que se vio terminar en esta sesión, para avisar (hasta que se cierre el aviso).
  finished: RecordModel | null;
  dismissFinished: () => void;
  // Vista previa: el servidor web la sirve en las mismas URLs a quien tenga la
  // cookie con la clave (GET /api/preview/key). Sin clave, no se ofrece.
  previewEnabled: boolean;
  openPreview: (path?: string) => void;
  enterPreview: () => void;
  lastPreview: RecordModel | undefined;
  previewInProgress: boolean;
  // translate: también traducir los textos nuevos (llama al traductor automático).
  requestPreview: (translate: boolean) => void;
};

const PublishContext = createContext<PublishState | null>(null);

export const isInProgress = (r: RecordModel | undefined) =>
  !!r &&
  (r.status === 'queued' || r.status === 'building') &&
  Date.now() - Date.parse(r.created.replace(' ', 'T')) < STALE_MS;

const since = (publishedAt: string | null) =>
  publishedAt ? pb().filter('updated > {:since}', { since: publishedAt }) : '';
const and = (...filters: (string | undefined)[]) =>
  filters
    .filter(Boolean)
    .map((f) => `(${f})`)
    .join(' && ');

// Qué falta publicar. Reordenar cambia `updated` de toda la lista, pero no deja
// versión (pb_hooks/revisions.js ignora sort_order): un registro tiene cambios de
// contenido si es nuevo o tiene una versión posterior a la última publicación.
async function loadPending(publishedAt: string | null): Promise<{ rows: PendingRow[]; changed: Set<string> }> {
  const collections = [...new Set(contentDefs().map((d) => d.collection))];
  const changed = new Set<string>();
  if (publishedAt) {
    const revisions = await pb()
      .collection('revisions')
      .getFullList({
        filter: and(
          'action = "update"',
          collections.map((c) => pb().filter('collection_name = {:c}', { c })).join(' || '),
          pb().filter('created > {:since}', { since: publishedAt }),
        ),
        fields: 'record',
      })
      .catch(() => []);
    for (const r of revisions) changed.add(r.record);
  }
  const rows: PendingRow[] = await Promise.all(
    contentDefs().map(async ({ collection, filter, label, href }) => {
      const records = await pb()
        .collection(collection)
        .getFullList({ filter: and(filter, since(publishedAt)), fields: 'id,created' });
      const content = records.filter((r) => !publishedAt || r.created > publishedAt || changed.has(r.id));
      for (const r of content) changed.add(r.id);
      return { label, href, count: content.length, reordered: content.length < records.length };
    }),
  );
  const deleted = await countDeleted(publishedAt).catch(() => 0);
  if (deleted) rows.push({ label: 'Borrados', count: deleted });
  return { rows: rows.filter((row) => row.count > 0 || row.reordered), changed };
}

// Lo borrado no deja registro en su colección: se cuenta en el historial de
// versiones, sin lo que se volvió a restaurar.
async function countDeleted(publishedAt: string | null) {
  const collections = [...new Set(contentDefs().map((d) => d.collection))];
  const revisions = await pb()
    .collection('revisions')
    .getFullList({
      filter: and(
        'action = "delete"',
        collections.map((c) => pb().filter('collection_name = {:c}', { c })).join(' || '),
        publishedAt ? pb().filter('created > {:since}', { since: publishedAt }) : '',
      ),
      fields: 'collection_name,record',
    });
  let count = 0;
  for (const collection of collections) {
    const ids = [...new Set(revisions.filter((r) => r.collection_name === collection).map((r) => r.record))];
    if (!ids.length) continue;
    const back = await pb()
      .collection(collection)
      .getFullList({ filter: ids.map((id) => pb().filter('id = {:id}', { id })).join(' || '), fields: 'id' });
    count += ids.length - back.length;
  }
  return count;
}

export { PREVIEW_COOKIE };

export function PublishProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<RecordModel[] | null>(null);
  const [requesting, setRequesting] = useState(false);
  const [requestingPreview, setRequestingPreview] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState<PendingRow[] | null>(null);
  const [changed, setChanged] = useState<Set<string>>(new Set());
  const [finished, setFinished] = useState<RecordModel | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const running = useRef(new Set<string>());

  useEffect(() => {
    pb()
      .send('/api/preview/key', { method: 'GET' })
      .then(
        (res) => setPreviewKey(res.key),
        () => setPreviewKey(null),
      );
  }, []);

  const enterPreview = useCallback(() => {
    if (!previewKey) return;
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${PREVIEW_COOKIE}=${encodeURIComponent(previewKey)}; path=/; max-age=43200; SameSite=Strict${secure}`;
  }, [previewKey]);

  // Publicaciones (botón Publicar y push a deploy) y vistas previas van en la
  // misma colección; solo las publicaciones cambian el sitio.
  const history = all && all.filter((r) => r.kind !== 'preview');
  const previews = all && all.filter((r) => r.kind === 'preview');

  useEffect(() => {
    for (const r of all ?? []) {
      if (isInProgress(r)) running.current.add(r.id);
      else if (running.current.delete(r.id) && FINISHED.includes(r.status)) setFinished(r);
    }
  }, [all]);

  const publishedAt = history ? (history.find((r) => r.status === 'done')?.created ?? null) : undefined;

  const load = useCallback(
    () =>
      pb()
        .collection('publishes')
        .getList(1, 30, { sort: '-created' })
        .then(
          (list) => setAll(list.items),
          (err) => setError(errorMessage(err)),
        ),
    [],
  );

  useEffect(() => {
    load();
    let unsubscribe: (() => void) | undefined;
    pb()
      .collection('publishes')
      .subscribe('*', () => load())
      .then(
        (fn) => (unsubscribe = fn),
        () => {},
      );
    return () => unsubscribe?.();
  }, [load]);

  // Se recalcula con cada cambio en lo que el build lee (también desde otra pestaña).
  const publishedAtRef = useRef(publishedAt);
  publishedAtRef.current = publishedAt;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const refresh = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const at = publishedAtRef.current;
      if (at === undefined) return;
      loadPending(at).then(
        (result) => {
          setPending(result.rows);
          setChanged(result.changed);
        },
        () => setPending(null),
      );
    }, 300);
  }, []);

  useEffect(refresh, [publishedAt, refresh]);

  useEffect(() => {
    const collections = [...new Set([...contentDefs().map((d) => d.collection), 'revisions'])];
    const unsubscribers: (() => void)[] = [];
    for (const collection of collections) {
      pb()
        .collection(collection)
        .subscribe('*', refresh)
        .then(
          (fn) => unsubscribers.push(fn),
          () => {},
        );
    }
    return () => unsubscribers.forEach((fn) => fn());
  }, [refresh]);

  const request = useCallback(
    async (path: string, setBusy: (busy: boolean) => void, body?: object) => {
      setBusy(true);
      setError('');
      try {
        await pb().send(path, { method: 'POST', body });
      } catch (err) {
        setError(errorMessage(err));
      } finally {
        setBusy(false);
        load();
      }
    },
    [load],
  );

  const inProgress = requesting || isInProgress(history?.[0]);
  const previewInProgress = requestingPreview || isInProgress(previews?.[0]);
  // Un reordenamiento cuenta una vez por lista.
  const pendingTotal = (pending ?? []).reduce((sum, row) => sum + row.count + (row.reordered ? 1 : 0), 0);
  return (
    <PublishContext.Provider
      value={{
        history,
        inProgress,
        error,
        publish: () => request('/api/publish', setRequesting),
        publishedAt,
        pending,
        pendingTotal,
        changed,
        finished,
        dismissFinished: () => setFinished(null),
        previewEnabled: !!previewKey,
        enterPreview,
        openPreview: (path = '/') => {
          enterPreview();
          window.open(path, '_blank', 'noopener');
        },
        lastPreview: previews?.[0],
        previewInProgress,
        requestPreview: (translate) => request('/api/preview', setRequestingPreview, { translate }),
      }}
    >
      {children}
    </PublishContext.Provider>
  );
}

export function usePublish() {
  const state = useContext(PublishContext);
  if (!state) throw new Error('usePublish fuera de PublishProvider');
  return state;
}

// ¿Tiene cambios de contenido que todavía no están en el sitio? (El orden no cuenta.)
export function useIsPending() {
  const { publishedAt, changed } = usePublish();
  return (record: RecordModel) =>
    publishedAt !== undefined && (publishedAt === null || record.created > publishedAt || changed.has(record.id));
}

// ¿Cambió el orden de la lista desde la última publicación?
export function useReordered() {
  const { publishedAt } = usePublish();
  const isPending = useIsPending();
  return (records: RecordModel[]) =>
    !!publishedAt && records.some((r) => r.updated > publishedAt && !isPending(r));
}

const UNSAVED = '\n\nOjo: hay cambios sin guardar en esta pantalla; no entran hasta guardarlos.';

// Publicar con la confirmación que lista lo que sube.
export function useConfirmPublish() {
  const { publish, pending, pendingTotal } = usePublish();
  return () => {
    const lines = (pending ?? []).map((row) => `• ${row.label}: ${pendingText(row)}`).join('\n');
    const unsaved = hasUnsaved() ? UNSAVED : '';
    const text = pendingTotal
      ? `¿Publicar? Se suben al sitio:\n${lines}${unsaved}\n\nTarda unos minutos.`
      : `No hay cambios guardados desde la última publicación. ¿Publicar igual?${unsaved}`;
    if (confirm(text)) publish();
  };
}

// Vista previa: arma el sitio con lo guardado (ocultos incluidos) sin publicarlo.
export function useRequestPreview() {
  const { requestPreview } = usePublish();
  return (translate: boolean) => {
    if (hasUnsaved() && !confirm(`La vista previa usa lo guardado.${UNSAVED}\n\n¿Armarla igual?`)) return;
    requestPreview(translate);
  };
}

// Última elección de "traducir textos nuevos" (apagado por defecto: no gasta el traductor).
const TRANSLATE_KEY = 'admin:preview-translate';
const readTranslate = () => {
  try {
    return localStorage.getItem(TRANSLATE_KEY) === '1';
  } catch {
    return false;
  }
};

export function PublishButton() {
  const { inProgress, pendingTotal } = usePublish();
  const confirmPublish = useConfirmPublish();
  return (
    <button type="button" className="btn btn-primary" disabled={inProgress} onClick={confirmPublish}>
      {inProgress ? 'Publicando…' : 'Publicar'}
      {!inProgress && pendingTotal > 0 && <span className="btn-count">{pendingTotal}</span>}
    </button>
  );
}

// Abre un panel con la opción de traducir lo nuevo y el botón para armarla.
export function PreviewButton({ className = 'btn', label = 'Vista previa' }: { className?: string; label?: string }) {
  const { previewEnabled, previewInProgress } = usePublish();
  const requestPreview = useRequestPreview();
  const [open, setOpen] = useState(false);
  const translations = !!config().translations;
  const [stored, setTranslate] = useState(readTranslate);
  const translate = translations && stored;
  const box = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  if (!previewEnabled) return null;
  return (
    <span className="preview-menu" ref={box}>
      <button
        type="button"
        className={className}
        disabled={previewInProgress}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {previewInProgress ? 'Armando vista previa…' : label}
      </button>
      {open && (
        <span className="preview-popover" role="dialog" aria-label="Vista previa">
          <span className="field-help">
            Arma el sitio con lo guardado (también lo oculto) sin publicarlo. Tarda uno o dos minutos.
          </span>
          {translations && (
            <Switch
              checked={translate}
              onChange={(on) => {
                setTranslate(on);
                try {
                  localStorage.setItem(TRANSLATE_KEY, on ? '1' : '0');
                } catch {}
              }}
            >
              Traducir textos nuevos
            </Switch>
          )}
          {translations && (
            <span className="field-help">
              {translate
                ? 'Lo nuevo o cambiado se traduce con el traductor automático (lo mismo que al publicar).'
                : 'Lo nuevo o cambiado se ve en español en los otros idiomas hasta publicar; no usa el traductor.'}
            </span>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setOpen(false);
              requestPreview(translate);
            }}
          >
            Armar vista previa
          </button>
        </span>
      )}
    </span>
  );
}

const what = (r: RecordModel) =>
  r.commit ? `un cambio de código (${r.commit.slice(0, 7)})` : 'los cambios guardados';
const capitalize = (s: string) => s[0].toUpperCase() + s.slice(1);

// Avisos arriba de cada pantalla: publicación o vista previa en curso, cuando
// terminan y, si no hay nada en curso, lo guardado que falta publicar.
export function PublishStatus({ showPending }: { showPending: boolean }) {
  const { history, finished, dismissFinished, pendingTotal, openPreview, lastPreview } = usePublish();
  const confirmPublish = useConfirmPublish();
  const current = history?.find(isInProgress);
  const preview = lastPreview && isInProgress(lastPreview) ? lastPreview : undefined;

  useEffect(() => {
    if (finished?.status === 'failed' || finished?.kind === 'preview') return;
    const timer = setTimeout(dismissFinished, 10_000);
    return () => clearTimeout(timer);
  }, [finished]);

  const close = (
    <button type="button" className="icon-btn" aria-label="Cerrar aviso" onClick={dismissFinished}>
      ✕
    </button>
  );

  return (
    <>
      {current && (
        <div className="publish-status is-running" role="status">
          {current.status === 'queued' ? 'En cola para publicar' : 'Publicando'} {what(current)}… Tarda unos minutos;
          puedes seguir editando (lo que guardes ahora sale con la próxima publicación).
        </div>
      )}
      {preview && (
        <div className="publish-status is-running" role="status">
          Armando la vista previa con lo guardado… Tarda uno o dos minutos.
        </div>
      )}
      {finished?.kind === 'preview' && !preview && (
        <div className={`publish-status ${finished.status === 'done' ? 'is-done' : 'is-failed'}`} role="status">
          {finished.status === 'done' ? (
            <span>
              Vista previa lista.{' '}
              <button type="button" className="btn btn-ghost" onClick={() => openPreview()}>
                Abrir ↗
              </button>
            </span>
          ) : (
            <span>No se pudo armar la vista previa; el sitio publicado no cambió.</span>
          )}
          {close}
        </div>
      )}
      {finished && finished.kind !== 'preview' && !current && (
        <div className={`publish-status ${finished.status === 'failed' ? 'is-failed' : 'is-done'}`} role="status">
          {finished.status === 'done' ? (
            <span>El sitio se actualizó con {what(finished)}.</span>
          ) : finished.status === 'skipped' ? (
            <span>{capitalize(what(finished))} no afecta al sitio; no hizo falta publicar.</span>
          ) : (
            <span>
              Falló la publicación de {what(finished)}; el sitio sigue como estaba. <a href="#/">Ver detalles</a>
            </span>
          )}
          {close}
        </div>
      )}
      {showPending && !current && !finished && pendingTotal > 0 && (
        <div className="publish-status is-pending" role="status">
          <span>
            {pendingTotal === 1 ? 'Hay 1 cambio guardado' : `Hay ${pendingTotal} cambios guardados`} que todavía no{' '}
            {pendingTotal === 1 ? 'está' : 'están'} en el sitio. <a href="#/">Ver cuáles</a>
          </span>
          <span className="inline-actions">
            <PreviewButton className="btn btn-ghost" />
            <button type="button" className="btn" onClick={confirmPublish}>
              Publicar
            </button>
          </span>
        </div>
      )}
    </>
  );
}
