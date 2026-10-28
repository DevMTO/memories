// Imagen con vista previa. El build la optimiza, así que el peso solo importa
// por el límite de PocketBase (5 MB); el ancho sí: más chica que `minWidth` se
// ve borrosa.
import { useEffect, useMemo, useState } from 'react';
import type { Frame } from '../config';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 5 * 1024 * 1024;

// `undefined` = sin cambios, `File` = nueva, `null` = quitar la actual.
export type ImageChange = File | null | undefined;

type Props = {
  id: string;
  currentUrl: string;
  change: ImageChange;
  minWidth?: number;
  frames?: Frame[];
  onChange: (change: ImageChange) => void;
  onError: (message: string) => void;
};

export function ImageField({ id, currentUrl, change, minWidth, frames, onChange, onError }: Props) {
  const previewUrl = useMemo(() => (change instanceof File ? URL.createObjectURL(change) : ''), [change]);
  useEffect(() => {
    if (previewUrl) return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);
  const [size, setSize] = useState<[number, number] | null>(null);

  const shown = change === null ? '' : previewUrl || currentUrl;
  useEffect(() => setSize(null), [shown]);
  const small = !!(minWidth && size && size[0] < minWidth);

  return (
    <div className="image-field-wrap">
      <div className="image-field">
        {shown ? (
          <img
            src={shown}
            alt=""
            onLoad={(e) => setSize([e.currentTarget.naturalWidth, e.currentTarget.naturalHeight])}
          />
        ) : (
          <div className="image-empty">Sin imagen</div>
        )}
        <div className="image-actions">
          <label className="btn" htmlFor={id}>
            {shown ? 'Cambiar' : 'Subir imagen'}
          </label>
          <input
            id={id}
            type="file"
            accept={TYPES.join(',')}
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              if (!TYPES.includes(file.type)) return onError('Solo JPG, PNG o WebP.');
              if (file.size > MAX_BYTES) return onError('La imagen pesa más de 5 MB.');
              onChange(file);
            }}
          />
          {shown && (
            <button type="button" className="btn btn-ghost" onClick={() => onChange(currentUrl ? null : undefined)}>
              Quitar
            </button>
          )}
          {change !== undefined && currentUrl && (
            <button type="button" className="btn btn-ghost" onClick={() => onChange(undefined)}>
              Deshacer
            </button>
          )}
          {size && <span className="muted">{size[0]} × {size[1]} px</span>}
        </div>
      </div>
      {shown && frames && frames.length > 0 && (
        <div className="frames" aria-label="Cómo se recorta en el sitio">
          {frames.map((frame) => (
            <figure key={frame.label} className="frame">
              <div
                className={`frame-box${frame.round ? ' is-round' : ''}`}
                style={{ aspectRatio: String(frame.ratio) }}
              >
                <img src={shown} alt="" />
                {frame.overlay === 'hero' && (
                  <div className="frame-hero" aria-hidden="true">
                    <span />
                    <span />
                  </div>
                )}
              </div>
              <figcaption>{frame.label}</figcaption>
            </figure>
          ))}
        </div>
      )}
      {small ? (
        <p className="field-warn">
          Mide {size![0]} px de ancho y se mostrará hasta {minWidth} px: se verá borrosa. Mejor una de al menos {minWidth}{' '}
          px.
        </p>
      ) : (
        minWidth && <p className="field-help">Recomendado: al menos {minWidth} px de ancho. JPG, PNG o WebP, hasta 5 MB.</p>
      )}
    </div>
  );
}
