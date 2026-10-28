// Bandeja de /admin: lo que envían los visitantes (formularios del sitio, ver
// kit/forms). Cada pestaña es una colección; aquí solo se leen y se cambia el
// estado. El kit trae la de contactos (`leadsTab`); el proyecto puede sumar las
// suyas (p. ej. el libro de reclamaciones).
import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { config, type ScreenDef } from '../config';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';

export type InboxTab = {
  // Segmento de la URL (#/bandeja/<key>).
  key: string;
  label: string;
  collection: string;
  // Filtro de lo pendiente: el número del menú y "Solo pendientes" en la lista.
  pendingFilter: string;
  pendingLabel: string;
  // Antes del nombre en la lista (p. ej. el número de reclamo).
  prefix?: (record: RecordModel) => ReactNode;
  Badge: ComponentType<{ record: RecordModel }>;
  Detail: ComponentType<{ record: RecordModel; onSaved: (record: RecordModel) => void }>;
};

export const parseDate = (iso: string) => new Date(iso.replace(' ', 'T'));
export const formatDate = (iso: string) =>
  parseDate(iso).toLocaleString(config().locale ?? 'es-PE', { dateStyle: 'medium', timeStyle: 'short' });

// Datos de un registro (se omiten los vacíos).
export function Fields({ rows }: { rows: [string, string | undefined | false][] }) {
  return (
    <dl className="details">
      {rows
        .filter(([, value]) => value)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}

export function inboxScreen(tabs: InboxTab[], { key = 'bandeja', title = 'Bandeja' } = {}): ScreenDef {
  return {
    kind: 'screen',
    key,
    title,
    Screen: ({ route }) => <InboxScreen base={key} title={title} tabs={tabs} tab={route[0]} id={route[1]} />,
    useBadge: () => usePending(tabs),
  };
}

type ScreenProps = { base: string; title: string; tabs: InboxTab[]; tab?: string; id?: string };

function InboxScreen({ base, title, tabs, tab, id }: ScreenProps) {
  const current = tabs.find((t) => t.key === tab) ?? tabs[0];
  return (
    <section>
      <header className="screen-header">
        <h1>{title}</h1>
      </header>
      {tabs.length > 1 && (
        <div className="tabs">
          {tabs.map((t) => (
            <a key={t.key} href={`#/${base}/${t.key}`} className={t === current ? 'is-active' : ''}>
              {t.label}
            </a>
          ))}
        </div>
      )}
      {id ? (
        <Detail key={id} base={base} tab={current} id={id} />
      ) : (
        <List key={current.key} base={base} tab={current} />
      )}
    </section>
  );
}

function List({ base, tab }: { base: string; tab: InboxTab }) {
  const [records, setRecords] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');
  const [pendingOnly, setPendingOnly] = useState(true);

  useEffect(() => {
    setRecords(null);
    pb()
      .collection(tab.collection)
      .getList(1, 200, { filter: pendingOnly ? tab.pendingFilter : '', sort: '-created' })
      .then(
        (list) => setRecords(list.items),
        (err) => setError(errorMessage(err)),
      );
  }, [tab, pendingOnly]);

  return (
    <>
      <div className="toolbar">
        <label className="checkbox">
          <input type="checkbox" checked={pendingOnly} onChange={(e) => setPendingOnly(e.target.checked)} />
          {tab.pendingLabel}
        </label>
      </div>
      {error && <p className="notice-error">{error}</p>}
      {!records && !error && <p className="muted">Cargando…</p>}
      {records && records.length === 0 && <p className="muted">No hay nada pendiente.</p>}
      {records && records.length > 0 && (
        <ul className="sortable">
          {records.map((r) => (
            <li key={r.id}>
              <a className="list-row" href={`#/${base}/${tab.key}/${r.id}`}>
                <span className="list-label">
                  {tab.prefix && <strong>{tab.prefix(r)} · </strong>}
                  {r.name}
                  <span className="muted"> · {formatDate(r.created)}</span>
                </span>
                <tab.Badge record={r} />
              </a>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Detail({ base, tab, id }: { base: string; tab: InboxTab; id: string }) {
  const [record, setRecord] = useState<RecordModel | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    pb()
      .collection(tab.collection)
      .getOne(id)
      .then(setRecord, (err) => setError(errorMessage(err)));
  }, [tab, id]);

  if (error && !record) return <p className="notice-error">{error}</p>;
  if (!record) return <p className="muted">Cargando…</p>;
  return (
    <>
      <p className="breadcrumb">
        <a href={`#/${base}/${tab.key}`}>← Volver</a>
      </p>
      <tab.Detail record={record} onSaved={setRecord} />
    </>
  );
}

// Cantidad pendiente para el menú, al día con realtime.
function usePending(tabs: InboxTab[]) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const load = () =>
      Promise.all(
        tabs.map((t) => pb().collection(t.collection).getList(1, 1, { filter: t.pendingFilter, fields: 'id' })),
      ).then(
        (lists) => setCount(lists.reduce((sum, list) => sum + list.totalItems, 0)),
        () => {},
      );
    load();
    const unsubscribers: (() => void)[] = [];
    for (const { collection } of tabs) {
      pb()
        .collection(collection)
        .subscribe('*', load)
        .then(
          (fn) => unsubscribers.push(fn),
          () => {},
        );
    }
    return () => unsubscribers.forEach((fn) => fn());
  }, []);
  return count;
}
