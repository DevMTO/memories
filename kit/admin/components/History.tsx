// Versiones anteriores de un registro (kit/pocketbase/core/hooks/revisions.pb.js):
// qué cambió en cada una y cargarla en el formulario para revisarla y guardarla.
import { useEffect, useState } from 'react';
import { fieldsOf, isFileField, type Field, type FormItem } from '../config';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';
import { formatTime, initialValues, type Seed } from './RecordEditor';

type Props = {
  collection: string;
  record: RecordModel;
  items: FormItem[];
  onRestore: (seed: Seed) => void;
  onClose: () => void;
};

function shown(field: Field, value: unknown) {
  if (field.type === 'status') return value === 'published' ? 'Visible' : 'Oculto';
  if (field.type === 'bool') return value ? 'Sí' : 'No';
  if (field.type === 'relation' || field.type === 'custom') return '(otro valor)';
  const text = String(value ?? '').trim();
  if (!text) return '(vacío)';
  return text.length > 300 ? text.slice(0, 300) + '…' : text;
}

export function History({ collection, record, items, onRestore, onClose }: Props) {
  const [revisions, setRevisions] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const fields = fieldsOf(items).filter((f) => !isFileField(f));
  const current = initialValues(fields, record, {});

  useEffect(() => {
    pb()
      .collection('revisions')
      .getList(1, 50, {
        filter: pb().filter('collection_name = {:collection} && record = {:record} && action = "update"', {
          collection,
          record: record.id,
        }),
        sort: '-created',
      })
      .then(
        (list) => setRevisions(list.items),
        (err) => setError(errorMessage(err)),
      );
  }, [collection, record.id, record.updated]);

  const labelOf = (name: string) => fieldsOf(items).find((f) => f.name === name)?.label ?? name;

  return (
    <article className="card history">
      <header className="screen-header">
        <h2>Historial</h2>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Cerrar
        </button>
      </header>
      <p className="field-help">
        Cómo estaba antes de cada vez que se guardó. Restaurar carga esa versión en el formulario: revísala y guarda.
        Las imágenes anteriores no se conservan.
      </p>
      {error && <p className="notice-error">{error}</p>}
      {!revisions && !error && <p className="muted">Cargando…</p>}
      {revisions?.length === 0 && <p className="muted">Todavía no hay versiones anteriores.</p>}
      <ul className="plain history-list">
        {revisions?.map((rev) => {
          const old = initialValues(fields, rev.data, {});
          const diff = fields.filter((f) => JSON.stringify(old[f.name]) !== JSON.stringify(current[f.name]));
          const changed = (rev.changed ?? []) as string[];
          return (
            <li key={rev.id}>
              <div className="history-row">
                <div>
                  <strong>{formatTime(rev.data.updated)}</strong>
                  <span className="muted">
                    {' '}
                    · después se cambió: {changed.map(labelOf).join(', ') || '—'} ({formatTime(rev.created)})
                  </span>
                </div>
                <div className="inline-actions">
                  <button type="button" className="btn btn-ghost" onClick={() => setOpen(open === rev.id ? null : rev.id)}>
                    {open === rev.id ? 'Ocultar' : 'Comparar'}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    disabled={diff.length === 0}
                    onClick={() =>
                      onRestore({
                        values: old,
                        note: `Versión del ${formatTime(rev.data.updated)} cargada: revisa y guarda para aplicarla.`,
                      })
                    }
                  >
                    Restaurar
                  </button>
                </div>
              </div>
              {open === rev.id &&
                (diff.length === 0 ? (
                  <p className="muted">Igual a lo actual (sin contar imágenes).</p>
                ) : (
                  <dl className="details">
                    {diff.map((f) => (
                      <div key={f.name}>
                        <dt>{f.label}</dt>
                        <dd>
                          <span className="diff-old">{shown(f, old[f.name])}</span>
                          <span className="diff-new">Ahora: {shown(f, current[f.name])}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                ))}
            </li>
          );
        })}
      </ul>
    </article>
  );
}
