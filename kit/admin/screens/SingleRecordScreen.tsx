// Colecciones de un solo registro (p. ej. página de inicio, datos de la
// empresa). El registro lo crea una migración; aquí solo se edita.
import { useEffect, useState } from 'react';
import type { SingleDef } from '../config';
import { History } from '../components/History';
import { RecordEditor, type Seed } from '../components/RecordEditor';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';
import { useIsPending } from '../lib/publish';

export function SingleRecordScreen({ def }: { def: SingleDef }) {
  const [record, setRecord] = useState<RecordModel | null>(null);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [seed, setSeed] = useState<Seed | undefined>();
  const [editorKey, setEditorKey] = useState(0);
  const isPending = useIsPending();

  useEffect(() => {
    pb()
      .collection(def.collection)
      .getFirstListItem('')
      .then(setRecord, (err) => setError(errorMessage(err)));
  }, [def.collection]);

  return (
    <section>
      <header className="screen-header">
        <h1>{def.title}</h1>
        {record && (
          <div className="header-actions">
            {isPending(record) && <span className="badge badge-building">Sin publicar</span>}
            <button type="button" className="btn btn-ghost" onClick={() => setShowHistory(!showHistory)}>
              Historial
            </button>
          </div>
        )}
      </header>
      {def.intro}
      {error && <p className="notice-error">{error}</p>}
      {!record && !error && <p className="muted">Cargando…</p>}
      {record && showHistory && (
        <History
          collection={def.collection}
          record={record}
          items={def.fields}
          onClose={() => setShowHistory(false)}
          onRestore={(restored) => {
            setSeed(restored);
            setEditorKey((k) => k + 1);
            setShowHistory(false);
          }}
        />
      )}
      {record && (
        <RecordEditor
          key={editorKey}
          collection={def.collection}
          items={def.fields}
          record={record}
          draftKey={`${def.collection}:${record.id}`}
          seed={seed}
          onSaved={(saved) => {
            setRecord(saved);
            setSeed(undefined);
          }}
        />
      )}
    </section>
  );
}
