/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// El único editor de /admin sale de EDITOR_EMAIL y EDITOR_PASSWORD
// (/etc/<app>/pocketbase.env en el VPS, .env en local). En cada
// arranque del servidor (después de las migraciones) se crea o actualiza:
// cambiar EDITOR_PASSWORD cambia la contraseña. Cualquier otro editor se elimina.

$app.onServe().bindFunc((e) => {
  e.next();

  const email = $os.getenv('EDITOR_EMAIL');
  const password = $os.getenv('EDITOR_PASSWORD');
  if (!email || !password) {
    console.warn('EDITOR_EMAIL / EDITOR_PASSWORD no definidos: no hay editor para /admin.');
    return;
  }

  const collection = e.app.findCollectionByNameOrId('editors');

  let editor;
  try {
    editor = e.app.findAuthRecordByEmail(collection, email);
  } catch (_) {
    editor = new Record(collection);
    editor.setEmail(email);
    editor.setVerified(true);
  }

  // Solo se cambia si hace falta: cambiar la contraseña cierra las sesiones abiertas.
  if (editor.isNew() || !editor.validatePassword(password)) {
    editor.setPassword(password);
    e.app.save(editor);
  }

  for (const other of e.app.findAllRecords(collection)) {
    if (other.id !== editor.id) e.app.delete(other);
  }
});
