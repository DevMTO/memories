/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// El único editor de /admin. La primera vez que arranca el servidor (después de las
// migraciones) se crea con EDITOR_EMAIL y EDITOR_PASSWORD (/etc/<app>/pocketbase.env
// en el VPS, .env en local); después la contraseña la cambia el editor desde /admin
// ("Mi cuenta") y estas variables ya no la pisan. Si hubiera otro editor, se elimina.
//
// Contraseña olvidada o cambio de correo: el superusuario lo hace en el dashboard de
// PocketBase (/_/ → editors).

$app.onServe().bindFunc((e) => {
  e.next();

  const collection = e.app.findCollectionByNameOrId('editors');
  const editors = e.app.findAllRecords(collection);
  const email = $os.getenv('EDITOR_EMAIL');

  if (editors.length === 0) {
    const password = $os.getenv('EDITOR_PASSWORD');
    if (!email || !password) {
      console.warn('EDITOR_EMAIL / EDITOR_PASSWORD no definidos: no hay editor para /admin.');
      return;
    }
    const editor = new Record(collection);
    editor.setEmail(email);
    editor.setVerified(true);
    editor.setPassword(password);
    e.app.save(editor);
    return;
  }

  // Uno solo: el de EDITOR_EMAIL si existe, si no el más antiguo.
  const keep = editors.find((r) => r.email() === email) || editors.sort((a, b) => (a.getString('created') < b.getString('created') ? -1 : 1))[0];
  for (const other of editors) {
    if (other.id !== keep.id) e.app.delete(other);
  }
});
