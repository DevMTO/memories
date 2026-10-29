/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// El editor cambia su propia contraseña desde /admin ("Mi cuenta"): puede actualizar
// solo su registro. El correo no: PocketBase solo deja cambiarlo a un superusuario
// (o con confirmación por correo, que no se usa).

migrate((app) => {
  const editors = app.findCollectionByNameOrId('editors');
  editors.updateRule = 'id = @request.auth.id';
  app.save(editors);
}, (app) => {
  const editors = app.findCollectionByNameOrId('editors');
  editors.updateRule = null;
  app.save(editors);
});
