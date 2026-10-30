# Relay de formularios para sitios estáticos (cPanel)

`form.php` envía por correo los formularios de los sitios estáticos. Uno solo sirve para
todos los sitios: cada sitio es una línea en la tabla.

- **Cada sitio arma su correo** (`kit/forms/forms.ts`, con los `data-*` del `<form>`):
  asunto, textos, filas con etiqueta y valor, en su idioma. El relay no tiene textos
  propios.
- **El buzón lo elige el sitio, firmado.** El relay busca el dominio del `Origin` en la
  tabla de sitios (vale para sus subdominios: `www.`, `editor.` de la vista previa). El
  buzón es el que el sitio eligió (p. ej. "Datos de la empresa" en `/admin`): el build lo
  escribe en el formulario con una firma (HMAC) hecha con la clave del sitio (`key` en la
  tabla, `FORMS_RELAY_KEY` en el build), y el relay solo envía a esa dirección si la firma
  es válida. La clave no sale del build ni del relay, así que nadie puede cambiar el buzón
  en la página. Sin firma, el buzón de la tabla (`to`); una firma inválida se rechaza.
  Un cambio del buzón en `/admin` se aplica al publicar.
- **El HTML es del servidor.** Lo que llega es texto: se escapa y se pone en la plantilla
  (`email.html`, o `~/form-relay/templates/<dominio>.html` si el sitio tiene la suya).
  Nadie puede meter su propio HTML ni enlaces en un correo enviado desde aquí.
- **Copia a quien lo envía** (al correo que escribió) solo en los formularios que la tabla
  permite (`copy`), con un límite por IP más bajo. Ejemplo: la hoja del libro de
  reclamaciones.
- **`{code}`**: número correlativo por año (`2026-00001`…), por sitio y formulario, en los
  formularios de `number`. **`{date}`**: fecha y hora del envío.
- Trampa para bots (`website`), límite por IP y límites de tamaño.
- No guarda nada: **el buzón es el registro.** Así los visitantes nunca le piden nada al
  VPS.

Sirve a sitios estáticos, que envían desde el navegador (sin clave secreta). Un backend con
servidor propio usa otro tipo de relay, con clave secreta entre servidores: ese puede
mandar a cualquier destinatario porque la clave nunca sale del servidor.

## Instalación (cPanel, una vez para todos los sitios)

1. Un subdominio solo para esto (p. ej. `relay.example.com`). Si el dominio principal
   tiene WordPress, sus redirecciones no lo alcanzan. Permisos de la carpeta: **755**.
   PHP 8.1 o más (MultiPHP Manager).
2. Subir `form.php`, `email.html`, `composer.json` y `vendor/` (`composer install` en esta
   carpeta, o `vendor/` ya armado).
3. Una cuenta de correo del hosting del relay para enviar (cPanel → Email Accounts, p. ej.
   `no-reply@example.com`; los datos en **Connect Devices**). Envía los correos de todos
   los sitios, con el nombre de cada uno como remitente; la respuesta va a quien llenó el
   formulario (Reply-To). cPanel → **Email Deliverability**: SPF y DKIM válidos
   (**Repair** si el DNS está en cPanel), o los correos terminan en spam.
4. Configuración **fuera de `public_html`** (tiene la contraseña):
   `form-config.example.php` → `~/form-relay/config.php`, con la cuenta de envío y la
   tabla de sitios. Los correlativos quedan en `~/form-relay/data/` (o `data_dir`): no
   borrarlos.

## Agregar un sitio

1. Una clave para el sitio: `openssl rand -hex 32`.
2. Su entrada en `sites` de `~/form-relay/config.php`, con esa clave y un buzón para los
   envíos sin firma (opcional). `copy` y `number` solo si un formulario lo necesita:
   ```php
   <?php
   return [
       // …
       'sites' => [
           'misitio.com' => [
               'key' => '…',
               'to' => 'respaldo@misitio.com',
               'name' => 'Mi Sitio',
           ],
           'otrositio.com' => [    // ← sitio nuevo
               'key' => '…',
               'to' => 'respaldo@otrositio.com',
               'name' => 'Otro Sitio',
               'copy' => ['claims'],
               'number' => ['claims'],
           ],
       ],
   ];
   ```
   El `deploy/despliegue.md` de cada sitio trae su entrada ya armada.
3. En el build del sitio (`build.env` en el VPS, `.env` en local):
   `FORMS_RELAY_URL=https://relay.example.com/form.php` (la misma URL para todos) y
   `FORMS_RELAY_KEY=` la misma clave. Publicar.
4. Opcional: su plantilla en `~/form-relay/templates/misitio.com.html`, a partir de
   `email.html` (estilos en línea; `{{site}} {{subject}} {{intro}} {{rows}} {{outro}}`).

Cambiar la clave: en la tabla y en `build.env` a la vez, y publicar (las páginas ya
publicadas con la clave anterior reciben 403 hasta entonces).

## Probar

- El formulario del sitio, o
  `curl -H 'Origin: https://misitio.com' -H 'Content-Type: application/json' -d '{"form":"contact","subject":"Prueba","rows":[["Nombre","Ana"]],"reply_to":"tu@correo.com"}' https://relay.example.com/form.php`.
  Debe responder 201.
- 403: el dominio del `Origin` no está en la tabla (desde curl sin `Origin`, es lo
  esperado). Algunos hostings (ModSecurity) bloquean además el User-Agent de curl:
  probar con uno de navegador.
- Errores del envío: el `error_log` de la carpeta del relay (o cPanel → Errors), con el
  dominio y el formulario.
