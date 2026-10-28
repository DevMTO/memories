/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Editor (único usuario de /admin) y registro de publicaciones. El editor lo crea
// hooks/editor.pb.js desde las variables de entorno.
//
// Las migraciones del kit no hacen nada si la colección ya existe: así se pueden
// sumar a un proyecto que ya tiene esa colección (de otra migración) sin romperlo.

const EDITOR = '@request.auth.collectionName = "editors"';
const text = (name, max, required) => ({ name, type: 'text', max: max || 0, required: !!required });
const exists = (app, name) => {
  try {
    app.findCollectionByNameOrId(name);
    return true;
  } catch {
    return false;
  }
};

migrate((app) => {
  if (!exists(app, 'editors')) {
    app.save(new Collection({
      type: 'auth',
      name: 'editors',
      // Sin registro público: solo ve su propio registro y no puede crear ni borrar.
      listRule: 'id = @request.auth.id',
      viewRule: 'id = @request.auth.id',
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [text('name', 200)],
    }));
  }

  if (!exists(app, 'publishes')) {
    app.save(new Collection({
      type: 'base',
      name: 'publishes',
      // Publicaciones y vistas previas (hooks/publish.pb.js) y builds pedidos por
      // push a deploy (hooks/deploy.pb.js). Los crean los hooks y los actualiza
      // el build (no la API pública).
      listRule: EDITOR,
      viewRule: EDITOR,
      createRule: null,
      updateRule: null,
      deleteRule: null,
      fields: [
        { name: 'requested_by', type: 'relation', collectionId: app.findCollectionByNameOrId('editors').id, maxSelect: 1 },
        // skipped: push a deploy que no toca nada del sitio (build.sh no
        // reconstruye); no cuenta como publicación en /admin.
        { name: 'status', type: 'select', values: ['queued', 'building', 'done', 'failed', 'skipped'], maxSelect: 1, required: true },
        // Vacío = publicación.
        { name: 'kind', type: 'select', values: ['publish', 'preview'], maxSelect: 1 },
        { name: 'run_url', type: 'url' },
        text('message', 2000),
        // Commit que lanzó el build, para mostrarlo en el historial de /admin.
        text('commit', 40),
        text('commit_message', 500),
        { name: 'commit_url', type: 'url' },
        text('pushed_by', 200),
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    }));
  }
}, (app) => {
  for (const name of ['publishes', 'editors']) {
    if (exists(app, name)) app.delete(app.findCollectionByNameOrId(name));
  }
});
