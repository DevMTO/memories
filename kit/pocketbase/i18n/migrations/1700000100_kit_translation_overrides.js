/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Correcciones de traducción (kit/i18n): texto en español → traducción, por
// idioma. El build las lee sin sesión; solo el editor las cambia.

const EDITOR = '@request.auth.collectionName = "editors"';
const text = (name, max, required) => ({ name, type: 'text', max: max || 0, required: !!required });

migrate((app) => {
  try {
    app.findCollectionByNameOrId('translation_overrides');
    return;
  } catch {}

  const overrides = new Collection({
    type: 'base',
    name: 'translation_overrides',
    listRule: '',
    viewRule: '',
    createRule: EDITOR,
    updateRule: EDITOR,
    deleteRule: EDITOR,
    fields: [
      text('lang', 10, true),
      text('source', 20000, true),
      text('text', 20000, true),
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
    ],
    indexes: ['CREATE UNIQUE INDEX idx_translation_overrides_lang_source ON translation_overrides (lang, source)'],
  });
  overrides.fields.getByName('lang').pattern = '^[a-z]{2,3}(-[A-Z]{2})?$';
  app.save(overrides);
}, (app) => {
  app.delete(app.findCollectionByNameOrId('translation_overrides'));
});
