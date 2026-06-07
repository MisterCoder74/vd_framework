<?php
/**
 * VD Framework 4 — openai_proxy.php
 * Secure server-side proxy for all OpenAI API calls.
 *
 * Replaces the unsafe fetch("key.ini") pattern of v3.
 * The API key NEVER leaves the server; the browser only talks to this file.
 *
 * Supported request types:
 *   - "chat"  → POST to /v1/chat/completions  (used by vd-chatbot)
 *   - "image" → POST to /v1/images/generations (used by vd-dalle)
 *
 * HOW TO CONFIGURE THE API KEY (choose one option):
 *
 *   Option A — Environment variable (recommended for production):
 *     Set OPENAI_API_KEY in your server / hosting panel / .htaccess:
 *       SetEnv OPENAI_API_KEY sk-...yourkey...
 *
 *   Option B — .env file OUTSIDE the webroot (recommended for local/shared hosting):
 *     Create a file one directory above your webroot named ".env":
 *       /home/youruser/.env          (webroot is /home/youruser/public_html/)
 *     Contents of .env:
 *       OPENAI_API_KEY=sk-...yourkey...
 *
 *   ⚠️  NEVER put key.ini or .env inside the webroot / public folder.
 *   ⚠️  NEVER commit API keys to version control.
 *
 * @version 4.0
 * @author  Vivacity Design — https://www.vivacitydesign.net
 */

/* -------------------------------------------------------------------------
   CORS headers — adjust the origin to your own domain in production.
------------------------------------------------------------------------- */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');           // Restrict to your domain in production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only POST allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

/* -------------------------------------------------------------------------
   Load API key
------------------------------------------------------------------------- */
function vd_getApiKey(): ?string {
    // 1. Environment variable (highest priority)
    $key = getenv('OPENAI_API_KEY');
    if ($key) return trim($key);

    // 2. .env file one level above webroot
    $envFile = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.env';
    if (file_exists($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            $line = trim($line);
            if (strpos($line, '#') === 0) continue;         // skip comments
            if (strpos($line, 'OPENAI_API_KEY=') === 0) {
                return trim(substr($line, strlen('OPENAI_API_KEY=')));
            }
        }
    }

    return null;
}

$apiKey = vd_getApiKey();
if (!$apiKey) {
    http_response_code(500);
    echo json_encode(['error' => 'OpenAI API key not configured on server. See openai_proxy.php for setup instructions.']);
    exit;
}

/* -------------------------------------------------------------------------
   Parse request body
------------------------------------------------------------------------- */
$rawBody = file_get_contents('php://input');
$input   = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE || !isset($input['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON or missing "type" field. Expected: {"type":"chat",...} or {"type":"image",...}']);
    exit;
}

$type = $input['type'];

/* -------------------------------------------------------------------------
   Build OpenAI request payload
------------------------------------------------------------------------- */
if ($type === 'chat') {
    // Chat completions — used by vd-chatbot
    $messages = $input['messages'] ?? [];
    $model    = $input['model']    ?? 'gpt-4';

    if (empty($messages) || !is_array($messages)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing or invalid "messages" array for type "chat"']);
        exit;
    }

    $payload  = json_encode([
        'model'    => $model,
        'messages' => $messages
    ]);
    $endpoint = 'https://api.openai.com/v1/chat/completions';

} elseif ($type === 'image') {
    // Image generation — used by vd-dalle
    $prompt  = $input['prompt']  ?? '';
    $size    = $input['size']    ?? '1024x1024';
    $quality = $input['quality'] ?? 'standard';
    $model   = $input['model']   ?? 'dall-e-3';

    if (empty(trim($prompt))) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing "prompt" for type "image"']);
        exit;
    }

    $payload  = json_encode([
        'model'   => $model,
        'prompt'  => $prompt,
        'n'       => 1,
        'size'    => $size,
        'quality' => $quality
    ]);
    $endpoint = 'https://api.openai.com/v1/images/generations';

} else {
    http_response_code(400);
    echo json_encode(['error' => "Unknown type \"$type\". Use \"chat\" or \"image\""]);
    exit;
}

/* -------------------------------------------------------------------------
   Forward to OpenAI via cURL
------------------------------------------------------------------------- */
$ch = curl_init($endpoint);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $payload,
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ],
    CURLOPT_TIMEOUT        => 90,      // 90 s — DALL-E can be slow
    CURLOPT_SSL_VERIFYPEER => true,
]);

$response  = curl_exec($ch);
$httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => 'Proxy connection error: ' . $curlError]);
    exit;
}

// Pass OpenAI's status code and body back to the client as-is.
http_response_code($httpCode);
echo $response;
