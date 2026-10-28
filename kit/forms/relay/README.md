# Relays de correo en un hosting con PHP (cPanel)

Dos scripts PHP para enviar correo por el SMTP del hosting compartido. Usan PHPMailer
(`composer install` en esta carpeta, o subir `vendor/` ya armado).

| Script | Lo llama | Para qué |
|---|---|---|
| `form.php` | el navegador (`kit/forms/forms.ts` con `data-relay`) | Formularios de un sitio estático sin PocketBase: llegan por correo y no se guardan |
| `relay.php` | un servidor (PocketBase con `MAIL_RELAY_URL`) | Servidores que bloquean el SMTP saliente (p. ej. DigitalOcean) |

Los formularios no generan carga que importe: cada envío es una solicitud chica más un
correo, con trampa para bots y límite por IP. Con PocketBase en el VPS, el correo ya sale
directo al SMTP del hosting (puertos 465/587); el relay solo hace falta si el proveedor del
VPS bloquea esos puertos.

## Instalación (cPanel)

1. Un subdominio solo para esto (p. ej. `relay.example.com`). Si el dominio principal
   tiene WordPress, sus redirecciones no lo alcanzan. Permisos de la carpeta: **755**.
   PHP 8.1 o más (MultiPHP Manager).
2. Subir `form.php` y/o `relay.php`, `composer.json` y `vendor/`.
3. Configuración **fuera de `public_html`** (tiene la contraseña del SMTP):
   - `form.php`: copiar `form-config.example.php` a `~/form-relay/config.php` y
     completarlo: orígenes del sitio, destinatario, cuenta SMTP y formularios aceptados.
   - `relay.php`: copiar `mail-config.example.php` a `~/mail-relay/config.php`, con
     `RELAY_API_KEY` (`openssl rand -hex 32`). La misma clave va en `MAIL_RELAY_KEY` del
     servidor que lo llama, con `MAIL_RELAY_URL=https://relay.example.com/relay.php`.
4. El remitente es la cuenta que se autentica. Si no coincide, SPF/DKIM fallan y el
   correo termina en spam.

## Probar

- `form.php`: el formulario del sitio, o
  `curl -H 'Origin: https://example.com' -H 'Content-Type: application/json' -d '{"_form":"leads","name":"Prueba","email":"tu@correo.com"}' https://relay.example.com/form.php`.
  Debe responder 201.
- Si responde 403 desde curl sin `Origin`, es lo esperado. Algunos hostings (ModSecurity)
  bloquean además el User-Agent de curl: probar con uno de navegador.
