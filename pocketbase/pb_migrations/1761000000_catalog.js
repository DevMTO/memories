/// <reference path="../pb_data/types.d.ts" />
// Catálogo de Memories: tours, trekkings y paquetes (`products`, con `kind`), las
// páginas de destino y los datos de contacto del sitio (`settings`, un solo
// registro). Visitantes y build ven solo lo publicado; el editor ve y edita todo.

migrate((app) => {
  const { EDITOR, text, image, images, slug, status, sortOrder, timestamps, catalogRules } = require(`${__hooks}/schema.js`);
  const json = (name) => ({ name, type: 'json', maxSize: 2 * 1024 * 1024 });
  const number = (name) => ({ name, type: 'number', onlyInt: true, min: 0 });

  app.save(new Collection(Object.assign({
    type: 'base',
    name: 'destinations',
    fields: [
      slug(),
      text('name', 200, true),
      status(),
      sortOrder(),
      text('eyebrow', 200),
      text('title', 300),
      text('description', 5000),
      text('altitude', 100),
      text('climate', 100),
      text('best_season', 100),
      image('image'),
      ...timestamps(),
    ],
    indexes: ['CREATE UNIQUE INDEX idx_destinations_slug ON destinations (slug)'],
  }, catalogRules)));

  app.save(new Collection(Object.assign({
    type: 'base',
    name: 'products',
    fields: [
      { name: 'kind', type: 'select', values: ['tour', 'trekking', 'package'], maxSelect: 1, required: true },
      text('title', 300, true),
      slug(),
      status(),
      sortOrder(),
      { name: 'is_featured', type: 'bool' },
      text('short_description', 1000),
      text('description', 20000),
      { name: 'price', type: 'number', min: 0 },
      number('duration_days'),
      number('duration_nights'),
      // Destino principal y, en los paquetes, todos los que recorre ({ name, slug }).
      text('destination_name', 200),
      text('destination_slug', 100),
      text('location', 300),
      json('cities'),
      json('destinations'),
      image('cover'),
      images('gallery'),
      json('features'),
      json('highlights'),
      // Días: { day, title, description, accommodations?, meals[], includes[], notIncludes[] }.
      json('itinerary'),
      json('includes'),
      json('not_includes'),
      json('what_to_bring'),
      json('important_notes'),
      text('seo_title', 300),
      text('seo_description', 1000),
      ...timestamps(),
    ],
    indexes: ['CREATE UNIQUE INDEX idx_products_slug ON products (slug)'],
  }, catalogRules)));

  // Un solo registro, que crea esta migración: no se crea ni se borra desde la API.
  const settings = new Collection({
    type: 'base',
    name: 'settings',
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: EDITOR,
    deleteRule: null,
    fields: [
      // Teléfonos como se muestran (+51 954 669 589); el enlace usa solo los dígitos.
      text('whatsapp', 50),
      text('emergency_phone', 50),
      { name: 'email', type: 'email' },
      text('address', 500),
      ...timestamps(),
    ],
  });
  app.save(settings);
  app.save(new Record(settings));
}, (app) => {
  for (const name of ['settings', 'products', 'destinations']) {
    app.delete(app.findCollectionByNameOrId(name));
  }
});
