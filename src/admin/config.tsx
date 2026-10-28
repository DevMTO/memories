// Qué se edita en /admin: secciones del menú y colecciones con sus campos (en el
// orden del formulario). Los nombres de campo son los de pocketbase/pb_migrations/.
// El editor está en kit/admin (ver kit/README.md).
import type { AdminConfig, CustomField, FormItem } from '#kit/admin/config.ts';
import { slugify } from '#kit/admin/components/RecordEditor.tsx';
import { translationsScreen } from '#kit/admin/i18n/index.tsx';
import { itineraryField } from '#src/admin/fields/ItineraryEditor.tsx';
import { IMAGE_WIDTH } from '#src/lib/image-sizes.ts';

const LONG_TEXT_HELP = 'Texto sin formato. Separa los párrafos con una línea en blanco.';
const LINES_HELP = 'Uno por línea.';

// Destinos que recorre un paquete ({ name, slug }): se escriben por nombre, uno
// por línea; la URL sale del nombre.
type Stop = { name: string; slug: string };
const stopsField = {
  name: 'destinations',
  label: 'Destinos que recorre',
  help: 'Uno por línea, en el orden del viaje. Se muestran en la tarjeta y la ficha del paquete.',
  type: 'custom',
  initial: (value) => (Array.isArray(value) ? (value as Stop[]).map((stop) => stop.name).join('\n') : ''),
  clean: (text) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((name) => ({ name, slug: slugify(name) })),
  isEmpty: (text) => !text.trim(),
  Input: ({ id, value, onChange }) => <textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} />,
} satisfies CustomField<string> & { name: string; label: string; help: string };

const productFields = (kind: 'tour' | 'trekking' | 'package'): FormItem[] => [
  { section: 'Datos' },
  { name: 'title', label: 'Nombre', type: 'text', max: 300, required: true },
  { name: 'slug', label: 'URL', type: 'slug', required: true },
  { name: 'status', label: 'Estado', type: 'status' },
  ...(kind === 'package'
    ? []
    : [{ name: 'is_featured', label: 'Destacado en el inicio', type: 'bool' } satisfies FormItem]),
  { name: 'price', label: 'Precio desde (USD)', type: 'number', min: 0, help: 'Vacío = "A medida".' },
  { name: 'duration_days', label: 'Duración (días)', type: 'number', min: 1, integer: true },
  { name: 'duration_nights', label: 'Noches', type: 'number', min: 0, integer: true },
  { section: 'Destino' },
  { name: 'destination_name', label: 'Destino principal', type: 'text', max: 200 },
  {
    name: 'destination_slug',
    label: 'Destino principal (URL)',
    type: 'text',
    max: 100,
    help: 'Como en la página del destino (p. ej. "cusco"): ahí aparece este viaje.',
  },
  { name: 'location', label: 'Lugar', type: 'text', max: 300, help: 'Si no hay destino principal, se muestra esto.' },
  { name: 'cities', label: 'Ciudades', type: 'lines', help: LINES_HELP },
  ...(kind === 'package' ? [stopsField] : []),
  { section: 'Textos' },
  { name: 'short_description', label: 'Resumen', type: 'textarea', max: 1000, rows: 3 },
  { name: 'description', label: 'Descripción', type: 'textarea', max: 20000, rows: 10, help: LONG_TEXT_HELP },
  { section: 'Listas' },
  { name: 'features', label: 'Características', type: 'lines', help: `${LINES_HELP} La primera se muestra como "Servicio".` },
  { name: 'highlights', label: 'Lo más destacado', type: 'lines', help: LINES_HELP },
  { name: 'includes', label: 'Incluye', type: 'lines', rows: 6, help: LINES_HELP },
  { name: 'not_includes', label: 'No incluye', type: 'lines', rows: 6, help: LINES_HELP },
  { name: 'what_to_bring', label: 'Qué llevar', type: 'lines', help: LINES_HELP },
  { name: 'important_notes', label: 'Notas importantes', type: 'lines', help: LINES_HELP },
  { section: 'Imágenes' },
  {
    name: 'cover',
    label: 'Portada',
    type: 'image',
    minWidth: IMAGE_WIDTH,
    frames: [
      { label: 'Cabecera', ratio: 2.4, overlay: 'hero' },
      { label: 'Tarjeta', ratio: 1.3 },
    ],
  },
  { name: 'gallery', label: 'Galería', type: 'images', minWidth: IMAGE_WIDTH, max: 30 },
  { section: 'Itinerario' },
  itineraryField('itinerary', 'Días'),
  { section: 'Buscadores', help: 'Vacíos = el nombre y el resumen.' },
  { name: 'seo_title', label: 'Título', type: 'text', max: 300 },
  { name: 'seo_description', label: 'Descripción', type: 'textarea', max: 1000, rows: 3 },
];

const products = (key: string, kind: 'tour' | 'trekking' | 'package', title: string, singular: string) =>
  ({
    kind: 'collection',
    key,
    collection: 'products',
    title,
    singular,
    filter: `kind = "${kind}"`,
    defaults: { kind, status: 'draft' },
    label: (r) => r.title,
    thumb: ['cover'],
    sortable: true,
    sitePath: (r) => `/${kind === 'package' ? 'packages' : 'tours'}/${r.slug}/`,
    fields: productFields(kind),
  }) satisfies AdminConfig['sections'][number];

export const adminConfig = (langs: string[], defaultLang: string): AdminConfig => ({
  brand: 'Memories Travel Perú',
  translations: true,
  sections: [
    products('tours', 'tour', 'Tours', 'tour'),
    products('trekkings', 'trekking', 'Trekkings', 'trekking'),
    products('paquetes', 'package', 'Paquetes', 'paquete'),
    {
      kind: 'collection',
      key: 'destinos',
      collection: 'destinations',
      title: 'Destinos',
      singular: 'destino',
      defaults: { status: 'draft' },
      label: (r) => r.name,
      thumb: ['image'],
      sortable: true,
      sitePath: (r) => `/destinations/${r.slug}/`,
      fields: [
        { name: 'name', label: 'Nombre', type: 'text', max: 200, required: true },
        { name: 'slug', label: 'URL', type: 'slug', required: true },
        { name: 'status', label: 'Estado', type: 'status' },
        { name: 'eyebrow', label: 'Antetítulo', type: 'text', max: 200 },
        { name: 'title', label: 'Título', type: 'text', max: 300 },
        { name: 'description', label: 'Descripción', type: 'textarea', max: 5000, rows: 5 },
        { name: 'altitude', label: 'Altitud', type: 'text', max: 100, help: 'Vacío = "Variable".' },
        { name: 'climate', label: 'Clima', type: 'text', max: 100, help: 'Vacío = "Según temporada".' },
        { name: 'best_season', label: 'Mejor temporada', type: 'text', max: 100, help: 'Vacío = "Todo el año".' },
        {
          name: 'image',
          label: 'Imagen',
          type: 'image',
          minWidth: IMAGE_WIDTH,
          frames: [{ label: 'Cabecera', ratio: 2.4, overlay: 'hero' }],
        },
      ],
    },
    {
      kind: 'single',
      key: 'contacto',
      collection: 'settings',
      title: 'Datos de contacto',
      fields: [
        {
          name: 'whatsapp',
          label: 'WhatsApp',
          type: 'text',
          max: 50,
          help: 'Con código de país, como se muestra (p. ej. "+51 954 669 589"). Recibe las solicitudes de viaje.',
        },
        { name: 'emergency_phone', label: 'Teléfono de emergencias', type: 'text', max: 50 },
        { name: 'email', label: 'Correo', type: 'email' },
        { name: 'address', label: 'Dirección', type: 'textarea', max: 500, rows: 2 },
      ],
    },
    translationsScreen(langs, { defaultLang }),
  ],
});
