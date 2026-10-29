// Contrato entre el núcleo de /admin (src/admin/core/, igual en todos los
// proyectos) y la configuración de cada proyecto (src/admin/config.tsx). Ver
// kit/README.md.
import type { ComponentType, ReactNode } from 'react';
import type { RecordModel } from './lib/pocketbase';

type Base = { name: string; label: string; help?: string; required?: boolean };

// Campo propio de un proyecto (p. ej. el itinerario): el núcleo solo lo guarda y
// lo valida con estas funciones.
export type CustomField<T = any> = {
  type: 'custom';
  // Valor del formulario a partir del registro (o de los valores por defecto).
  initial: (value: unknown) => T;
  // Valor que se manda a PocketBase al guardar.
  clean?: (value: T) => unknown;
  // Mensaje de error, o nada si es válido. `required` ya lo revisa el núcleo con `isEmpty`.
  validate?: (value: T) => string | undefined;
  isEmpty?: (value: T) => boolean;
  Input: ComponentType<{ id: string; value: T; onChange: (value: T) => void }>;
};

export type Field = Base &
  (
    | { type: 'text' | 'email' | 'url'; max?: number }
    | { type: 'textarea'; max?: number; rows?: number }
    // Lista de textos cortos (JSON con un arreglo de strings): uno por línea.
    | { type: 'lines'; rows?: number }
    | { type: 'number'; min?: number; integer?: boolean }
    | { type: 'slug' }
    | { type: 'status' }
    // Sí / no (campo bool de PocketBase).
    | { type: 'bool' }
    // minWidth: ancho mínimo recomendado en px (avisa, sin impedir, si es más chica).
    // frames: cómo se recorta en cada lugar del sitio donde aparece.
    | { type: 'image'; minWidth?: number; frames?: Frame[] }
    // Varias imágenes en orden (campo de archivos con maxSelect > 1).
    | { type: 'images'; minWidth?: number; max?: number }
    | { type: 'relation'; collection: string; filter?: string; multiple?: boolean }
    | CustomField
  );

// Un lugar del sitio donde se muestra una imagen: proporción del recuadro
// (ancho / alto) y cómo se ve encima (texto sobre degradado oscuro, círculo).
export type Frame = { label: string; ratio: number; overlay?: 'hero'; round?: boolean };

// Título que separa grupos de campos en formularios largos.
export type Section = { section: string; help?: string };
export type FormItem = Field | Section;

export const isSection = (item: FormItem): item is Section => 'section' in item;
export const fieldsOf = (items: FormItem[]) => items.filter((item): item is Field => !isSection(item));
// Campos de archivos: no entran en las copias locales ni en el historial.
export const isFileField = (field: Field) => field.type === 'image' || field.type === 'images';

// Dónde puede estar elegido un registro (aviso al borrar).
export type UsedIn = { collection: string; fields: string[]; label: string };

// Colección con lista + ficha.
export type CollectionDef = {
  kind: 'collection';
  key: string; // segmento de la URL de /admin
  collection: string; // colección de PocketBase
  title: string;
  singular: string;
  filter?: string; // varias secciones pueden compartir una colección
  defaults?: Record<string, unknown>; // al crear (y para reconocer los borrados de esta sección)
  label: (record: RecordModel) => string;
  thumb?: string[]; // campos de imagen para la lista (el primero que tenga)
  sortable: boolean; // tiene sort_order
  sitePath?: (record: RecordModel) => string; // página pública, para enlazar
  usedIn?: UsedIn[];
  // Valores de la copia al duplicar. Por defecto: primer campo de texto + " (copia)",
  // URL + "-copia" y oculto.
  duplicate?: (record: RecordModel) => Record<string, unknown>;
  fields: FormItem[];
};

// Colección de un solo registro (lo crea una migración; aquí solo se edita).
export type SingleDef = {
  kind: 'single';
  key: string;
  collection: string;
  title: string;
  intro?: ReactNode;
  fields: FormItem[];
};

// Pantalla propia del proyecto (p. ej. traducciones).
export type ScreenDef = {
  kind: 'screen';
  key: string;
  title: string;
  Screen: ComponentType<{ route: string[] }>;
  // Número junto al nombre en el menú (p. ej. pendientes).
  useBadge?: () => number;
  // Colección que el build lee y que esta pantalla edita (para "cambios sin publicar").
  content?: { collection: string; label: string };
};

export type SectionDef = CollectionDef | SingleDef | ScreenDef;

export type AdminConfig = {
  brand: string;
  // En el orden del menú. "Inicio" (tablero) va siempre primero.
  sections: SectionDef[];
  // Formato de fechas (por defecto 'es-PE').
  locale?: string;
  // Enlace "Ver sitio" (por defecto '/', el mismo origen que /admin).
  siteUrl?: string;
  // El sitio usa el traductor del kit (kit/i18n): la vista previa ofrece
  // "Traducir textos nuevos".
  translations?: boolean;
};

let current: AdminConfig | undefined;

export function setConfig(config: AdminConfig) {
  current = config;
}

export function config(): AdminConfig {
  if (!current) throw new Error('/admin sin configurar.');
  return current;
}

export const collectionDefs = () => config().sections.filter((s): s is CollectionDef => s.kind === 'collection');

// Nombre visible de un registro de cualquier colección (relaciones, historial).
export function labelOf(collection: string, record: RecordModel): string {
  const def = collectionDefs().find((d) => d.collection === collection);
  return (def ? def.label(record) : record.name || record.title) || record.id;
}

// Lo que el build lee, con el nombre que ve el editor: para "cambios sin publicar".
export type ContentDef = { collection: string; filter?: string; label: string; href: string };

export function contentDefs(): ContentDef[] {
  return config().sections.flatMap((s): ContentDef[] => {
    if (s.kind === 'collection') return [{ collection: s.collection, filter: s.filter, label: s.title, href: `#/${s.key}` }];
    if (s.kind === 'single') return [{ collection: s.collection, label: s.title, href: `#/${s.key}` }];
    return s.content ? [{ ...s.content, href: `#/${s.key}` }] : [];
  });
}
