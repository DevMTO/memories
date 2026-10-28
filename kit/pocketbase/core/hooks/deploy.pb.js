/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Push a la rama deploy: el webhook de GitHub pide un build, igual que "Publicar".
//
//   POST /api/deploy-hook (firmado con DEPLOY_WEBHOOK_SECRET) → crea publishes(status=queued)
//                                                               con el commit y un archivo push-<id>
//                                                               en BUILD_REQUEST_DIR. Si el push no
//                                                               toca el sitio, build.sh no reconstruye
//                                                               y lo marca skipped.
//
// GitHub firma el cuerpo crudo (X-Hub-Signature-256), así que se lee sin
// requestInfo(). Ver kit/deploy/README.md.

routerAdd('POST', '/api/deploy-hook', (e) => {
  const secret = $os.getenv('DEPLOY_WEBHOOK_SECRET') || ''
  const requestDir = $os.getenv('BUILD_REQUEST_DIR') || ''
  if (!secret || !requestDir) {
    return e.json(500, { message: 'Faltan DEPLOY_WEBHOOK_SECRET o BUILD_REQUEST_DIR.' })
  }

  const body = toString(e.request.body)
  const signature = e.request.header.get('X-Hub-Signature-256') || ''
  if (!$security.equal(signature, 'sha256=' + $security.hs256(body, secret))) {
    return e.json(401, { message: 'Firma inválida.' })
  }

  const event = e.request.header.get('X-GitHub-Event')
  if (event === 'ping') return e.json(200, { message: 'pong' })

  let payload = {}
  try {
    payload = JSON.parse(body)
  } catch (_) {}
  if (event !== 'push' || payload.ref !== 'refs/heads/deploy' || payload.deleted) {
    return e.json(200, { message: 'Ignorado.' })
  }

  const head = payload.head_commit || {}
  const publishes = $app.findCollectionByNameOrId('publishes')
  const publish = new Record(publishes)
  publish.set('kind', 'publish')
  publish.set('status', 'queued')
  publish.set('commit', payload.after || '')
  publish.set('commit_message', String(head.message || '').split('\n')[0].slice(0, 500))
  publish.set('commit_url', head.url || '')
  publish.set('pushed_by', (payload.pusher && payload.pusher.name) || '')
  $app.save(publish)

  try {
    $os.writeFile(requestDir + '/push-' + publish.id, '', 0o644)
  } catch (err) {
    publish.set('status', 'failed')
    publish.set('message', String((err && err.message) || err))
    $app.save(publish)
    return e.json(500, { message: publish.get('message') })
  }
  return e.json(202, { id: publish.id, status: 'queued' })
})
