/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Historial de versiones: antes de cada cambio o borrado de un registro se
// guarda cómo estaba (en `revisions`), para verlo y restaurarlo desde /admin.
// Vale para todas las colecciones base salvo las de revisions.js (SKIP); un
// cambio que solo toca el orden (sort_order) no deja versión. Los archivos no
// se conservan: PocketBase borra los reemplazados.

onRecordUpdate((e) => {
  const lib = require(`${__hooks}/revisions.js`);
  if (lib.skip(e.record)) return e.next();
  const before = e.record.original();
  const changed = lib.changedFields(before, e.record);
  e.next();
  if (changed.length) lib.save(e.app, before, 'update', changed);
});

onRecordDelete((e) => {
  const lib = require(`${__hooks}/revisions.js`);
  if (lib.skip(e.record)) return e.next();
  const before = e.record.original();
  e.next();
  lib.save(e.app, before, 'delete', []);
});
