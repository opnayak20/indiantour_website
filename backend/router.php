<?php
// backend/router.php - Development Router for PHP Built-in Server (F3)

// 1. CORS Preflight Handling (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    $envFile = __DIR__ . '/.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (strpos($line, '=') !== false) {
                list($k, $v) = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v, " \t\n\r\0\x0B\"'");
                if (getenv($k) === false) putenv("{$k}={$v}");
            }
        }
    }

    $allowedOriginsEnv = getenv('ALLOWED_ORIGINS');
    $allowedOrigins = $allowedOriginsEnv
        ? array_map('trim', explode(',', $allowedOriginsEnv))
        : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000', 'http://localhost:5174', 'http://127.0.0.1:5174', 'http://localhost:5175', 'http://127.0.0.1:5175'];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin && in_array($origin, $allowedOrigins, true)) {
        header("Access-Control-Allow-Origin: " . $origin);
        header("Access-Control-Allow-Credentials: true");
        header("Vary: Origin");
    }

    header("Access-Control-Max-Age: 86400");
    header("Content-Type: application/json; charset=UTF-8");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
    http_response_code(200);
    exit();
}

$rawUri = $_SERVER['REQUEST_URI'] ?? '/';
$uriPath = parse_url($rawUri, PHP_URL_PATH);
$uri = rawurldecode($uriPath);

function send404($requestedUri) {
    http_response_code(404);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        "status" => false,
        "message" => "Endpoint not found: " . $requestedUri
    ], JSON_UNESCAPED_SLASHES);
    exit();
}

// Path traversal guard
if (strpos($uri, '..') !== false || strpos($uri, '\\') !== false) {
    send404($uri);
}

$baseDir = realpath(__DIR__);
$targetCandidate = __DIR__ . $uri;

// Resolve candidate using realpath if candidate exists
$resolvedCandidate = realpath($targetCandidate);
if ($resolvedCandidate !== false && strpos($resolvedCandidate, $baseDir) !== 0) {
    send404($uri);
}

$cleanUri = ltrim($uri, '/');
$segments = explode('/', $cleanUri);
$firstSegment = strtolower($segments[0] ?? '');
$extension = strtolower(pathinfo($cleanUri, PATHINFO_EXTENSION));

// Sensitive file & directory guard:
// Never serve config/, helpers/, data/, *.sql, *.sqlite, *.log, *.env, CLI tools, or hidden files
if (
    in_array($firstSegment, ['config', 'helpers', 'data'], true) ||
    in_array($extension, ['sql', 'sqlite', 'log', 'env'], true) ||
    in_array(strtolower(basename($cleanUri)), ['test_db.php', 'seed_destinations.php', 'cli_create_admin.php', 'destinations_seed.json'], true) ||
    strpos($firstSegment, '.') === 0 ||
    strpos(basename($cleanUri), '.') === 0
) {
    send404($uri);
}

// Execution guard: Do not execute .php files inside /uploads/
if ($firstSegment === 'uploads' && $extension === 'php') {
    send404($uri);
}

// 4. Root URL: / -> require index.php
if ($uri === '/' || $uri === '') {
    require __DIR__ . '/index.php';
    exit();
}

// 2. Existing static file or existing script inside backend/
if (is_file($targetCandidate)) {
    return false;
}

// 3. If URI . '.php' exists -> require it (allows /api/auth without extension)
$phpCandidate = $targetCandidate . '.php';
if (is_file($phpCandidate)) {
    $resolvedPhp = realpath($phpCandidate);
    if ($resolvedPhp !== false && strpos($resolvedPhp, $baseDir) === 0) {
        require $phpCandidate;
        exit();
    }
}

// 5. Otherwise 404 JSON
send404($uri);
