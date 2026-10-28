// Borrados de una sección, desde el historial de versiones: se restauran con el
// mismo id (los enlaces y las elecciones que apuntaban a él vuelven a servir),
// ocultos y sin imágenes (PocketBase borra los archivos con el registro).
import { useEffect, useState } from 'react';
import { fieldsOf, isFileField, type CollectionDef } from '../config';
import { formatTime } from '../components/RecordEditor';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';
import { navigate } from '../lib/router';

// Varias secciones pueden compartir colección (p. ej. tours y paquetes): cada
// una muestra los suyos según sus valores por defecto.
const belongsTo = (def: CollectionDef, data: Record<string, unknown>) =>
  Object.entries(def.defaults ?? {}).every(([key, value]) => key === 'status' || data[key] === value);

export async function deletedCount(def: CollectionDef) {
  return (await loadDeleted(def)).length;
}

async function loadDeleted(def: CollectionDef) {
  const [revisions, existing] = await Promise.all([
    pb()
      .collection('revisions')
      .getList(1, 200, {
        filter: pb().filter('collection_name = {:collection} && action = "delete"', { collection: def.collection }),
        sort: '-created',
      }),
    pb().collection(def.collection).getFullList({ fields: 'id' }),
  ]);
  const ids = new Set(existing.map((r) => r.id));
  const seen = new Set<string>();
  return revisions.items.filter((rev) => {
    if (ids.has(rev.record) || seen.has(rev.record) || !belongsTo(def, rev.data)) return false;
    seen.add(rev.record);
    return true;
  });
}

export function TrashScreen({ def }: { def: CollectionDef }) {
  const [deleted, setDeleted] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDeleted(def).then(setDeleted, (err) => setError(errorMessage(err)));
  }, [def]);

  async function restore(rev: RecordModel) {
    const fields = fieldsOf(def.fields);
    const { collectionId, collectionName, created, updated, expand, ...data } = rev.data;
    for (const field of fields) if (isFileField(field)) delete data[field.name];
    if (fields.some((f) => f.type === 'status')) data.status = 'draft';
    try {
      await pb()
        .collection(def.collection)
        .create({ ...data, id: rev.record });
      navigate(`${def.key}/${rev.record}`);
    } catch (err) {
      setError('No se pudo restaurar: ' + errorMessage(err));
    }
  }

  return (
    <section>
      <p className="breadcrumb">
        <a href={`#/${def.key}`}>← {def.title}</a>
      </p>
      <header className="screen-header">
        <h1>Borrados: {def.title}</h1>
      </header>
      <p className="field-help">
        Se restauran con sus textos y datos, ocultos y sin imágenes (hay que volver a subirlas).
      </p>
      {error && <p className="notice-error">{error}</p>}
      {!deleted && !error && <p className="muted">Cargando…</p>}
      {deleted?.length === 0 && <p className="muted">No hay nada borrado.</p>}
      {deleted && deleted.length > 0 && (
        <ul className="sortable">
          {deleted.map((rev) => (
            <li key={rev.id}>
              <span className="list-label">
                {def.label(rev.data as RecordModel) || rev.record}
                <span className="muted"> · borrado el {formatTime(rev.created)}</span>
              </span>
              <button type="button" className="btn" onClick={() => restore(rev)}>
                Restaurar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
