/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Helpers de backups.pb.js (y del arranque): require(`${__hooks}/backups.js`).

function isEditor(e) {
  const auth = e.auth
  return !!auth && !!auth.collection && auth.collection().name === 'editors'
}

// Carpeta de los archivos de estado del build (/srv/<app>/build en el VPS).
function buildDir() {
  const requests = $os.getenv('BUILD_REQUEST_DIR') || ''
  return requests ? requests + '/..' : ''
}

// 20261030-183408: ordena bien y es un nombre válido de backup de PocketBase.
function stamp() {
  return new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
}

function kindOf(key) {
  if (key.indexOf('publish-') === 0) return 'publish'
  if (key.indexOf('uploaded-') === 0) return 'uploaded'
  if (key.indexOf('before-restore-') === 0) return 'before-restore'
  return 'other'
}

// Las copias, de la más nueva a la más vieja (list devuelve un slice de Go).
function list(fsys) {
  const out = []
  for (const f of fsys.list('')) {
    if (!/\.zip$/.test(f.key)) continue
    out.push({ key: f.key, size: f.size, time: f.modTime.unix(), kind: kindOf(f.key) })
  }
  out.sort((a, b) => b.time - a.time)
  return out
}

// Deja las `keep` más nuevas que empiezan con `prefix`.
function prune(fsys, prefix, keep) {
  const old = list(fsys).filter((f) => f.key.indexOf(prefix) === 0).slice(keep)
  for (const f of old) fsys.delete(f.key)
}

function read(name) {
  const dir = buildDir()
  if (!dir) return ''
  try {
    return toString($os.readFile(dir + '/' + name)).trim()
  } catch (err) {
    return ''
  }
}

function write(name, text) {
  const dir = buildDir()
  if (dir) $os.writeFile(dir + '/' + name, text, 0o644)
}

function restoredAt() {
  return read('restored')
}

function markRestored() {
  const now = new Date().toISOString()
  write('restored', now)
  write('content-changed', now)
  write('restore-preview', now)
}

function requestPreviewAfterRestore() {
  const dir = buildDir()
  if (!dir || !read('restore-preview')) return
  try {
    $os.writeFile(dir + '/requests/preview-auto', '', 0o644)
    $os.remove(dir + '/restore-preview')
  } catch (err) {
    console.warn('No se pudo pedir la vista previa después de restaurar:', err)
  }
}

module.exports = { isEditor, stamp, list, prune, restoredAt, markRestored, requestPreviewAfterRestore }
