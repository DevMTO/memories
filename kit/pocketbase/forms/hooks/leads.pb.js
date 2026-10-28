/// <reference path="../../../../pocketbase/pb_data/types.d.ts" />
// Solicitudes de contacto (`leads`, kit/forms).
//
// - Trampa para bots: el campo oculto `website` lo completan solo los bots; se
//   responde como si se hubiera guardado, pero no se guarda.
// - Aviso por correo a la empresa: a LEADS_EMAIL o, si no está, al campo `email`
//   de la colección `settings` (si el proyecto la tiene). Se envía por el SMTP de
//   PocketBase (Settings → Mail) o, con MAIL_RELAY_URL, por un relay HTTP
//   (kit/forms/relay/: para servidores que bloquean el SMTP saliente). Sin
//   ninguno de los dos, el contacto se guarda igual y no se avisa.
//
// NB: en el JSVM los bindings de nivel de archivo NO son visibles dentro de los
// handlers (ver publish.pb.js): todo se declara dentro del handler.

onRecordCreateRequest((e) => {
  const body = e.requestInfo().body || {};
  if (body.website) return e.json(200, { id: '' });

  e.record.set('status', 'new');
  e.next();

  const relayUrl = $os.getenv('MAIL_RELAY_URL');
  if (!relayUrl && !$app.settings().smtp.enabled) return;
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  try {
    let to = $os.getenv('LEADS_EMAIL');
    if (!to) {
      try {
        to = $app.findFirstRecordByFilter('settings', 'id != ""').getString('email');
      } catch {}
    }
    if (!to) return;
    const r = e.record;
    const rows = [['Nombre', r.getString('name')], ['Correo', r.getString('email')], ['Teléfono', r.getString('phone')], ['Interés', r.getString('interest')], ['Idioma', r.getString('lang')], ['Mensaje', r.getString('message')]];
    const subject = 'Nueva solicitud de contacto: ' + r.getString('name');
    const html = '<table>' + rows.map((row) => '<tr><th align="left" valign="top">' + row[0] + '</th><td style="white-space:pre-wrap">' + esc(row[1]) + '</td></tr>').join('') + '</table>';

    if (relayUrl) {
      // Mismo formato que el relay de cPanel (kit/forms/relay/relay.php).
      const res = $http.send({
        url: relayUrl,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': $os.getenv('MAIL_RELAY_KEY') },
        body: JSON.stringify({ to: to, subject: subject, html: html, replyTo: r.getString('email') }),
        timeout: 30,
      });
      if (res.statusCode < 200 || res.statusCode >= 300) throw new Error('relay HTTP ' + res.statusCode + ': ' + res.raw);
      return;
    }
    $app.newMailClient().send(new MailerMessage({
      from: { address: $app.settings().meta.senderAddress, name: $app.settings().meta.senderName },
      to: [{ address: to }],
      replyTo: [{ address: r.getString('email') }],
      subject: subject,
      html: html,
    }));
  } catch (err) {
    $app.logger().warn('No se pudo avisar del contacto por correo', 'error', String(err));
  }
}, 'leads');
