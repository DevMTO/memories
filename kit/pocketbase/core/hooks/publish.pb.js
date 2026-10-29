/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Publicar: el editor pide publicar y el hook encola un build en el VPS.
//
//   POST /api/publish            (solo editores) → crea publishes(status=queued)
//                                                   y un archivo con su id en BUILD_REQUEST_DIR.
//   POST /api/preview            (solo editores) → igual con kind=preview y el archivo
//                                                   preview-<id>: build.sh arma la vista previa
//                                                   (con lo oculto) sin tocar el sitio. Con
//                                                   { translate: true }, preview-<id>-translate:
//                                                   también traduce los textos nuevos.
//   GET  /api/preview/key        (solo editores) → PREVIEW_KEY: con esa cookie el servidor
//                                                   web sirve la vista previa en las mismas URLs.
//   POST /api/publish/:id/status (con secreto)   → kit/deploy/build.sh reporta building|done|failed|skipped.
//   POST /api/preview/token      (con secreto)   → token del editor para que build.sh lea lo
//                                                   oculto en la vista previa, sin su contraseña
//                                                   (el editor la cambia en /admin).
//
// BUILD_REQUEST_DIR y PUBLISH_CALLBACK_SECRET van en el entorno del servicio de
// PocketBase en el VPS. Un path unit de systemd (kit/deploy/templates/build.path.in) lanza el
// build cuando la carpeta tiene archivos; build.sh los consume, así que los
// pedidos que lleguen durante un build se juntan en el siguiente.
// publishes se guarda con $app.save, que ignora las reglas de la API (su
// createRule/updateRule son null: nadie puede escribirla desde fuera).
//
// NB: en el JSVM concatenado los bindings de nivel de archivo NO son visibles
// dentro de los closures de routerAdd (ni const, ni function, ni globalThis).
// Por eso cada helper se declara dentro del closure que lo usa (igual que
// editor.pb.js que hace todo dentro de un callback).

// POST /api/publish — solo editores.
routerAdd('POST', '/api/publish', (e) => {
  const editor = e.auth
  if (!editor || !editor.collection || editor.collection().name !== 'editors') {
    return e.json(401, { message: 'Solo el editor puede publicar.' })
  }

  const requestDir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (!requestDir) return e.json(500, { message: 'Falta BUILD_REQUEST_DIR.' })

  const publishes = $app.findCollectionByNameOrId('publishes')
  const publish = new Record(publishes)
  publish.set('requested_by', editor.id)
  publish.set('kind', 'publish')
  publish.set('status', 'queued')
  $app.save(publish)

  try {
    $os.writeFile(requestDir + '/' + publish.id, '', 0o644)
    return e.json(200, { id: publish.id, status: 'queued' })
  } catch (err) {
    publish.set('status', 'failed')
    publish.set('message', String((err && err.message) || err))
    $app.save(publish)
    return e.json(502, { id: publish.id, status: 'failed', message: String((err && err.message) || err) })
  }
})

// POST /api/preview — solo editores.
routerAdd('POST', '/api/preview', (e) => {
  const editor = e.auth
  if (!editor || !editor.collection || editor.collection().name !== 'editors') {
    return e.json(401, { message: 'Solo el editor puede pedir una vista previa.' })
  }

  const requestDir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (!requestDir) return e.json(500, { message: 'Falta BUILD_REQUEST_DIR.' })

  const preview = new Record($app.findCollectionByNameOrId('publishes'))
  preview.set('requested_by', editor.id)
  preview.set('kind', 'preview')
  preview.set('status', 'queued')
  $app.save(preview)

  try {
    const translate = (e.requestInfo().body || {}).translate === true
    $os.writeFile(requestDir + '/preview-' + preview.id + (translate ? '-translate' : ''), '', 0o644)
    return e.json(200, { id: preview.id, status: 'queued' })
  } catch (err) {
    preview.set('status', 'failed')
    preview.set('message', String((err && err.message) || err))
    $app.save(preview)
    return e.json(502, { id: preview.id, status: 'failed', message: String((err && err.message) || err) })
  }
})

// GET /api/preview/key — solo editores. Sin PREVIEW_KEY no hay vista previa.
routerAdd('GET', '/api/preview/key', (e) => {
  const editor = e.auth
  if (!editor || !editor.collection || editor.collection().name !== 'editors') {
    return e.json(401, { message: 'Solo el editor puede ver la vista previa.' })
  }
  const key = $os.getenv('PREVIEW_KEY') || ''
  if (!key) return e.json(404, { message: 'Vista previa sin configurar (PREVIEW_KEY).' })
  return e.json(200, { key: key })
})

// POST /api/preview/token — solo kit/deploy/build.sh (con PUBLISH_CALLBACK_SECRET): un
// token del editor, para leer como él (ocultos incluidos) al armar la vista previa.
routerAdd('POST', '/api/preview/token', (e) => {
  const secret = $os.getenv('PUBLISH_CALLBACK_SECRET') || ''
  if (!secret) return e.json(500, { message: 'PUBLISH_CALLBACK_SECRET no definido.' })
  if (e.request.header.get('X-Publish-Secret') !== secret) {
    return e.json(401, { message: 'Secreto inválido.' })
  }
  const editors = $app.findAllRecords($app.findCollectionByNameOrId('editors'))
  if (!editors.length) return e.json(404, { message: 'No hay editor.' })
  return e.json(200, { token: editors[0].newAuthToken() })
})

// POST /api/publish/:id/status — solo kit/deploy/build.sh (con PUBLISH_CALLBACK_SECRET).
routerAdd('POST', '/api/publish/{id}/status', (e) => {
  const secret = $os.getenv('PUBLISH_CALLBACK_SECRET') || ''
  if (!secret) return e.json(500, { message: 'PUBLISH_CALLBACK_SECRET no definido.' })
  if (e.request.header.get('X-Publish-Secret') !== secret) {
    return e.json(401, { message: 'Secreto inválido.' })
  }

  const body = e.requestInfo().body || {}
  const status = body.status || ''
  if (['building', 'done', 'failed', 'skipped'].indexOf(status) === -1) {
    return e.json(400, { message: 'status debe ser building, done, failed o skipped.' })
  }

  const id = e.request.pathValue('id')
  let publish
  try {
    const publishes = $app.findCollectionByNameOrId('publishes')
    publish = $app.findRecordById(publishes, id)
  } catch (err) {
    return e.json(404, { message: 'Publicación no encontrada.' })
  }

  publish.set('status', status)
  if (body.run_url) publish.set('run_url', body.run_url)
  if (body.message) publish.set('message', String(body.message).slice(0, 2000))
  $app.save(publish)
  return e.json(200, { id: id, status: publish.get('status') })
})
