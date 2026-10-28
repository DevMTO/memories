<?php
// Configuración de form.php. Copiar a ~/form-relay/config.php en el hosting
// (fuera de public_html: tiene la contraseña del SMTP). Ver README.md.
return [
    // Orígenes del sitio que pueden enviar (exactos, con https y sin / final).
    'allowed_origins' => ['https://example.com', 'https://www.example.com'],

    // Adónde llegan los formularios (una dirección o varias).
    'to' => 'info@example.com',

    // Cuenta de correo del hosting que envía (cPanel → Email Accounts →
    // Connect Devices). 465 = TLS directo, 587 = STARTTLS.
    'smtp' => [
        'host' => 'mail.example.com',
        'port' => 465,
        'user' => 'no-reply@example.com',
        'pass' => '',
        'from_name' => 'Sitio web',
    ],

    // Envíos por IP en la ventana (segundos).
    'rate_limit' => ['max' => 5, 'window' => 600],
    // true solo si el sitio está detrás de Cloudflare (proxy naranja).
    'trust_cloudflare' => false,

    // Formularios aceptados: data-collection del <form> → campos (en el orden del
    // correo). Los campos que no estén aquí se ignoran.
    'forms' => [
        'leads' => [
            'subject' => 'Nueva solicitud de contacto',
            'fields' => [
                'name' => ['label' => 'Nombre', 'required' => true, 'max' => 200],
                'email' => ['label' => 'Correo', 'required' => true, 'type' => 'email', 'max' => 200],
                'phone' => ['label' => 'Teléfono', 'max' => 50],
                'interest' => ['label' => 'Interés', 'max' => 200],
                'lang' => ['label' => 'Idioma', 'max' => 10],
                'message' => ['label' => 'Mensaje', 'max' => 5000],
            ],
        ],
    ],
];
