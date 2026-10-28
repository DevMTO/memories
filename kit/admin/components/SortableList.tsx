// Lista reordenable: arrastrar (escritorio) o flechas (celular y teclado).
import { useState, type ReactNode } from 'react';

type Props<T> = {
  items: T[];
  getKey: (item: T) => string;
  onReorder: (items: T[]) => void;
  render: (item: T, index: number) => ReactNode;
  disabled?: boolean;
};

export function move<T>(items: T[], from: number, to: number) {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function SortableList<T>({ items, getKey, onReorder, render, disabled }: Props<T>) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  // Solo se arrastra desde el asa: así se puede seleccionar texto en los campos.
  const [armed, setArmed] = useState<number | null>(null);
  const reset = () => {
    setDragging(null);
    setOver(null);
    setArmed(null);
  };

  return (
    <ul className="sortable">
      {items.map((item, index) => (
        <li
          key={getKey(item)}
          className={[dragging === index && 'is-dragging', over === index && dragging !== index && 'is-over']
            .filter(Boolean)
            .join(' ')}
          draggable={!disabled && armed === index}
          onDragStart={(e) => {
            setDragging(index);
            e.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(e) => {
            if (dragging === null) return;
            e.preventDefault();
            setOver(index);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragging !== null && dragging !== index) onReorder(move(items, dragging, index));
            reset();
          }}
          onDragEnd={reset}
        >
          {!disabled && (
            <span
              className="sortable-handle"
              aria-hidden="true"
              title="Arrastrar para ordenar"
              onPointerDown={() => setArmed(index)}
              onPointerUp={() => dragging === null && setArmed(null)}
            >
              ⋮⋮
            </span>
          )}
          <div className="sortable-body">{render(item, index)}</div>
          {!disabled && (
            <span className="sortable-arrows">
              <button
                type="button"
                className="icon-btn"
                aria-label="Subir"
                disabled={index === 0}
                onClick={() => onReorder(move(items, index, index - 1))}
              >
                ▲
              </button>
              <button
                type="button"
                className="icon-btn"
                aria-label="Bajar"
                disabled={index === items.length - 1}
                onClick={() => onReorder(move(items, index, index + 1))}
              >
                ▼
              </button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
