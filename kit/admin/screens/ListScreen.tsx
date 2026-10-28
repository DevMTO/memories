// Lista de una colección: búsqueda, filtros (visibles, ocultos, sin publicar),
// mostrar/ocultar con un interruptor y orden arrastrable (guarda sort_order de
// toda la lista en un lote).
import { useEffect, useState } from 'react';
import { fieldsOf, type CollectionDef } from '../config';
import { formatTime } from '../components/RecordEditor';
import { SortableList } from '../components/SortableList';
import { Switch } from '../components/Switch';
import { errorMessage, fileUrl, pb, type RecordModel } from '../lib/pocketbase';
import { useIsPending, useReordered } from '../lib/publish';
import { deletedCount } from './TrashScreen';

type Filter = 'all' | 'published' | 'draft' | 'pending';

export function ListScreen({ def }: { def: CollectionDef }) {
  const [records, setRecords] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [deleted, setDeleted] = useState(0);
  const [toggling, setToggling] = useState<string | null>(null);
  const hasStatus = fieldsOf(def.fields).some((f) => f.type === 'status');
  const isPending = useIsPending();
  const reordered = useReordered();

  useEffect(() => {
    setRecords(null);
    setSearch('');
    setFilter('all');
    pb()
      .collection(def.collection)
      .getFullList({ filter: def.filter, sort: def.sortable ? 'sort_order,created' : '-created' })
      .then(setRecords, (err) => setError(errorMessage(err)));
    deletedCount(def).then(setDeleted, () => setDeleted(0));
  }, [def]);

  async function reorder(next: RecordModel[]) {
    const previous = records;
    setRecords(next);
    setSaving('saving');
    setError('');
    try {
      const batch = pb().createBatch();
      next.forEach((r, i) => {
        if (r.sort_order !== (i + 1) * 10) batch.collection(def.collection).update(r.id, { sort_order: (i + 1) * 10 });
      });
      const results = await batch.send();
      const saved = new Map(results.map((result) => [result.body.id, result.body as RecordModel]));
      setRecords(next.map((r, i) => saved.get(r.id) ?? { ...r, sort_order: (i + 1) * 10 }));
      setSaving('saved');
    } catch (err) {
      setRecords(previous);
      setSaving('idle');
      setError('No se pudo guardar el orden: ' + errorMessage(err));
    }
  }

  const query = search.trim().toLowerCase();
  const filtered = (records ?? []).filter(
    (r) =>
      (filter === 'all' || (filter === 'pending' ? isPending(r) : r.status === filter)) &&
      (!query || def.label(r).toLowerCase().includes(query)),
  );
  // Solo se ordena viendo la lista completa; si no, el orden de lo oculto quedaría ambiguo.
  const canSort = def.sortable && !query && filter === 'all';

  // Mostrar u ocultar desde la lista: se guarda al momento (sale en el sitio al publicar).
  async function setVisible(r: RecordModel, visible: boolean) {
    setToggling(r.id);
    setError('');
    try {
      const saved = await pb()
        .collection(def.collection)
        .update(r.id, { status: visible ? 'published' : 'draft' });
      setRecords((prev) => prev && prev.map((x) => (x.id === saved.id ? saved : x)));
    } catch (err) {
      setError(`No se pudo cambiar "${def.label(r)}": ${errorMessage(err)}`);
    } finally {
      setToggling(null);
    }
  }

  const row = (r: RecordModel) => {
    const image = def.thumb?.map((field) => r[field]).find(Boolean);
    return (
      <div className="list-item">
        <a className="list-row" href={`#/${def.key}/${r.id}`}>
          {def.thumb && (
            <span className="thumb">{image ? <img src={fileUrl(r, image)} alt="" loading="lazy" /> : null}</span>
          )}
          <span className="list-label">
            {def.label(r)}
            <span className="list-meta">Editado {formatTime(r.updated)}</span>
          </span>
          {isPending(r) && <span className="badge badge-building">Sin publicar</span>}
        </a>
        {hasStatus && (
          <Switch
            checked={r.status === 'published'}
            disabled={toggling === r.id}
            label={`Visible en el sitio: ${def.label(r)}`}
            onChange={(on) => setVisible(r, on)}
          >
            {r.status === 'published' ? 'Visible' : 'Oculto'}
          </Switch>
        )}
      </div>
    );
  };

  return (
    <section>
      <header className="screen-header">
        <h1>{def.title}</h1>
        <a className="btn btn-primary" href={`#/${def.key}/nuevo`}>
          + Nuevo {def.singular}
        </a>
      </header>

      <div className="toolbar">
        <input type="search" placeholder="Buscar…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Filtrar">
          <option value="all">Todos</option>
          {hasStatus && <option value="published">Visibles</option>}
          {hasStatus && <option value="draft">Ocultos</option>}
          <option value="pending">Sin publicar</option>
        </select>
        {saving === 'saving' && <span className="muted">Guardando orden…</span>}
        {saving === 'saved' && <span className="muted">Orden guardado</span>}
      </div>

      {error && <p className="notice-error">{error}</p>}
      {!records && !error && <p className="muted">Cargando…</p>}
      {records && filtered.length === 0 && <p className="muted">No hay nada aquí.</p>}
      {records && filtered.length > 0 && (
        <>
          {def.sortable && !canSort && (
            <p className="field-help">Para cambiar el orden, quita la búsqueda y el filtro.</p>
          )}
          {def.sortable && canSort && (
            <p className="field-help">Arrastra (o usa las flechas) para cambiar el orden en el sitio.</p>
          )}
          {def.sortable && records && reordered(records) && (
            <p className="notice-info">El orden cambió: se verá así en el sitio después de publicar.</p>
          )}
          <SortableList
            items={filtered}
            getKey={(r) => r.id}
            onReorder={reorder}
            render={row}
            disabled={!canSort || saving === 'saving'}
          />
        </>
      )}
      {deleted > 0 && (
        <p>
          <a href={`#/${def.key}/borrados`}>Borrados recientemente ({deleted})</a>
        </p>
      )}
    </section>
  );
}

export function StatusBadge({ status }: { status: string }) {
  return status === 'published' ? (
    <span className="badge badge-ok">Visible</span>
  ) : (
    <span className="badge">Oculto</span>
  );
}
