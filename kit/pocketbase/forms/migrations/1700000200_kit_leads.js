/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Solicitudes de contacto del sitio (kit/forms/forms.ts). Cualquiera puede crear
// (sin elegir el estado); solo el editor lee y cambia el estado. Límite: 5 por IP
// cada 10 minutos.

const EDITOR = '@request.auth.collectionName = "editors"';
const text = (name, max, required) => ({ name, type: 'text', max: max || 0, required: !!required });
const RULE = 'leads:create';

migrate((app) => {
  let exists = true;
  try {
    app.findCollectionByNameOrId('leads');
  } catch {
    exists = false;
  }
  if (!exists) {
    app.save(new Collection({
      type: 'base',
      name: 'leads',
      listRule: EDITOR,
      viewRule: EDITOR,
      createRule: '@request.body.status:isset = false',
      updateRule: EDITOR,
      deleteRule: null,
      fields: [
        text('name', 200, true),
        { name: 'email', type: 'email', required: true },
        text('phone', 50),
        text('interest', 200),
        text('message', 5000),
        text('lang', 10),
        { name: 'status', type: 'select', values: ['new', 'contacted', 'closed'], maxSelect: 1 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    }));
  }

  const settings = app.settings();
  const rules = [];
  for (const rule of settings.rateLimits.rules) {
    if (rule.label !== RULE) rules.push(rule);
  }
  rules.push({ label: RULE, audience: '@guest', duration: 600, maxRequests: 5 });
  settings.rateLimits.rules = rules;
  settings.rateLimits.enabled = true;
  app.save(settings);
}, (app) => {
  app.delete(app.findCollectionByNameOrId('leads'));
});
