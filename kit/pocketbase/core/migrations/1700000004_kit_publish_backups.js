/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Copia de seguridad por publicación (hooks/publish.pb.js): el build la pide al
// terminar una publicación con cambios de contenido, y el editor la puede bajar
// una sola vez desde /admin (cada descarga es tráfico de salida de la VM).

const FIELDS = [
  // Nombre del zip en los backups de PocketBase (publish-<id>.zip).
  () => new TextField({ name: 'backup', max: 200 }),
  () => new NumberField({ name: 'backup_size', onlyInt: true, min: 0 }),
  () => new BoolField({ name: 'backup_downloaded' }),
];

migrate((app) => {
  const publishes = app.findCollectionByNameOrId('publishes');
  for (const make of FIELDS) {
    const field = make();
    if (!publishes.fields.getByName(field.name)) publishes.fields.add(field);
  }
  app.save(publishes);
}, (app) => {
  const publishes = app.findCollectionByNameOrId('publishes');
  for (const name of ['backup', 'backup_size', 'backup_downloaded']) publishes.fields.removeByName(name);
  app.save(publishes);
});
