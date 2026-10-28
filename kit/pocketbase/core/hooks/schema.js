/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Piezas para las migraciones del proyecto, con las convenciones que /admin y el
// build dan por hechas (ver "Contrato de esquema" en kit/README.md). No es un hook
// (*.pb.js): se carga desde una migración con
//
//   const { text, image, images, status, sortOrder, timestamps, catalogRules } = require(`${__hooks}/schema.js`);

// El editor de /admin: único usuario de la colección `editors`.
const EDITOR = '@request.auth.collectionName = "editors"';

// Lectura pública: solo lo visible; el editor ve todo.
const PUBLISHED = `status = "published" || ${EDITOR}`;

const SLUG = '^[a-z0-9]+(?:-[a-z0-9]+)*$';

const IMAGE = {
  type: 'file',
  maxSelect: 1,
  maxSize: 5 * 1024 * 1024,
  mimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

const image = (name, required) => Object.assign({ name, required: !!required }, IMAGE);

// Varias imágenes en orden (galería).
const images = (name, max) => Object.assign({}, IMAGE, { name, maxSelect: max || 30 });

const text = (name, max, required) => ({ name, type: 'text', max: max || 0, required: !!required });

// URL de la ficha en el sitio: única, en minúsculas y con guiones.
const slug = () => ({ name: 'slug', type: 'text', max: 100, required: true, pattern: SLUG });

// Visible (published) u oculto (draft) en el sitio: el interruptor de /admin.
const status = () => ({ name: 'status', type: 'select', values: ['draft', 'published'], maxSelect: 1, required: true });

// Orden arrastrable de las listas de /admin (`sortable` en AdminConfig).
const sortOrder = () => ({ name: 'sort_order', type: 'number', onlyInt: true });

// `updated` es lo que usa /admin para saber qué falta publicar.
const timestamps = () => [
  { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
  { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
];

// Contenido que el build lee sin sesión: visitantes ven lo publicado, el editor todo.
const catalogRules = {
  listRule: PUBLISHED,
  viewRule: PUBLISHED,
  createRule: EDITOR,
  updateRule: EDITOR,
  deleteRule: EDITOR,
};

module.exports = { EDITOR, PUBLISHED, SLUG, image, images, text, slug, status, sortOrder, timestamps, catalogRules };
