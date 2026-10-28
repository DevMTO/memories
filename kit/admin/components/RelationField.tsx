// Elegir registros de otra colección, buscando por nombre; con `multiple`, en
// orden (arrastrar). Nombres y orden salen de la configuración de esa colección.
import { useEffect, useState } from 'react';
import { collectionDefs, labelOf } from '../config';
import { errorMessage, pb, type RecordModel } from '../lib/pocketbase';
import { SortableList } from './SortableList';

type Props = {
  id: string;
  collection: string;
  filter?: string;
  multiple?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

function useOptions(collection: string, filter?: string) {
  const [options, setOptions] = useState<RecordModel[] | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    const sortable = collectionDefs().some((d) => d.collection === collection && d.sortable);
    pb()
      .collection(collection)
      .getFullList({ filter, sort: sortable ? 'sort_order,created' : '-created' })
      .then(setOptions, (err) => setError(errorMessage(err)));
  }, [collection, filter]);
  return { options, error };
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

type Option = { id: string; label: string };

function Picker({ id, options, placeholder, onPick }: { id: string; options: Option[]; placeholder: string; onPick: (id: string) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = options.filter((o) => normalize(o.label).includes(normalize(query.trim())));

  const pick = (option: Option | undefined) => {
    if (!option) return;
    onPick(option.id);
    setQuery('');
    setActive(0);
  };

  return (
    <div className="picker">
      <input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder={placeholder}
        value={query}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') setActive((i) => Math.min(i + 1, matches.length - 1));
          else if (e.key === 'ArrowUp') setActive((i) => Math.max(i - 1, 0));
          else if (e.key === 'Enter') pick(matches[active]);
          else if (e.key === 'Escape') setOpen(false);
          else return;
          e.preventDefault();
          setOpen(true);
        }}
      />
      {open && (
        <ul className="picker-list" role="listbox">
          {matches.length === 0 && <li className="muted">Sin resultados</li>}
          {matches.map((o, i) => (
            <li
              key={o.id}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              // mousedown: antes de que el input pierda el foco y cierre la lista.
              onMouseDown={(e) => {
                e.preventDefault();
                pick(o);
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RelationField({ id, collection, filter, multiple, value, onChange }: Props) {
  const { options, error } = useOptions(collection, filter);
  if (error) return <p className="field-error">{error}</p>;
  if (!options) return <p className="muted">Cargando…</p>;

  const byId = new Map(options.map((r) => [r.id, r]));
  const label = (r: RecordModel) => labelOf(collection, r) + (r.status === 'draft' ? ' (oculto)' : '');
  const toOption = (r: RecordModel) => ({ id: r.id, label: label(r) });

  if (!multiple) {
    const selected = byId.get(value as string);
    return (
      <div className="relation-single">
        <div className="relation-item">
          {selected ? label(selected) : <span className="muted">— Ninguno —</span>}
          {selected && (
            <button type="button" className="icon-btn" aria-label="Quitar" onClick={() => onChange('')}>
              ✕
            </button>
          )}
        </div>
        <Picker
          id={id}
          options={options.filter((r) => r.id !== value).map(toOption)}
          placeholder={selected ? 'Buscar para cambiar…' : 'Buscar para elegir…'}
          onPick={onChange}
        />
        {selected?.status === 'draft' && <p className="field-help">Está oculto: no se muestra en el sitio.</p>}
      </div>
    );
  }

  const selected = ((value as string[]) ?? []).filter((v) => byId.has(v));
  const available = options.filter((r) => !selected.includes(r.id));
  const hidden = selected.filter((v) => byId.get(v)?.status === 'draft').length;

  return (
    <div className="relation-multi">
      {selected.length > 0 ? (
        <SortableList
          items={selected}
          getKey={(v) => v}
          onReorder={onChange}
          render={(v) => (
            <span className="relation-item">
              {label(byId.get(v)!)}
              <button
                type="button"
                className="icon-btn"
                aria-label="Quitar"
                onClick={() => onChange(selected.filter((x) => x !== v))}
              >
                ✕
              </button>
            </span>
          )}
        />
      ) : (
        <p className="muted">Nada elegido.</p>
      )}
      {hidden > 0 && <p className="field-help">Los ocultos no se muestran en el sitio hasta hacerlos visibles.</p>}
      {available.length > 0 && (
        <Picker
          id={id}
          options={available.map(toOption)}
          placeholder="+ Agregar (buscar)…"
          onPick={(picked) => onChange([...selected, picked])}
        />
      )}
    </div>
  );
}
