// Itinerario de tours y paquetes: días que se agregan, quitan, reordenan y se
// pliegan. El número de día sale del orden.
import { useState } from 'react';
import type { CustomField } from '#kit/admin/config.ts';
import { SortableList } from '#kit/admin/components/SortableList.tsx';

// Un día tal como lo guarda `products.itinerary` (ver src/lib/types.ts).
type Day = {
  day: number;
  title: string;
  description?: string;
  accommodations?: string;
  meals: string[];
  includes: string[];
  notIncludes: string[];
};

type ListKey = 'meals' | 'includes' | 'notIncludes';

// Las listas se escriben un ítem por línea.
const toLines = (items: string[] | undefined) => (items ?? []).join('\n');
const fromLines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

// Mientras se escribe se guardan las líneas tal cual (incluida la vacía del
// final); se limpian al guardar con `cleanItinerary`.
const rawLines = (text: string) => text.split('\n');

export function cleanItinerary(days: Day[]): Day[] {
  return days.map((day, index) => ({
    day: index + 1,
    title: day.title.trim(),
    ...(day.description?.trim() ? { description: day.description.trim() } : {}),
    ...(day.accommodations?.trim() ? { accommodations: day.accommodations.trim() } : {}),
    meals: fromLines(toLines(day.meals)),
    includes: fromLines(toLines(day.includes)),
    notIncludes: fromLines(toLines(day.notIncludes)),
  }));
}

// Clave estable para React mientras se reordena (los días no tienen id).
const keys = new WeakMap<Day, string>();
let nextKey = 0;
const keyOf = (day: Day) => {
  if (!keys.has(day)) keys.set(day, `day-${nextKey++}`);
  return keys.get(day)!;
};

const LISTS: { key: ListKey; label: string }[] = [
  { key: 'meals', label: 'Comidas' },
  { key: 'includes', label: 'Incluye' },
  { key: 'notIncludes', label: 'No incluye' },
];

function ItineraryEditor({ value, onChange }: { id: string; value: Day[]; onChange: (days: Day[]) => void }) {
  const days = value ?? [];
  // Con muchos días se abren plegados: el título basta para ubicarse.
  const [closed, setClosed] = useState<Set<string>>(() => new Set(days.length > 3 ? days.map(keyOf) : []));
  const toggle = (key: string, open: boolean) =>
    setClosed((prev) => {
      const next = new Set(prev);
      if (open) next.delete(key);
      else next.add(key);
      return next;
    });

  const renumber = (next: Day[]) =>
    onChange(
      next.map((d, i) => {
        if (d.day === i + 1) return d;
        const day = { ...d, day: i + 1 };
        keys.set(day, keyOf(d));
        return day;
      }),
    );
  const update = (index: number, patch: Partial<Day>) => {
    const next = [...days];
    next[index] = { ...next[index], ...patch };
    keys.set(next[index], keyOf(days[index]));
    onChange(next);
  };

  return (
    <div className="itinerary">
      {days.length === 0 && <p className="muted">Sin días.</p>}
      {days.length > 1 && (
        <p className="inline-actions">
          <button type="button" className="btn btn-ghost" onClick={() => setClosed(new Set())}>
            Abrir todos
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setClosed(new Set(days.map(keyOf)))}>
            Plegar todos
          </button>
        </p>
      )}
      <SortableList
        items={days}
        getKey={keyOf}
        onReorder={renumber}
        render={(day, index) => (
          <details
            className="itinerary-day"
            open={!closed.has(keyOf(day))}
            onToggle={(e) => toggle(keyOf(day), e.currentTarget.open)}
          >
            <summary>
              Día {index + 1}
              {day.title ? `: ${day.title}` : ''}
            </summary>
            <label>
              Título
              <input value={day.title} onChange={(e) => update(index, { title: e.target.value })} required />
            </label>
            <label>
              Descripción
              <textarea
                rows={5}
                value={day.description ?? ''}
                onChange={(e) => update(index, { description: e.target.value })}
              />
            </label>
            <label>
              Alojamiento
              <input
                value={day.accommodations ?? ''}
                onChange={(e) => update(index, { accommodations: e.target.value })}
              />
            </label>
            <div className="itinerary-lists">
              {LISTS.map(({ key, label }) => (
                <label key={key}>
                  {label} <span className="muted">(uno por línea)</span>
                  <textarea
                    rows={4}
                    value={toLines(day[key])}
                    onChange={(e) => update(index, { [key]: rawLines(e.target.value) })}
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-danger"
              onClick={() => confirm(`¿Quitar el día ${index + 1}?`) && renumber(days.filter((_, i) => i !== index))}
            >
              Quitar día
            </button>
          </details>
        )}
      />
      <button
        type="button"
        className="btn"
        onClick={() =>
          onChange([...days, { day: days.length + 1, title: '', meals: [], includes: [], notIncludes: [] }])
        }
      >
        + Agregar día
      </button>
    </div>
  );
}

export const itineraryField = (name: string, label: string) =>
  ({
    name,
    label,
    type: 'custom',
    initial: (value) => (Array.isArray(value) ? (value as Day[]) : []),
    clean: cleanItinerary,
    isEmpty: (days) => days.length === 0,
    validate: (days) => {
      if (cleanItinerary(days).some((day) => !day.title)) return 'Cada día necesita un título.';
    },
    Input: ItineraryEditor,
  }) satisfies CustomField<Day[]> & { name: string; label: string };
