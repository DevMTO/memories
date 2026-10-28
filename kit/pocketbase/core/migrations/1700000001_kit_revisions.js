/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Historial de versiones (hooks/revisions.pb.js): cómo estaba cada registro
// antes de cada cambio o borrado. Solo lo escriben los hooks.

const EDITOR = '@request.auth.collectionName = "editors"';

migrate((app) => {
  try {
    app.findCollectionByNameOrId('revisions');
    return;
  } catch {}

  app.save(new Collection({
    type: 'base',
    name: 'revisions',
    listRule: EDITOR,
    viewRule: EDITOR,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: 'collection_name', type: 'text', required: true, max: 100 },
      { name: 'record', type: 'text', required: true, max: 50 },
      { name: 'action', type: 'select', values: ['update', 'delete'], maxSelect: 1, required: true },
      { name: 'data', type: 'json', maxSize: 5 * 1024 * 1024 },
      { name: 'changed', type: 'json', maxSize: 10000 },
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
    ],
    indexes: ['CREATE INDEX idx_revisions_record ON revisions (collection_name, record, created)'],
  }));
}, (app) => {
  app.delete(app.findCollectionByNameOrId('revisions'));
});
