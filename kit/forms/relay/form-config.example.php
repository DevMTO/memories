<?php
// Configuración de form.php, una para todos los sitios. Copiar a
// ~/form-relay/config.php en el hosting del relay (fuera de public_html: tiene la
// contraseña del SMTP). Ver README.md.
return [
    // Cuenta del hosting del relay que envía todos los correos (cPanel → Email
    // Accounts → Connect Devices). 465 = TLS directo, 587 = STARTTLS. El nombre del
    // remitente es el del sitio.
    'smtp' => [
        'host' => 'mail.relay-domain.com',
        'port' => 465,
        'user' => 'no-reply@relay-domain.com',
        'pass' => '',
    ],

    // Zona horaria de los correlativos (el año del número).
    'timezone' => 'America/Lima',
    // Envíos por IP, sitio y formulario en la ventana (segundos). Los formularios con
    // copia a quien lo envía tienen el suyo, más bajo.
    'rate_limit' => ['max' => 5, 'window' => 600],
    'copy_rate_limit' => ['max' => 3, 'window' => 600],
    // true solo si los sitios están detrás de Cloudflare (proxy naranja).
    'trust_cloudflare' => false,

    // Dominio del sitio → cómo llegan sus formularios. El dominio vale también para
    // sus subdominios (www., editor. de la vista previa).
    //   key     clave del sitio (openssl rand -hex 32), la misma que FORMS_RELAY_KEY en
    //           el build del sitio: con ella el build firma el buzón elegido en /admin
    //           ("Datos de la empresa") y el relay solo envía a una dirección firmada.
    //   to      buzón (o lista) para los envíos sin firma (sitio sin clave, o sin correo
    //           en /admin). Opcional si el sitio tiene `key`.
    //   name    remitente y encabezado del correo (si no, el dominio).
    //   copy    formularios que envían copia a quien los llenó (al correo que escribió).
    //   number  formularios con número correlativo por año ({code}: 2026-00001…).
    'sites' => [
        'example.com' => ['key' => '', 'to' => 'info@example.com', 'name' => 'Mi Sitio'],
        'otro-ejemplo.com' => [
            'key' => '',
            'to' => 'respaldo@otro-ejemplo.com',
            'name' => 'Otro Sitio',
            'copy' => ['claims'],
            'number' => ['claims'],
        ],
    ],
];
