// Navegación por hash (#/tours/<id>): /admin es una sola página
// estática, así que no hacen falta rutas en el servidor.
import { useEffect, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();
const read = () => location.hash.replace(/^#\/?/, '');
let current = typeof location === 'undefined' ? '' : read();

// Si hay cambios sin guardar, preguntar antes de salir de la ficha. Cuenta los
// formularios con cambios (una pantalla puede tener varios).
const UNSAVED_MESSAGE = 'Hay cambios sin guardar. ¿Salir de todos modos?';
let unsaved = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const next = read();
    if (next === current) return;
    if (unsaved > 0 && !confirm(UNSAVED_MESSAGE)) {
      history.replaceState(null, '', `#/${current}`);
      return;
    }
    current = next;
    listeners.forEach((listener) => listener());
  });
  window.addEventListener('beforeunload', (e) => {
    if (unsaved > 0) e.preventDefault();
  });
}

export function useRoute(): string[] {
  const path = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => current,
  );
  return path.split('/').filter(Boolean).map(decodeURIComponent);
}

export function navigate(path: string) {
  location.hash = `#/${path.replace(/^\//, '')}`;
}

// Cambia la URL sin agregar historial ni preguntar (p. ej. "nuevo" → id al crear).
export function replaceRoute(path: string) {
  current = path.replace(/^\//, '');
  history.replaceState(null, '', `#/${current}`);
  listeners.forEach((listener) => listener());
}

export const hasUnsaved = () => unsaved > 0;

// Mientras `dirty` sea true, salir de la pantalla (o cerrar la pestaña) pide confirmación.
export function useUnsavedGuard(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    unsaved++;
    return () => {
      unsaved--;
    };
  }, [dirty]);
}
