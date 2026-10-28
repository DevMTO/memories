/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Ayudantes de revisions.pb.js. Van en un módulo aparte porque los closures de
// los hooks no ven lo declarado a nivel de archivo (se cargan con require).

// Colecciones que no se versionan (además de las de sistema y las de usuarios).
const SKIP = ['revisions', 'publishes'];
// Campos que no cuentan como cambio (el orden se cambia arrastrando en las listas).
const IGNORED = ['id', 'created', 'updated', 'sort_order'];
// Versiones que se guardan por registro.
const KEEP = 50;

function skip(record) {
  const collection = record.collection();
  return collection.system || collection.type !== 'base' || SKIP.indexOf(collection.name) !== -1;
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value)
      .sort()
      .forEach((key) => (out[key] = sortKeys(value[key])));
    return out;
  }
  return value;
}

// Los JSON leídos de la base conservan el orden de sus claves y los recién
// guardados vienen ordenados: se comparan normalizados.
function canonical(field, value) {
  const text = toString(value);
  if (field.type() !== 'json') return text;
  try {
    return JSON.stringify(sortKeys(JSON.parse(text || 'null')));
  } catch (_) {
    return text;
  }
}

function changedFields(before, after) {
  const changed = [];
  for (const field of after.collection().fields) {
    if (IGNORED.indexOf(field.name) !== -1) continue;
    if (canonical(field, before.get(field.name)) !== canonical(field, after.get(field.name))) changed.push(field.name);
  }
  return changed;
}

function save(app, before, action, changed) {
  const collection = before.collection().name;
  const revision = new Record(app.findCollectionByNameOrId('revisions'));
  revision.set('collection_name', collection);
  revision.set('record', before.id);
  revision.set('action', action);
  revision.set('data', before);
  revision.set('changed', changed);
  app.save(revision);

  const old = app.findRecordsByFilter(
    'revisions',
    'collection_name = {:collection} && record = {:record}',
    '-created',
    1000,
    KEEP,
    { collection: collection, record: before.id },
  );
  for (const r of old) app.delete(r);
}

module.exports = { skip, changedFields, save };
