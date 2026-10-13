<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Allow: POST');
    respond(405, ['error' => 'Only POST requests are supported.']);
}

$contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
if ($contentType !== 'application/json') {
    respond(415, ['error' => 'Send the form as JSON.']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false) {
    respond(400, ['error' => 'Unable to read the request body.']);
}
if (strlen($rawBody) > 16384) {
    respond(413, ['error' => 'The request is too large.']);
}

try {
    $payload = json_decode($rawBody, true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException) {
    respond(400, ['error' => 'The request body must contain valid JSON.']);
}

if (!is_array($payload) || array_is_list($payload)) {
    respond(400, ['error' => 'The request body must be a JSON object.']);
}

$name = is_string($payload['name'] ?? null) ? trim($payload['name']) : '';
$email = is_string($payload['email'] ?? null) ? trim($payload['email']) : '';
$phone = is_string($payload['phone'] ?? null) ? trim($payload['phone']) : '';
$subject = is_string($payload['subject'] ?? null) ? trim($payload['subject']) : '';
$message = is_string($payload['message'] ?? null) ? trim($payload['message']) : '';
$subjects = [
    'Full-time IT role',
    'Network operations',
    'System administration',
    'Junior web development',
    'Internship / work immersion',
    'Something else',
];

$errors = [];
$nameLength = preg_match_all('/./us', $name);
$messageLength = preg_match_all('/./us', $message);

if ($nameLength === false || $nameLength < 2 || $nameLength > 120) {
    $errors[] = 'Name must be between 2 and 120 characters.';
}
if (strlen($email) > 254 || filter_var($email, FILTER_VALIDATE_EMAIL) === false) {
    $errors[] = 'Enter a valid email address.';
}
if ($phone !== '' && (strlen($phone) > 32 || !preg_match('/^[+]?[\d\s().-]{7,32}$/D', $phone))) {
    $errors[] = 'Enter a valid phone number.';
}
if (!in_array($subject, $subjects, true)) {
    $errors[] = 'Choose a valid subject.';
}
if ($messageLength === false || $messageLength < 20 || $messageLength > 1000) {
    $errors[] = 'Message must be between 20 and 1000 characters.';
}
if (($payload['consent'] ?? null) !== true) {
    $errors[] = 'Consent is required.';
}

if ($errors) {
    respond(422, ['error' => implode(' ', $errors)]);
}

$host = getenv('DB_HOST');
$port = getenv('DB_PORT') ?: '3306';
$database = getenv('DB_NAME');
$user = getenv('DB_USER');
$password = getenv('DB_PASSWORD');

if (!$host || !$database || !$user || !$password) {
    error_log('Contact API database configuration is incomplete.');
    respond(503, ['error' => 'The message service is not configured. Please try again later.']);
}

try {
    $pdo = new PDO(
        "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4",
        $user,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
    $statement = $pdo->prepare(
        'INSERT INTO contact_messages (name, email, phone, subject, message)
         VALUES (:name, :email, :phone, :subject, :message)'
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'phone' => $phone !== '' ? $phone : null,
        'subject' => $subject,
        'message' => $message,
    ]);
} catch (PDOException $exception) {
    error_log('Contact API database error: ' . $exception->getMessage());
    respond(503, ['error' => 'Unable to save your message right now. Please try again later.']);
}

respond(201, ['message' => 'Message received.']);
