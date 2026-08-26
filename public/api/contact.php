<?php
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ── CORS ──
$allowed = 'https://4funsoda.pl';
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === $allowed) {
    header("Access-Control-Allow-Origin: $allowed");
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ── Rate limiting ──
$ip   = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$lock = sys_get_temp_dir() . '/4funsoda_rate_' . md5($ip);
$now  = time();
if (file_exists($lock)) {
    $data = json_decode(file_get_contents($lock), true);
    $data = array_filter($data, fn($t) => $t > $now - 900);
    if (count($data) >= 10) {
        http_response_code(429);
        echo json_encode(['ok' => false, 'error' => 'Zbyt wiele wiadomości. Spróbuj za 15 minut.']);
        exit;
    }
} else {
    $data = [];
}
$data[] = $now;
file_put_contents($lock, json_encode($data));

// ── Tylko POST ──
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

// ── Konfiguracja ──
$mailTo = '4funsoda@4funsoda.pl';

// ── Odczyt danych ──
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Nieprawidłowe dane.']);
    exit;
}

function clean($str, $max = 300) {
    return mb_substr(trim(preg_replace('/\s+/', ' ', strip_tags($str ?? ''))), 0, $max);
}

$fullName = clean($input['fullName'] ?? '', 120);
$email    = clean($input['email'] ?? '', 160);
$phone    = clean($input['phone'] ?? '', 80);
$message  = clean($input['message'] ?? '', 5000);

if (!$fullName || !$email || !$phone || !$message) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Uzupełnij wszystkie pola.']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Podaj poprawny adres e-mail.']);
    exit;
}

// ── Budowanie emaila ──
$subject = "=?UTF-8?B?" . base64_encode("4FUNSODA — Kontakt: $fullName") . "?=";
$body = "
<div style='font-family:Arial,sans-serif;line-height:1.5'>
  <h2>Nowa wiadomość z formularza kontaktowego</h2>
  <p><strong>Imię i nazwisko:</strong> " . htmlspecialchars($fullName, ENT_QUOTES, 'UTF-8') . "</p>
  <p><strong>E-mail:</strong> " . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . "</p>
  <p><strong>Telefon:</strong> " . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . "</p>
  <hr />
  <p style='white-space:pre-wrap'>" . htmlspecialchars($message, ENT_QUOTES, 'UTF-8') . "</p>
</div>
";

// ── Wysyłka przez mail() ──
// Jeśli hosting wymaga nadawcy będącego kontem na serwerze, zmień adres w "From".
$headers  = "From: 4FUNSODA <4funsoda@4funsoda.pl>\r\n";
$headers .= "Reply-To: " . filter_var($email, FILTER_SANITIZE_EMAIL) . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";

$sent = @mail($mailTo, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Nie udało się wysłać wiadomości. Spróbuj ponownie.']);
}
