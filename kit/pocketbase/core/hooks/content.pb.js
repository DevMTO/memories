/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Marca de "cambió el contenido": cada alta, cambio o borrado en una colección
// del sitio reescribe <BUILD_REQUEST_DIR>/../content-changed (en el VPS,
// /srv/<app>/build/content-changed, fuera de la carpeta de pedidos para no lanzar un
// build). kit/deploy/build.sh compara su fecha para no rearmar la vista previa ni
// repetir la copia de seguridad cuando nada cambió.
//
// No cuentan las colecciones del sistema (_superusers…), las de auth (editors) ni
// las propias del kit que no son contenido (publishes, revisions).
//
// NB: en el JSVM los bindings de nivel de archivo no se ven dentro de los
// callbacks: todo va adentro de cada uno.

onRecordAfterCreateSuccess((e) => {
  e.next()
  const c = e.record.collection()
  if (c.system || c.type !== 'base' || ['publishes', 'revisions'].indexOf(c.name) !== -1) return
  const dir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (dir) $os.writeFile(dir + '/../content-changed', new Date().toISOString(), 0o644)
})

onRecordAfterUpdateSuccess((e) => {
  e.next()
  const c = e.record.collection()
  if (c.system || c.type !== 'base' || ['publishes', 'revisions'].indexOf(c.name) !== -1) return
  const dir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (dir) $os.writeFile(dir + '/../content-changed', new Date().toISOString(), 0o644)
})

onRecordAfterDeleteSuccess((e) => {
  e.next()
  const c = e.record.collection()
  if (c.system || c.type !== 'base' || ['publishes', 'revisions'].indexOf(c.name) !== -1) return
  const dir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (dir) $os.writeFile(dir + '/../content-changed', new Date().toISOString(), 0o644)
})
