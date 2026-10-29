/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Ajustes de la app que /admin y el build necesitan: API batch, proxy de
// confianza y un límite propio para las descargas de archivos.

const FILES_RULE = '/api/files/';

migrate((app) => {
  const settings = app.settings();

  // /admin guarda el orden arrastrado (sort_order de toda una lista) en un solo
  // lote con la API batch, que PocketBase trae apagada.
  settings.batch.enabled = true;
  settings.batch.maxRequests = 200;

  // Caddy o nginx agregan la IP real del visitante al final de X-Forwarded-For
  // (lo de la izquierda lo puede inventar el visitante); sin esto los límites
  // verían siempre 127.0.0.1.
  settings.trustedProxy.headers = ['X-Forwarded-For'];
  settings.trustedProxy.useLeftmostIP = false;

  // El build descarga todas las imágenes en paralelo y pasaría el límite general
  // ("/api/": 300 cada 10 s por IP): las descargas de archivos tienen el suyo,
  // más alto, y va primero porque entre reglas de ruta gana la primera que
  // coincide. Si la regla ya existe, se reemplaza (no se duplica).
  const rules = [{ label: FILES_RULE, audience: '', duration: 10, maxRequests: 2000 }];
  for (const rule of settings.rateLimits.rules) {
    if (rule.label !== FILES_RULE) rules.push(rule);
  }
  settings.rateLimits.rules = rules;
  settings.rateLimits.enabled = true;

  app.save(settings);
}, (app) => {
  const settings = app.settings();
  settings.batch.enabled = false;
  const rules = [];
  for (const rule of settings.rateLimits.rules) {
    if (rule.label !== FILES_RULE) rules.push(rule);
  }
  settings.rateLimits.rules = rules;
  app.save(settings);
});
