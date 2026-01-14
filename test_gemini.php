<?php

// Charger les variables d'env
$env_file = __DIR__ . '/.env';
if (file_exists($env_file)) {
    $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Test direkt
$apiKey = $_ENV['GEMINI_API_KEY'] ?? null;
$model = $_ENV['GEMINI_MODEL'] ?? 'models/gemini-2.5-flash:generateContent';

if (!$apiKey) {
    echo "❌ Erreur: GEMINI_API_KEY non défini dans .env\n";
    exit(1);
}

$prompt = <<<PROMPT
Tu es un support client professionnel pour une application SaaS.

Feedback du client :
"L'application est lente et bug souvent"

Note : 2/5

Consignes :
- Réponse polie et empathique
- Professionnelle
- Claire et concise
- En français
PROMPT;

$url = 'https://generativelanguage.googleapis.com/v1beta/' . $model
    . '?key=' . urlencode($apiKey);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'contents' => [
        [
            'parts' => [
                ['text' => $prompt],
            ],
        ],
    ],
]));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code !== 200) {
    echo "❌ Erreur HTTP $http_code:\n";
    echo $response . "\n";
    exit(1);
}

$data = json_decode($response, true);
if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
    $result = trim($data['candidates'][0]['content']['parts'][0]['text']);
    echo "✅ Succès !\n\n";
    echo "Réponse Gemini:\n";
    echo "-------------------\n";
    echo $result . "\n";
    echo "-------------------\n";
} else {
    echo "❌ Format réponse inattendu:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n";
}
