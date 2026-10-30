/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Copias de seguridad desde /admin (pantalla "Copias de seguridad"), solo editores:
//
//   GET  /api/editor/backups          → las copias que hay en la VM (pb_data/backups) y
//                                       cuándo se restauró una por última vez.
//   POST /api/editor/backups/upload   → sube un zip (campo `file`; p. ej. uno bajado antes
//                                       de /admin): queda como uploaded-<fecha>.zip.
//   POST /api/editor/backups/restore  → { key }: guarda antes una copia del estado actual
//                                       (before-restore-<fecha>.zip, para deshacerlo) y
//                                       restaura esa. PocketBase se reinicia: la respuesta
//                                       no llega, /admin espera a /api/health.
//   GET  /api/editor/restored         → { at }: última restauración (o ''), para que /admin
//                                       la cuente como cambio sin publicar.
//
// Restaurar reemplaza todo pb_data (también el historial de publicaciones), por eso:
// - deja <BUILD_REQUEST_DIR>/../restored con la fecha: /admin ofrece Publicar aunque la
//   base restaurada diga que todo estaba publicado;
// - reescribe content-changed (los hooks de contenido no ven la restauración);
// - deja restore-preview: al arrancar de nuevo (onBootstrap, abajo) PocketBase pide la
//   vista previa (preview-auto) para que editor.<dominio> muestre lo restaurado.
//
// Quedan las 5 últimas publish-* (hooks/publish.pb.js) y las 3 últimas uploaded-* y
// before-restore-*.
//
// NB: en el JSVM los bindings de nivel de archivo no se ven dentro de los callbacks:
// los helpers van en el require de abajo (backups.js).

routerAdd('GET', '/api/editor/backups', (e) => {
  const lib = require(`${__hooks}/backups.js`)
  if (!lib.isEditor(e)) return e.json(401, { message: 'Solo el editor.' })
  const fsys = $app.newBackupsFilesystem()
  try {
    return e.json(200, { backups: lib.list(fsys), restoredAt: lib.restoredAt() })
  } finally {
    fsys.close()
  }
})

routerAdd('GET', '/api/editor/restored', (e) => {
  const lib = require(`${__hooks}/backups.js`)
  if (!lib.isEditor(e)) return e.json(401, { message: 'Solo el editor.' })
  return e.json(200, { at: lib.restoredAt() })
})

routerAdd('POST', '/api/editor/backups/upload', (e) => {
  const lib = require(`${__hooks}/backups.js`)
  if (!lib.isEditor(e)) return e.json(401, { message: 'Solo el editor.' })
  let files
  try {
    files = e.findUploadedFiles('file')
  } catch (err) {
    return e.json(400, { message: 'Falta el archivo.' })
  }
  if (!files || !files.length) return e.json(400, { message: 'Falta el archivo.' })
  const file = files[0]
  if (!/\.zip$/i.test(file.originalName)) return e.json(400, { message: 'Tiene que ser un .zip de copia de seguridad.' })

  const key = 'uploaded-' + lib.stamp() + '.zip'
  const fsys = $app.newBackupsFilesystem()
  try {
    fsys.uploadFile(file, key)
    lib.prune(fsys, 'uploaded-', 3)
    return e.json(200, { key: key })
  } finally {
    fsys.close()
  }
}, $apis.bodyLimit(1024 * 1024 * 1024))

routerAdd('POST', '/api/editor/backups/restore', (e) => {
  const lib = require(`${__hooks}/backups.js`)
  if (!lib.isEditor(e)) return e.json(401, { message: 'Solo el editor.' })
  const key = (e.requestInfo().body || {}).key || ''
  const fsys = $app.newBackupsFilesystem()
  try {
    if (!key || !fsys.exists(key)) return e.json(404, { message: 'Esa copia no está.' })
  } finally {
    fsys.close()
  }

  // Para deshacerlo: el estado actual, antes de reemplazarlo.
  $app.createBackup(e.request.context(), 'before-restore-' + lib.stamp() + '.zip')
  const pruneFs = $app.newBackupsFilesystem()
  try {
    lib.prune(pruneFs, 'before-restore-', 3)
  } finally {
    pruneFs.close()
  }

  lib.markRestored()
  // Reemplaza pb_data y reinicia el proceso: lo que sigue no se ejecuta.
  $app.restoreBackup(e.request.context(), key)
  return e.json(200, { key: key })
})

// Después de restaurar (y en cada arranque, si quedó pendiente): pedir la vista
// previa con lo restaurado.
onBootstrap((e) => {
  e.next()
  const lib = require(`${__hooks}/backups.js`)
  lib.requestPreviewAfterRestore()
})
