// Formulario genérico de un registro, armado a partir de la lista de campos de
// la configuración. Lo usan las fichas de las colecciones y las de un solo registro.
import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { config, fieldsOf, isSection, type Field, type FormItem } from '../config';
import { clearDraft, loadDraft, saveDraft, type Draft } from '../lib/drafts';
import { errorMessage, fieldErrors, fileUrl, pb, type RecordModel } from '../lib/pocketbase';
import { PreviewButton, useConfirmPublish } from '../lib/publish';
import { useUnsavedGuard } from '../lib/router';
import { ImageField, type ImageChange } from './ImageField';
import { RelationField } from './RelationField';
import { Switch } from './Switch';

type Values = Record<string, any>;

// Valores con los que arranca el formulario en lugar de los del registro (una
// copia al duplicar, una versión anterior). Quedan sin guardar.
export type Seed = { values?: Values; images?: Record<string, File>; note: string };

type Props = {
  collection: string;
  items: FormItem[];
  record: RecordModel | null; // null = nuevo
  defaults?: Values;
  // Clave de la copia local del formulario (ver lib/drafts.ts).
  draftKey: string;
  seed?: Seed;
  onSaved: (record: RecordModel) => void;
  actions?: ReactNode;
};

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/, '');

export const formatTime = (value: string | number) =>
  new Date(typeof value === 'string' ? value.replace(' ', 'T') : value).toLocaleString(config().locale ?? 'es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

export function initialValues(fields: Field[], record: Values | null, defaults: Values): Values {
  const source: Values = record ?? defaults;
  const values: Values = {};
  for (const field of fields) {
    const value = source[field.name];
    switch (field.type) {
      case 'image':
        break;
      case 'number':
        // PocketBase guarda 0 en los números vacíos; el sitio los trata como vacíos.
        values[field.name] = value ? String(value) : '';
        break;
      case 'relation':
        values[field.name] = field.multiple ? [value ?? []].flat() : (value ?? '');
        break;
      case 'status':
        values[field.name] = value || 'draft';
        break;
      case 'custom':
        values[field.name] = field.initial(value);
        break;
      default:
        values[field.name] = value ?? '';
    }
  }
  return values;
}

// El "nombre" del registro: de ahí sale la URL y el " (copia)" al duplicar.
export const mainTextField = (fields: Field[]) =>
  (fields.find((f) => f.type === 'text' && f.required) ?? fields.find((f) => f.type === 'text'))?.name;

// Solo los campos de este formulario (una copia local vieja puede traer otros).
const pick = (fields: Field[], values: Values = {}) =>
  Object.fromEntries(fields.filter((f) => f.type !== 'image' && f.name in values).map((f) => [f.name, values[f.name]]));

const isEmpty = (field: Field, value: unknown) =>
  field.type === 'custom' && field.isEmpty
    ? field.isEmpty(value)
    : Array.isArray(value)
      ? value.length === 0
      : !String(value ?? '').trim();

function validate(fields: Field[], values: Values, images: Record<string, ImageChange>, record: RecordModel | null) {
  const errors: Record<string, string> = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.type === 'image') {
      const hasImage =
        images[field.name] instanceof File || (images[field.name] === undefined && !!record?.[field.name]);
      if (field.required && !hasImage) errors[field.name] = 'Obligatorio.';
      continue;
    }
    if (field.required && isEmpty(field, value)) {
      errors[field.name] = 'Obligatorio.';
    } else if ((field.type === 'text' || field.type === 'textarea') && field.max && value.length > field.max) {
      errors[field.name] = `Demasiado largo: ${value.length} de ${field.max} caracteres.`;
    } else if (field.type === 'slug' && value && !SLUG_PATTERN.test(value)) {
      errors[field.name] = 'Solo minúsculas, números y guiones (p. ej. "machu-picchu-2-dias").';
    } else if (field.type === 'number' && value !== '') {
      const n = Number(value);
      if (!Number.isFinite(n)) errors[field.name] = 'Debe ser un número.';
      else if (field.integer && !Number.isInteger(n)) errors[field.name] = 'Debe ser un número entero.';
      else if (field.min !== undefined && n < field.min) errors[field.name] = `Mínimo ${field.min}.`;
    } else if (field.type === 'custom' && field.validate) {
      const error = field.validate(value);
      if (error) errors[field.name] = error;
    }
  }
  return errors;
}

function toPayload(fields: Field[], values: Values, images: Record<string, ImageChange>) {
  const data: Values = {};
  for (const field of fields) {
    if (field.type === 'image') {
      if (images[field.name] !== undefined) data[field.name] = images[field.name];
      continue;
    }
    const value = values[field.name];
    if (field.type === 'number') data[field.name] = value === '' ? null : Number(value);
    else if (field.type === 'custom') data[field.name] = field.clean ? field.clean(value) : value;
    else if (typeof value === 'string') data[field.name] = value.trim();
    else data[field.name] = value;
  }
  return data;
}

export function RecordEditor({ collection, items, record, defaults = {}, draftKey, seed, onSaved, actions }: Props) {
  const fields = useMemo(() => fieldsOf(items), [items]);
  const initial = useMemo(() => initialValues(fields, record, defaults), [fields, record]);
  const [values, setValues] = useState<Values>(() => ({ ...initial, ...pick(fields, seed?.values) }));
  const [images, setImages] = useState<Record<string, ImageChange>>(() => seed?.images ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  // `saved`: recién guardado; se ofrece el paso siguiente (vista previa o publicar).
  const [message, setMessage] = useState<{ kind: 'ok' | 'error' | 'info'; text: string; saved?: boolean } | null>(
    seed ? { kind: 'info', text: seed.note } : null,
  );
  const [saving, setSaving] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmPublish = useConfirmPublish();

  // Copia local de una sesión anterior que no se llegó a guardar.
  const [offer, setOffer] = useState<Draft | null>(() => {
    if (seed) return null;
    const draft = loadDraft(draftKey);
    if (!draft) return null;
    const restored = { ...initial, ...pick(fields, draft.values) };
    return JSON.stringify(restored) === JSON.stringify(initial) ? null : draft;
  });

  const wasPublished = record?.status === 'published';
  const hasSlug = fields.some((f) => f.type === 'slug');
  const nameField = mainTextField(fields);
  // La URL se propone a partir del nombre mientras esté oculto y nadie la haya tocado.
  const [slugTouched, setSlugTouched] = useState(
    !!record && !!nameField && record.slug !== slugify(record[nameField] ?? ''),
  );

  const dirty =
    JSON.stringify(values) !== JSON.stringify(initial) || Object.values(images).some((change) => change !== undefined);
  useUnsavedGuard(dirty);

  useEffect(() => {
    if (offer) return;
    if (!dirty) return clearDraft(draftKey);
    const timer = setTimeout(() => saveDraft(draftKey, values, record?.updated), 600);
    return () => clearTimeout(timer);
  }, [values, dirty, offer]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const set = (name: string, value: unknown) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      if (name === nameField && hasSlug && !slugTouched && !wasPublished) next.slug = slugify(String(value));
      return next;
    });
    setErrors(({ [name]: _, ...rest }) => rest);
    setMessage(null);
  };

  async function save(e: FormEvent) {
    e.preventDefault();
    if (saving || (!dirty && record)) return;
    const found = validate(fields, values, images, record);
    setErrors(found);
    if (Object.keys(found).length) {
      setMessage({ kind: 'error', text: 'Revisa los campos marcados.' });
      return;
    }
    if (
      wasPublished &&
      hasSlug &&
      values.slug !== record?.slug &&
      !confirm(
        'Cambiar la URL de algo visible en el sitio rompe los enlaces que ya existen (buscadores, redes, mensajes). ¿Cambiarla?',
      )
    ) {
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      if (record) {
        const fresh = await pb().collection(collection).getOne(record.id, { fields: 'updated' });
        if (
          fresh.updated !== record.updated &&
          !confirm(
            `Esto se guardó desde otro lugar (otra pestaña u otra persona) el ${formatTime(fresh.updated)}, después de que lo abriste.\n\n` +
              'Si guardas, reemplazas esos cambios (quedan en el Historial). ¿Guardar igual?',
          )
        ) {
          return;
        }
      }
      const data = toPayload(fields, values, images);
      const saved = record
        ? await pb().collection(collection).update(record.id, data)
        : await pb()
            .collection(collection)
            .create({ ...defaults, ...data });
      clearDraft(draftKey);
      setImages({});
      setValues(initialValues(fields, saved, defaults));
      setMessage({ kind: 'ok', text: 'Guardado. Todavía no está en el sitio:', saved: true });
      onSaved(saved);
    } catch (err) {
      setErrors(fieldErrors(err));
      setMessage({ kind: 'error', text: errorMessage(err) });
    } finally {
      setSaving(false);
    }
  }

  const renderInput = (field: Field, id: string) => {
    const value = values[field.name];
    switch (field.type) {
      case 'textarea':
        return (
          <textarea id={id} rows={field.rows ?? 4} value={value} onChange={(e) => set(field.name, e.target.value)} />
        );
      case 'number':
        return (
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={field.min}
            step={field.integer ? 1 : 'any'}
            value={value}
            onChange={(e) => set(field.name, e.target.value)}
          />
        );
      case 'slug':
        return (
          <div className="slug-input">
            <input
              id={id}
              value={value}
              onChange={(e) => {
                setSlugTouched(true);
                set(field.name, e.target.value);
              }}
            />
            {!wasPublished && slugTouched && nameField && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setSlugTouched(false);
                  set(field.name, slugify(values[nameField] ?? ''));
                }}
              >
                Desde el nombre
              </button>
            )}
          </div>
        );
      case 'image':
        return (
          <ImageField
            id={id}
            currentUrl={record ? fileUrl(record, record[field.name]) : ''}
            change={images[field.name]}
            minWidth={field.minWidth}
            frames={field.frames}
            onChange={(change) => {
              setImages((prev) => ({ ...prev, [field.name]: change }));
              setErrors(({ [field.name]: _, ...rest }) => rest);
              setMessage(null);
            }}
            onError={(text) => setErrors((prev) => ({ ...prev, [field.name]: text }))}
          />
        );
      case 'relation':
        return (
          <RelationField
            id={id}
            collection={field.collection}
            filter={field.filter}
            multiple={field.multiple}
            value={value}
            onChange={(v) => set(field.name, v)}
          />
        );
      case 'custom':
        return <field.Input id={id} value={value} onChange={(v) => set(field.name, v)} />;
      default:
        return (
          <input
            id={id}
            type={field.type === 'text' ? 'text' : field.type}
            value={value}
            onChange={(e) => set(field.name, e.target.value)}
          />
        );
    }
  };

  const counter = (field: Field) => {
    if ((field.type !== 'text' && field.type !== 'textarea') || !field.max) return null;
    const length = String(values[field.name] ?? '').length;
    if (field.type === 'text' && length < field.max * 0.8) return null;
    return (
      <span className={`counter${length > field.max ? ' is-over' : ''}`}>
        {length} / {field.max}
      </span>
    );
  };

  const sections = items.filter(isSection);
  // Visible / oculto va junto a Guardar (se aplica al guardar), no entre los campos.
  const statusField = fields.find((f) => f.type === 'status');

  return (
    <form ref={formRef} className="record-form" onSubmit={save} noValidate>
      {offer && (
        <div className="notice-warn">
          <p>
            Hay cambios de este formulario que no se guardaron ({formatTime(offer.savedAt)}).
            {record && offer.base && offer.base !== record.updated && ' Ojo: esto se guardó de nuevo después.'}
          </p>
          <div className="inline-actions">
            <button
              type="button"
              className="btn"
              onClick={() => {
                setValues({ ...initial, ...pick(fields, offer.values) });
                setOffer(null);
                setMessage({ kind: 'info', text: 'Cambios recuperados: revísalos y guarda. Las imágenes hay que volver a elegirlas.' });
              }}
            >
              Recuperar
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                clearDraft(draftKey);
                setOffer(null);
              }}
            >
              Descartar
            </button>
          </div>
        </div>
      )}
      {sections.length >= 3 && (
        <nav className="form-nav" aria-label="Secciones">
          {sections.map((s, i) => (
            <button
              key={s.section}
              type="button"
              className="btn btn-ghost"
              onClick={() => document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {s.section}
            </button>
          ))}
        </nav>
      )}
      {items.map((item) => {
        if (isSection(item)) {
          const index = sections.indexOf(item);
          return (
            <div key={`section-${index}`} id={`section-${index}`} className="form-section">
              <h2>{item.section}</h2>
              {item.help && <p className="field-help">{item.help}</p>}
            </div>
          );
        }
        const field = item;
        if (field === statusField) return null;
        const id = `f-${field.name}`;
        return (
          <div key={field.name} className={`field field-${field.type}${errors[field.name] ? ' has-error' : ''}`}>
            <label htmlFor={id} className="field-label">
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            {renderInput(field, id)}
            {counter(field)}
            {field.type === 'slug' && values.slug && <p className="field-help">Dirección: …/{values.slug}/</p>}
            {field.help && <p className="field-help">{field.help}</p>}
            {errors[field.name] && <p className="field-error">{errors[field.name]}</p>}
          </div>
        );
      })}
      <div className="form-bar">
        {statusField && (
          <Switch
            checked={values[statusField.name] === 'published'}
            onChange={(on) => set(statusField.name, on ? 'published' : 'draft')}
          >
            {values[statusField.name] === 'published' ? 'Visible en el sitio' : 'Oculto: no sale en el sitio'}
          </Switch>
        )}
        {message && (
          <p className={`notice-${message.kind}`}>
            {message.text}
            {message.saved && (
              <span className="inline-actions">
                <PreviewButton className="btn btn-ghost" />
                <button type="button" className="btn btn-ghost" onClick={confirmPublish}>
                  Publicar
                </button>
              </span>
            )}
          </p>
        )}
        {dirty && !message && <p className="muted">Cambios sin guardar</p>}
        <div className="form-bar-actions">
          {actions}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || (!dirty && !!record)}
            title="Ctrl+S / ⌘S"
          >
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>
    </form>
  );
}
