// Ficha de un registro de una colección: crear, editar, duplicar, historial y borrar.
// Rutas: #/<sección>/<id>, #/<sección>/nuevo y #/<sección>/nuevo/<id a copiar>.
import { useEffect, useState } from 'react';
import { fieldsOf, type CollectionDef } from '../config';
import { History } from '../components/History';
import { RecordEditor, initialValues, mainTextField, type Seed } from '../components/RecordEditor';
import { errorMessage, fileUrl, pb, type RecordModel } from '../lib/pocketbase';
import { useIsPending, usePublish } from '../lib/publish';
import { navigate, replaceRoute } from '../lib/router';
import { StatusBadge } from './ListScreen';

// Primera URL libre: <slug>-copia, <slug>-copia-2…
async function freeSlug(collection: string, slug: string) {
  for (let n = 1; n < 50; n++) {
    const candidate = `${slug}-copia${n > 1 ? `-${n}` : ''}`;
    const taken = await pb()
      .collection(collection)
      .getList(1, 1, { filter: pb().filter('slug = {:candidate}', { candidate }), fields: 'id' });
    if (!taken.totalItems) return candidate;
  }
  return `${slug}-copia`;
}

// Copia de un registro como nuevo: textos y elecciones, y las imágenes
// descargadas para volver a subirlas.
async function duplicateSeed(def: CollectionDef, source: RecordModel): Promise<Seed> {
  const fields = fieldsOf(def.fields);
  const nameField = mainTextField(fields);
  const overrides = def.duplicate
    ? def.duplicate(source)
    : {
        ...(nameField ? { [nameField]: `${source[nameField]} (copia)` } : {}),
        ...(fields.some((f) => f.type === 'slug') ? { slug: await freeSlug(def.collection, source.slug) } : {}),
        ...(fields.some((f) => f.type === 'status') ? { status: 'draft' } : {}),
      };
  const images: Record<string, File> = {};
  await Promise.all(
    fields
      .filter((f) => f.type === 'image' && source[f.name])
      .map(async (f) => {
        const res = await fetch(fileUrl(source, source[f.name]));
        if (res.ok) images[f.name] = new File([await res.blob()], source[f.name], { type: res.headers.get('content-type') ?? '' });
      }),
  );
  return {
    values: { ...initialValues(fields, source, {}), ...overrides },
    images,
    note: `Copia de "${def.label(source)}": revisa y guarda. Queda oculta hasta que la hagas visible.`,
  };
}

// Dónde está elegido este registro (para avisar antes de borrarlo).
async function usages(def: CollectionDef, id: string) {
  const found: string[] = [];
  for (const use of def.usedIn ?? []) {
    const filter = use.fields.map((field) => pb().filter(`${field}.id ?= {:id}`, { id })).join(' || ');
    const list = await pb().collection(use.collection).getList(1, 1, { filter, fields: 'id' });
    if (list.totalItems) found.push(use.label);
  }
  return found;
}

export function FormScreen({ def, id, copyFrom }: { def: CollectionDef; id: string; copyFrom?: string }) {
  const isNew = id === 'nuevo';
  const [record, setRecord] = useState<RecordModel | null>(null);
  const [seed, setSeed] = useState<Seed | undefined>();
  const [loading, setLoading] = useState(!isNew || !!copyFrom);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  // Al crear, la URL pasa de "nuevo" al id sin rearmar el formulario (se
  // mantiene el aviso de "Guardado"). Restaurar una versión sí lo rearma.
  const [editorKey, setEditorKey] = useState(id);
  const isPending = useIsPending();
  const { previewEnabled, openPreview, lastPreview } = usePublish();

  useEffect(() => {
    setError('');
    if (record && record.id === id) return;
    setEditorKey(`${id}:${copyFrom ?? ''}`);
    setSeed(undefined);
    setShowHistory(false);
    if (isNew) {
      setRecord(null);
      if (!copyFrom) return setLoading(false);
      setLoading(true);
      pb()
        .collection(def.collection)
        .getOne(copyFrom)
        .then((source) => duplicateSeed(def, source))
        .then(setSeed, (err) => setError(errorMessage(err)))
        .finally(() => setLoading(false));
      return;
    }
    setLoading(true);
    pb()
      .collection(def.collection)
      .getOne(id)
      .then(setRecord, (err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [def, id, copyFrom]);

  async function remove() {
    if (!record) return;
    let warning = '';
    try {
      const used = await usages(def, record.id);
      if (used.length) warning = `\n\nEstá elegido en ${used.join(', ')}; se quitará de ahí.`;
    } catch {
      // Sin poder revisarlo, se borra igual (queda en Borrados).
    }
    if (!confirm(`¿Borrar "${def.label(record)}"? Se puede restaurar desde "Borrados", sin imágenes.${warning}`)) return;
    try {
      await pb().collection(def.collection).delete(record.id);
      navigate(def.key);
    } catch (err) {
      setError('No se pudo borrar: ' + errorMessage(err));
    }
  }

  if (loading) return <p className="muted">Cargando…</p>;
  if (error && !record && !isNew) return <p className="notice-error">{error}</p>;

  const label = record ? def.label(record) : `Nuevo ${def.singular}`;
  const sitePath = record?.status === 'published' && def.sitePath?.(record);
  // En la última vista previa armada (incluye lo oculto, pero no lo guardado después).
  const previewPath = previewEnabled && lastPreview?.status === 'done' && record && def.sitePath?.(record);
  const hasStatus = fieldsOf(def.fields).some((f) => f.type === 'status');

  return (
    <section>
      <p className="breadcrumb">
        <a href={`#/${def.key}`}>← {def.title}</a>
      </p>
      <header className="screen-header">
        <h1>{label}</h1>
        <div className="header-actions">
          {record && hasStatus && <StatusBadge status={record.status} />}
          {record && isPending(record) && <span className="badge badge-building">Sin publicar</span>}
          {sitePath && (
            <a className="btn btn-ghost" href={sitePath} target="_blank" rel="noopener">
              Ver en el sitio ↗
            </a>
          )}
          {previewPath && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => openPreview(previewPath)}
              title="En la última vista previa armada; para ver lo último guardado, arma otra"
            >
              Vista previa ↗
            </button>
          )}
          {record && (
            <>
              <button type="button" className="btn btn-ghost" onClick={() => setShowHistory(!showHistory)}>
                Historial
              </button>
              <a className="btn btn-ghost" href={`#/${def.key}/nuevo/${record.id}`}>
                Duplicar
              </a>
            </>
          )}
        </div>
      </header>
      {error && <p className="notice-error">{error}</p>}
      {record && showHistory && (
        <History
          collection={def.collection}
          record={record}
          items={def.fields}
          onClose={() => setShowHistory(false)}
          onRestore={(restored) => {
            setSeed(restored);
            setEditorKey(`${id}:${Date.now()}`);
            setShowHistory(false);
          }}
        />
      )}
      <RecordEditor
        key={editorKey}
        collection={def.collection}
        items={def.fields}
        record={record}
        defaults={def.defaults}
        draftKey={`${def.collection}:${record?.id ?? (copyFrom ? `copia:${copyFrom}` : `nuevo:${def.key}`)}`}
        seed={seed}
        onSaved={(saved) => {
          setRecord(saved);
          setSeed(undefined);
          if (isNew) replaceRoute(`${def.key}/${saved.id}`);
        }}
        actions={
          record && (
            <button type="button" className="btn btn-ghost btn-danger" onClick={remove}>
              Borrar
            </button>
          )
        }
      />
    </section>
  );
}
