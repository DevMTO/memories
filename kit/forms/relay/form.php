<?php
/**
 * Relay de formularios por correo para sitios estáticos (kit/forms/forms.ts con
 * `data-relay`): uno solo, en un hosting con PHP (cPanel), para todos los sitios.
 *
 * Cada sitio arma su correo (asunto, textos y filas, en su idioma) y lo manda desde
 * el navegador; este script solo decide adónde va y lo envía. Como lo llama el
 * navegador, no hay clave secreta, así que:
 * - El destinatario nunca lo elige la solicitud. El sitio sale de la tabla (dominio
 *   del `Origin`). El buzón lo elige el sitio ("Datos de la empresa" en /admin): el
 *   build lo escribe en el formulario firmado con la clave del sitio (`key`, que solo
 *   tienen el build y este relay), y aquí se envía a esa dirección solo si la firma
 *   es válida. Sin firma, al buzón de la tabla (`to`).
 * - Lo que llega es texto: se escapa y se pone en la plantilla HTML del servidor
 *   (`templates/<dominio>.html` junto a la configuración, o `email.html`). Nadie puede
 *   meter su propio HTML en un correo enviado desde aquí.
 * - La copia a quien lo envía (`reply_to`) solo sale en los formularios que la tabla
 *   permite (`copy`), con un límite por IP más bajo.
 * - `{code}`: número correlativo por año (2026-00001…) en los formularios de `number`;
 *   `{date}`: fecha y hora del envío. Se reemplazan en el asunto, los textos y las filas.
 *
 * Recibe { form, subject, intro?, outro?, rows: [[etiqueta, valor]…], reply_to?,
 * copy?: { subject, intro?, outro? }, to?, sig?, website } y responde 201 (con `code` y
 * `emailed` si corresponde), 400 con `data` (campos inválidos), 403 o 429.
 * No guarda nada: el buzón es el registro. Ver kit/forms/relay/README.md.
 */

header('Content-Type: application/json');

const MAX_BODY = 100000;
const MAX_ROWS = 60;
const MAX_VALUE = 5000;
const MAX_LINE = 200;

function respond(int $status, array $body = []): void
{
    http_response_code($status);
    echo json_encode($body ?: new stdClass());
    exit;
}

// ─── Configuración (fuera de public_html) ───────────────────
// FORM_RELAY_CONFIG (entorno o SetEnv) o ~/form-relay/config.php. $HOME suele venir
// vacío con PHP-FPM/LiteSpeed en cPanel: se usa el home de la cuenta.
$configPath = getenv('FORM_RELAY_CONFIG') ?: ($_SERVER['FORM_RELAY_CONFIG'] ?? '');
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
$configDir = dirname($configPath);
date_default_timezone_set($config['timezone'] ?? 'America/Lima');

// ─── Sitio, por el origen (CORS) ───────────────────────────
// El dominio de la tabla vale también para sus subdominios (www., editor.).
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = strtolower((string) parse_url($origin, PHP_URL_HOST));
$sites = array_change_key_case($config['sites'] ?? [], CASE_LOWER);
$domain = null;
foreach (array_keys($sites) as $candidate) {
    if ($host !== '' && ($host === $candidate || str_ends_with($host, '.' . $candidate))) {
        $domain = (string) $candidate;
        break;
    }
}
if ($domain === null || !preg_match('#^https?://#', $origin)) {
    respond(403, ['message' => 'Origen no permitido.']);
}
$site = $sites[$domain];
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
$raw = file_get_contents('php://input');
if (strlen($raw) > MAX_BODY) {
    respond(400, ['message' => 'Solicitud demasiado grande.']);
}
$input = json_decode($raw, true);
if (!is_array($input)) {
    respond(400, ['message' => 'Solicitud inválida.']);
}
// Trampa para bots: el campo oculto `website` solo lo completan los bots.
if (!empty($input['website'])) {
    respond(201, ['id' => '']);
}

$form = (string) ($input['form'] ?? '');
if (!preg_match('/^[a-z0-9_-]{1,50}$/', $form)) {
    respond(400, ['message' => 'Formulario inválido.']);
}
$text = fn ($value, int $max) => is_scalar($value) ? mb_substr(trim((string) $value), 0, $max) : '';

$subject = $text($input['subject'] ?? '', MAX_LINE);
$intro = $text($input['intro'] ?? '', MAX_VALUE);
$outro = $text($input['outro'] ?? '', MAX_VALUE);
$rows = [];
foreach (array_slice(is_array($input['rows'] ?? null) ? $input['rows'] : [], 0, MAX_ROWS) as $row) {
    if (!is_array($row) || count($row) < 2) continue;
    $value = $text($row[1], MAX_VALUE);
    if ($value !== '') $rows[] = [$text($row[0], MAX_LINE), $value];
}
if ($subject === '' || !$rows) {
    respond(400, ['message' => 'Formulario vacío.']);
}
$replyTo = $text($input['reply_to'] ?? '', MAX_LINE);
if ($replyTo !== '' && !filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['message' => 'Correo inválido.', 'data' => ['email' => ['code' => 'validation_invalid_email', 'message' => 'Correo inválido.']]]);
}
// Destinatario: la dirección firmada por el build (sig = HMAC-SHA256 de la dirección
// con la clave del sitio) o, sin firma, el buzón de la tabla. Una firma que no
// coincide (página alterada, clave cambiada) se rechaza en vez de mandar a otro lado.
$signedTo = $text($input['to'] ?? '', MAX_LINE);
$sig = $text($input['sig'] ?? '', 128);
if ($signedTo !== '' || $sig !== '') {
    $key = (string) ($site['key'] ?? '');
    if ($key === '' || !hash_equals(hash_hmac('sha256', $signedTo, $key), $sig) || !filter_var($signedTo, FILTER_VALIDATE_EMAIL)) {
        error_log("form relay ($domain/$form): firma del destinatario inválida");
        respond(403, ['message' => 'Destino no válido.']);
    }
    $recipients = [$signedTo];
} else {
    $recipients = array_values(array_filter((array) ($site['to'] ?? [])));
}
if (!$recipients) {
    respond(400, ['message' => 'Formulario sin destino.']);
}

// Copia a quien lo envía: solo en los formularios que la tabla permite.
$copyAllowed = in_array($form, $site['copy'] ?? [], true);
$copy = $copyAllowed && $replyTo !== '' && is_array($input['copy'] ?? null)
    ? [
        'subject' => $text($input['copy']['subject'] ?? '', MAX_LINE) ?: $subject,
        'intro' => $text($input['copy']['intro'] ?? '', MAX_VALUE),
        'outro' => $text($input['copy']['outro'] ?? '', MAX_VALUE),
    ]
    : null;

// ─── Límite por IP (archivos en el temporal del hosting) ───
// Detrás de Cloudflare la IP real viene en CF-Connecting-IP; sin Cloudflare
// delante ese encabezado lo puede inventar cualquiera (trust_cloudflare: false).
$ip = (!empty($config['trust_cloudflare']) && !empty($_SERVER['HTTP_CF_CONNECTING_IP']))
    ? $_SERVER['HTTP_CF_CONNECTING_IP']
    : ($_SERVER['REMOTE_ADDR'] ?? '');
$limit = $copyAllowed
    ? ($config['copy_rate_limit'] ?? ['max' => 3, 'window' => 600])
    : ($config['rate_limit'] ?? ['max' => 5, 'window' => 600]);
$file = sys_get_temp_dir() . '/form-relay-' . hash('sha256', "$ip|$domain|$form|" . __DIR__) . '.json';
$now = time();
$hits = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
$hits = array_values(array_filter($hits, fn ($t) => $t > $now - $limit['window']));
if (count($hits) >= $limit['max']) {
    respond(429, ['message' => 'Demasiados envíos.']);
}
$hits[] = $now;
file_put_contents($file, json_encode($hits), LOCK_EX);

// ─── Número correlativo por año ────────────────────────────
// Un archivo por sitio, formulario y año junto a la configuración (fuera de
// public_html), con bloqueo para que dos envíos a la vez no repitan número.
$code = '';
if (in_array($form, $site['number'] ?? [], true)) {
    $dir = $config['data_dir'] ?? $configDir . '/data';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log("form relay: no se pudo crear $dir");
        respond(500, ['message' => 'No se pudo enviar.']);
    }
    $year = date('Y');
    $counter = fopen("$dir/$domain-$form-$year.txt", 'c+');
    if (!$counter || !flock($counter, LOCK_EX)) {
        error_log("form relay: no se pudo abrir el correlativo de $domain/$form");
        respond(500, ['message' => 'No se pudo enviar.']);
    }
    $number = (int) stream_get_contents($counter) + 1;
    ftruncate($counter, 0);
    rewind($counter);
    fwrite($counter, (string) $number);
    fflush($counter);
    flock($counter, LOCK_UN);
    fclose($counter);
    $code = $year . '-' . str_pad((string) $number, 5, '0', STR_PAD_LEFT);
}
$withCode = fn (string $value) => strtr($value, ['{code}' => $code, '{date}' => date('d/m/Y H:i')]);

// ─── Correo ────────────────────────────────────────────────
// Todo lo que vino en la solicitud se escapa: la plantilla es lo único con HTML.
$esc = fn ($v) => htmlspecialchars((string) $v, ENT_QUOTES, 'UTF-8');
$paragraphs = fn (string $value) => $value === ''
    ? ''
    : implode('', array_map(
        fn ($p) => '<p style="margin:0 0 12px">' . nl2br($esc(trim($p))) . '</p>',
        preg_split('/\n\s*\n/', $withCode($value))
    ));
$table = '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%">' . implode('', array_map(
    fn ($row) => '<tr><th align="left" valign="top" style="padding:6px 12px 6px 0;width:38%;color:#555;font-weight:600">'
        . $esc($withCode($row[0])) . '</th><td style="padding:6px 0">' . nl2br($esc($withCode($row[1]))) . '</td></tr>',
    $rows
)) . '</table>';
$plainRows = implode("\n", array_map(fn ($row) => $withCode($row[0]) . ': ' . $withCode($row[1]), $rows));

$templateFile = is_file("$configDir/templates/$domain.html") ? "$configDir/templates/$domain.html" : __DIR__ . '/email.html';
$template = (string) file_get_contents($templateFile);
$siteName = (string) ($site['name'] ?? $domain);
$render = fn (string $subject, string $intro, string $outro) => strtr($template, [
    '{{site}}' => $esc($siteName),
    '{{subject}}' => $esc($withCode($subject)),
    '{{intro}}' => $paragraphs($intro),
    '{{rows}}' => $table,
    '{{outro}}' => $paragraphs($outro),
]);
$plain = fn (string $intro, string $outro) => trim(implode("\n\n", array_filter([$withCode($intro), $plainRows, $withCode($outro)])));

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;

function send(array $smtp, string $fromName, string $to, string $subject, string $html, string $text, string $replyTo = ''): void
{
    $mail = new PHPMailer(true);
    // PHPMailer usa iso-8859-1 por defecto: sin esto los acentos llegan rotos.
    $mail->CharSet = PHPMailer::CHARSET_UTF8;
    $mail->isSMTP();
    $mail->Host = $smtp['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $smtp['user'];
    $mail->Password = $smtp['pass'];
    // 465: TLS directo; 587 (y otros): STARTTLS. `secure` => '' solo para probar con
    // un servidor SMTP local sin cifrado.
    $mail->Port = (int) ($smtp['port'] ?? 587);
    $mail->SMTPSecure = $smtp['secure'] ?? ($mail->Port === 465 ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS);
    $mail->SMTPAutoTLS = ($smtp['secure'] ?? null) !== '';
    // El remitente es la cuenta que se autentica (si no, SPF/DKIM fallan); el
    // nombre, el del sitio.
    $mail->setFrom($smtp['user'], $fromName);
    $mail->addAddress($to);
    if ($replyTo !== '') {
        $mail->addReplyTo($replyTo);
    }
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body = $html;
    $mail->AltBody = $text;
    try {
        $mail->send();
    } catch (\Throwable $e) {
        throw new RuntimeException($mail->ErrorInfo ?: $e->getMessage());
    }
}

// Al buzón del sitio: si no sale, el visitante ve el error y puede volver a enviarlo.
try {
    foreach ($recipients as $to) {
        send($config['smtp'], $siteName, $to, $withCode($subject), $render($subject, $intro, $outro), $plain($intro, $outro), $replyTo);
    }
} catch (\Throwable $e) {
    error_log("form relay ($domain/$form): " . $e->getMessage());
    respond(500, ['message' => 'No se pudo enviar.']);
}

// Copia a quien lo envió (p. ej. la hoja de reclamación al consumidor).
$emailed = false;
if ($copy) {
    try {
        send($config['smtp'], $siteName, $replyTo, $withCode($copy['subject']), $render($copy['subject'], $copy['intro'], $copy['outro']), $plain($copy['intro'], $copy['outro']), $recipients[0]);
        $emailed = true;
    } catch (\Throwable $e) {
        error_log("form relay ($domain/$form, copia): " . $e->getMessage());
    }
}

respond(201, $code !== '' ? ['id' => '', 'code' => $code, 'emailed' => $emailed] : ['id' => '']);
