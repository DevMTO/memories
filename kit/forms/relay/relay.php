<?php
/**
 * Relay de correo servidor → servidor: recibe {to, subject, html, text?,
 * replyTo?, attachments?} con la clave X-API-Key y lo envía por el SMTP del
 * hosting (PHPMailer). Para backends en servidores que bloquean el SMTP saliente
 * (p. ej. DigitalOcean): PocketBase lo usa con MAIL_RELAY_URL / MAIL_RELAY_KEY
 * (kit/pocketbase/forms/hooks/leads.pb.js).
 *
 * No lo llama el navegador: para formularios del sitio sin backend, form.php.
 * Instalación y configuración: kit/forms/relay/README.md.
 */

// ─── Load Config ───────────────────────────────────────────
// Si las variables no están en el entorno, se cargan de ~/mail-relay/config.php
// (fuera de public_html; hace putenv() de RELAY_API_KEY y SMTP_*).
// $HOME is frequently empty under cPanel PHP-FPM/LiteSpeed, so fall back to the
// account's home directory via POSIX before giving up.
if (!getenv('RELAY_API_KEY')) {
    $home = getenv('HOME') ?: '';
    if (!$home && function_exists('posix_getpwuid')) {
        $home = posix_getpwuid(posix_getuid())['dir'] ?? '';
    }
    if ($home && file_exists($home . '/mail-relay/config.php')) {
        require $home . '/mail-relay/config.php';
    }
}

// This endpoint is called server-to-server (backend → relay), never from a
// browser, so no CORS headers or OPTIONS preflight handling are needed.
header('Content-Type: application/json');

// ─── Security ──────────────────────────────────────────────
$API_KEY = getenv('RELAY_API_KEY') ?: '';
if (empty($API_KEY)) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'RELAY_API_KEY not configured']);
    exit;
}
$providedKey = $_SERVER['HTTP_X_API_KEY'] ?? '';

// hash_equals: constant-time compare, avoids leaking the key via timing.
if (!hash_equals($API_KEY, $providedKey)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Invalid API key']);
    exit;
}

// ─── Validate Request ──────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// ─── Parse Payload ─────────────────────────────────────────
// NOTE: `to`/`subject`/`html` are relayed verbatim with no recipient allowlist
// or rate limit — anyone holding RELAY_API_KEY can send to any address. Keep the
// key secret (server-level config, never committed) and rotate it if leaked.
$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['to']) || !isset($input['subject']) || !isset($input['html'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: to, subject, html']);
    exit;
}

// ─── SMTP Configuration ────────────────────────────────────
// PLACEHOLDERS — replace once the mailbox exists. The account need NOT be a
// cPanel mailbox: any SMTP server works. Two common setups:
//   cPanel mailbox: HOST=mail.your-domain.com  USER=noreply@your-domain.com
//   Gmail:          HOST=smtp.gmail.com        USER=you@gmail.com  PASS=<app password>
// SMTP_FROM must match the authenticated account's domain, or SPF/DKIM fails
// and mail is flagged as spam.
$SMTP_HOST = getenv('SMTP_HOST') ?: 'mail.your-domain.com';
$SMTP_PORT = getenv('SMTP_PORT') ?: 587;
$SMTP_USER = getenv('SMTP_USER') ?: 'noreply@your-domain.com';
$SMTP_PASS = getenv('SMTP_PASS') ?: '';
$SMTP_FROM = getenv('SMTP_FROM') ?: 'noreply@your-domain.com';

// ─── Send Email ────────────────────────────────────────────
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

try {
    $mail = new PHPMailer(true);

    // PHPMailer defaults CharSet to iso-8859-1. Our subjects/bodies are UTF-8
    // (e.g. "electrónico"), so without this the accented bytes get labelled as
    // Latin-1 and clients render mojibake ("electrÃ³nico"), most visibly in the
    // Subject header's RFC 2047 encoded-word.
    $mail->CharSet = PHPMailer::CHARSET_UTF8;

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USER;
    $mail->Password = $SMTP_PASS;
    // Port 465 uses implicit TLS (SMTPS); 587 (and others) use STARTTLS.
    $mail->SMTPSecure = ((int) $SMTP_PORT === 465)
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $SMTP_PORT;

    // Sender — parse "Name <email>" or plain "email" format
    if (preg_match('/^(?<name>.+)\s*<(?<email>[^>]+)>$/', $SMTP_FROM, $m)) {
        $mail->setFrom($m['email'], trim($m['name'], '"\''));
    } else {
        $mail->setFrom($SMTP_FROM);
    }

    // Recipient
    $mail->addAddress($input['to']);

    // Optional Reply-To (e.g. the consumer's address on a claim notice)
    if (!empty($input['replyTo'])) {
        $mail->addReplyTo($input['replyTo']);
    }

    // Content
    $mail->isHTML(true);
    $mail->Subject = $input['subject'];
    $mail->Body = $input['html'];

    if (isset($input['text'])) {
        $mail->AltBody = $input['text'];
    }

    // Adjuntos en memoria; no se aceptan rutas ni URLs.
    $attachments = $input['attachments'] ?? [];
    if (!is_array($attachments) || count($attachments) > 1) {
        throw new \RuntimeException('Only one PDF attachment is supported');
    }
    foreach ($attachments as $attachment) {
        $encoded = $attachment['content'] ?? '';
        if (!is_string($encoded) || strlen($encoded) > 6990508) {
            throw new \RuntimeException('Attachment exceeds 5 MB');
        }
        $content = base64_decode($encoded, true);
        if ($content === false || strlen($content) > 5242880 || substr($content, 0, 5) !== '%PDF-') {
            throw new \RuntimeException('Invalid PDF attachment');
        }
        $filename = preg_replace('/[^a-zA-Z0-9._ -]/', '_', $attachment['filename'] ?? 'comprobante.pdf');
        $mail->addStringAttachment($content, substr($filename, 0, 120), 'base64', 'application/pdf');
    }
    $mail->send();

    error_log("Email relay: sent to {$input['to']} - Subject: {$input['subject']}");

    http_response_code(200);
    echo json_encode(['success' => true, 'message' => 'Email sent successfully', 'attachmentsSent' => count($attachments), 'messageId' => $mail->getLastMessageID()]);

} catch (\Throwable $e) {
    // PHPMailer sets ErrorInfo; other failures (e.g. a bad `to`) only carry a
    // message. Prefer ErrorInfo, fall back to the exception message.
    $detail = (isset($mail) && $mail->ErrorInfo) ? $mail->ErrorInfo : $e->getMessage();
    error_log("Email relay error: {$detail}");

    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Failed to send email: ' . $detail]);
}
