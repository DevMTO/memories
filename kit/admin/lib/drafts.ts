// Copia en el navegador de un formulario sin guardar, por si se cierra la
// pestaña, se cuelga el navegador o se apaga el equipo. Las imágenes elegidas no
// entran (no caben en localStorage): esas hay que volver a elegirlas.
const PREFIX = 'admin:draft:';

export type Draft = {
  values: Record<string, unknown>;
  savedAt: number;
  // `updated` del registro cuando se empezó a editar: si cambió, el borrador es viejo.
  base?: string;
};

export function loadDraft(key: string): Draft | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDraft(key: string, values: Record<string, unknown>, base?: string) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ values, savedAt: Date.now(), base } satisfies Draft));
  } catch {
    // Sin espacio o sin localStorage: queda el aviso al salir.
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {}
}
