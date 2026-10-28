<?php
// Configuración de relay.php. Copiar a ~/mail-relay/config.php en el hosting
// (fuera de public_html). RELAY_API_KEY: `openssl rand -hex 32`; la misma va en
// MAIL_RELAY_KEY del servidor que lo llama.
putenv('RELAY_API_KEY=');
putenv('SMTP_HOST=mail.example.com');
putenv('SMTP_PORT=465');
putenv('SMTP_USER=no-reply@example.com');
putenv('SMTP_PASS=');
putenv('SMTP_FROM=Sitio web <no-reply@example.com>');
