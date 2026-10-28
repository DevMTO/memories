<?php
/**
 * Formularios del sitio por correo, sin PocketBase (kit/forms/forms.ts con
 * `data-relay`). Para sitios estáticos en un hosting con PHP (cPanel): recibe el
 * formulario desde el navegador y lo envía por SMTP a la dirección de la
 * configuración. No guarda nada.
 *
 * A diferencia de relay.php (servidor → servidor, con clave), lo llama el
 * navegador: no hay secreto que proteger, así que el destinatario es fijo (en la
 * configuración, nunca en la solicitud), solo se aceptan los orígenes del sitio,
 * y hay trampa para bots y límite por IP.
 *
 * Responde como PocketBase, que es lo que entiende forms.ts: 201, 400 con
 * `data` (campos inválidos), 429 (demasiados envíos).
 *
 * Instalación y configuración: kit/forms/relay/README.md.
 */

header('Content-Type: application/json');

function respond(int $status, array $body = []): void
{
    http_response_code($status);
    echo json_encode($body ?: new stdClass());
    exit;
}

// ─── Configuración (fuera de public_html) ───────────────────
// FORM_RELAY_CONFIG o ~/form-relay/config.php. $HOME suele venir vacío con
// PHP-FPM/LiteSpeed en cPanel: se usa el home de la cuenta.
$configPath = getenv('FORM_RELAY_CONFIG') ?: '';
if (!$configPath) {
    $home = getenv('HOME') ?: '';
    if (!$home && function_exists('posix_getpwuid')) {
        $home = posix_getpwuid(posix_getuid())['dir'] ?? '';
    }
    $configPath = $home . '/form-relay/config.php';
}
if (!is_file($configPath)) {
    error_log("form relay: falta la configuración ($configPath)");
    respond(500, ['message' => 'Formulario sin configurar.']);
}
$config = require $configPath;

// ─── Origen (CORS) ─────────────────────────────────────────
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (!in_array($origin, $config['allowed_origins'] ?? [], true)) {
    respond(403, ['message' => 'Origen no permitido.']);
}
header("Access-Control-Allow-Origin: $origin");
header('Vary: Origin');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Max-Age: 86400');
    respond(204);
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['message' => 'Método no permitido.']);
}

// ─── Datos ─────────────────────────────────────────────────
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    respond(400, ['message' => 'Solicitud inválida.']);
}
$form = $config['forms'][$input['_form'] ?? ''] ?? null;
if (!$form) {
    respond(400, ['message' => 'Formulario desconocido.']);
}
// Trampa para bots: el campo oculto `website` solo lo completan los bots.
if (!empty($input['website'])) {
    respond(201, ['id' => '']);
}

$errors = [];
$values = [];
foreach ($form['fields'] as $name => $field) {
    $value = trim((string) ($input[$name] ?? ''));
    $max = $field['max'] ?? 5000;
    if ($value === '' && !empty($field['required'])) {
        $errors[$name] = ['code' => 'validation_required', 'message' => 'Requerido.'];
    } elseif (mb_strlen($value) > $max) {
        $errors[$name] = ['code' => 'validation_max_text_constraint', 'message' => "Máximo $max caracteres."];
    } elseif ($value !== '' && ($field['type'] ?? '') === 'email' && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        $errors[$name] = ['code' => 'validation_invalid_email', 'message' => 'Correo inválido.'];
    }
    $values[$name] = $value;
}
if ($errors) {
    respond(400, ['message' => 'Datos inválidos.', 'data' => $errors]);
}

// ─── Límite por IP (archivos en el temporal del hosting) ───
// Detrás de Cloudflare la IP real viene en CF-Connecting-IP; sin Cloudflare
// delante ese encabezado lo puede inventar cualquiera (trust_cloudflare: false).
$ip = (!empty($config['trust_cloudflare']) && !empty($_SERVER['HTTP_CF_CONNECTING_IP']))
    ? $_SERVER['HTTP_CF_CONNECTING_IP']
    : ($_SERVER['REMOTE_ADDR'] ?? '');
$limit = $config['rate_limit'] ?? ['max' => 5, 'window' => 600];
$file = sys_get_temp_dir() . '/form-relay-' . hash('sha256', $ip . '|' . __DIR__) . '.json';
$now = time();
$hits = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn ($t) => $t > $now - $limit['window']));
if (count($hits) >= $limit['max']) {
    respond(429, ['message' => 'Demasiados envíos.']);
}
$hits[] = $now;
file_put_contents($file, json_encode($hits), LOCK_EX);

// ─── Correo ────────────────────────────────────────────────
require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

$esc = fn ($v) => htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
$rows = '';
foreach ($form['fields'] as $name => $field) {
    if ($values[$name] === '') continue;
    $rows .= '<tr><th align="left" valign="top">' . $esc($field['label'] ?? $name) . '</th>'
        . '<td style="white-space:pre-wrap">' . $esc($values[$name]) . '</td></tr>';
}

try {
    $smtp = $config['smtp'];
    $mail = new PHPMailer(true);
    // PHPMailer usa iso-8859-1 por defecto: sin esto los acentos llegan rotos.
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtp['user'];
    $mail->Password = $smtp['pass'];
    // 465: TLS directo; 587 (y otros): STARTTLS.
    $mail->Port = (int) ($smtp['port'] ?? 587);
    $mail->SMTPSecure = $mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
    // El remitente tiene que ser la cuenta que se autentica (si no, SPF/DKIM fallan).
    $mail->setFrom($smtp['user'], $smtp['from_name'] ?? '');
    foreach ((array) $config['to'] as $to) {
        $mail->addAddress($to);
    }
    if (!empty($values['email']) && filter_var($values['email'], FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($values['email'], $values['name'] ?? '');
    }
    $mail->isHTML(true);
    $mail->Subject = $form['subject'] . (!empty($values['name']) ? ': ' . $values['name'] : '');
    $mail->Body = '<table>' . $rows . '</table>';
    $mail->send();
} catch (\Throwable $e) {
    error_log('form relay: ' . ((isset($mail) && $mail->ErrorInfo) ? $mail->ErrorInfo : $e->getMessage()));
    respond(500, ['message' => 'No se pudo enviar.']);
}

respond(201, ['id' => '']);
