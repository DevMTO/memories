// Varias imágenes en orden (galerías): se agregan, se quitan y se reordenan. Las
// nuevas se suben al guardar, en el lugar donde quedaron en la lista.
import { useEffect, useMemo } from 'react';
import { IMAGE_TYPES, imageProblem } from './ImageField';
import { SortableList } from './SortableList';

// Una imagen ya guardada (nombre del archivo en PocketBase) o una elegida ahora.
export type GalleryItem = { name: string } | { key: string; file: File };

let nextKey = 0;
export const newGalleryItem = (file: File): GalleryItem => ({ key: `new-${nextKey++}`, file });
const keyOf = (item: GalleryItem) => ('name' in item ? item.name : item.key);

type Props = {
  id: string;
  value: GalleryItem[];
  urlOf: (name: string) => string;
  max?: number;
  minWidth?: number;
  onChange: (items: GalleryItem[]) => void;
  onError: (message: string) => void;
};

function Thumb({ item, urlOf }: { item: GalleryItem; urlOf: (name: string) => string }) {
  const local = useMemo(() => ('file' in item ? URL.createObjectURL(item.file) : ''), [item]);
  useEffect(() => {
    if (local) return () => URL.revokeObjectURL(local);
  }, [local]);
  return <img src={local || urlOf((item as { name: string }).name)} alt="" loading="lazy" />;
}

export function GalleryField({ id, value, urlOf, max, minWidth, onChange, onError }: Props) {
  const items = value ?? [];
  const full = !!max && items.length >= max;

  return (
    <div className="gallery-field">
      {items.length === 0 && <p className="muted">Sin imágenes.</p>}
      <SortableList
        items={items}
        getKey={keyOf}
        onReorder={onChange}
        render={(item, index) => (
          <div className="gallery-item">
            <Thumb item={item} urlOf={urlOf} />
            <span className="muted">
              {index + 1}
              {'file' in item && ' · nueva'}
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-danger"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Quitar
            </button>
          </div>
        )}
      />
      <div className="image-actions">
        <label className={`btn${full ? ' is-disabled' : ''}`} htmlFor={id}>
          + Agregar imágenes
        </label>
        <input
          id={id}
          type="file"
          accept={IMAGE_TYPES.join(',')}
          multiple
          hidden
          disabled={full}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = '';
            const problems = files.map(imageProblem).filter(Boolean);
            let accepted = files.filter((file) => !imageProblem(file));
            if (max && items.length + accepted.length > max) {
              accepted = accepted.slice(0, max - items.length);
              problems.push(`Caben hasta ${max} imágenes.`);
            }
            if (accepted.length) onChange([...items, ...accepted.map(newGalleryItem)]);
            if (problems.length) onError(problems.join(' '));
          }}
        />
      </div>
      <p className="field-help">
        {minWidth ? `Recomendado: al menos ${minWidth} px de ancho. ` : ''}JPG, PNG o WebP, hasta 5 MB cada una.
      </p>
    </div>
  );
}

// Lo que se manda a PocketBase: las guardadas que quedan, en orden (las que no
// están se borran), y las nuevas, que PocketBase agrega al final.
export function galleryPayload(name: string, items: GalleryItem[]) {
  const files = items.flatMap((item) => ('file' in item ? [item.file] : []));
  return {
    [name]: items.flatMap((item) => ('name' in item ? [item.name] : [])),
    ...(files.length ? { [`${name}+`]: files } : {}),
  };
}

// Orden final con los nombres que PocketBase dio a las nuevas (`saved`: el
// campo tal como quedó). Si coincide con `saved` no hace falta otro guardado.
export function galleryOrder(items: GalleryItem[], saved: string[]) {
  const kept = items.filter((item) => 'name' in item).length;
  const added = saved.slice(kept);
  let next = 0;
  return items.map((item) => ('name' in item ? item.name : added[next++]));
}
