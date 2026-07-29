<?php
header('Content-Type: application/json; charset=utf-8');

function fetch_url($url) {
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 8,
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        $body = curl_exec($ch);
        curl_close($ch);
        return $body === false ? false : $body;
    }
    return @file_get_contents($url);
}

function serve_cache_or_error($cacheFile, $errorMessage, $status = 502) {
    if (file_exists($cacheFile)) {
        header('X-Reviews-Source: stale-cache');
        readfile($cacheFile);
        exit;
    }
    http_response_code($status);
    echo json_encode(['error' => $errorMessage]);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'config.php no encontrado. Copia config.example.php a config.php y añade tus credenciales.']);
    exit;
}

$config = require $configPath;
$apiKey = $config['google_places_api_key'] ?? '';
$placeId = $config['place_id'] ?? '';

if (!$apiKey || !$placeId || strpos($apiKey, 'TU_') === 0 || strpos($placeId, 'TU_') === 0) {
    http_response_code(500);
    echo json_encode(['error' => 'Falta configurar google_places_api_key o place_id en config.php']);
    exit;
}

$cacheDir = __DIR__ . '/cache';
if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0755, true);
}
$cacheFile = $cacheDir . '/google_reviews.json';
$cacheTtl = 6 * 60 * 60; // 6 horas

if (file_exists($cacheFile) && (time() - filemtime($cacheFile) < $cacheTtl)) {
    header('X-Reviews-Source: cache');
    readfile($cacheFile);
    exit;
}

$url = 'https://maps.googleapis.com/maps/api/place/details/json?' . http_build_query([
    'place_id' => $placeId,
    'fields'   => 'name,rating,user_ratings_total,reviews,url',
    'language' => 'es',
    'key'      => $apiKey,
]);

$response = fetch_url($url);

if ($response === false) {
    serve_cache_or_error($cacheFile, 'No se pudo contactar la API de Google Places.');
}

$data = json_decode($response, true);

if (!isset($data['status']) || $data['status'] !== 'OK') {
    serve_cache_or_error($cacheFile, 'Google Places respondió con error: ' . ($data['status'] ?? 'desconocido'));
}

$result = $data['result'];

$reviews = array_map(function ($r) {
    return [
        'author_name'   => $r['author_name'] ?? '',
        'profile_photo' => $r['profile_photo_url'] ?? '',
        'rating'        => $r['rating'] ?? null,
        'relative_time' => $r['relative_time_description'] ?? '',
        'text'          => $r['text'] ?? '',
        'time'          => $r['time'] ?? 0,
    ];
}, $result['reviews'] ?? []);

usort($reviews, fn($a, $b) => $b['time'] <=> $a['time']);

$output = [
    'name'               => $result['name'] ?? '',
    'rating'             => $result['rating'] ?? null,
    'user_ratings_total' => $result['user_ratings_total'] ?? null,
    'maps_url'           => $result['url'] ?? '',
    'reviews'            => $reviews,
    'fetched_at'         => date('c'),
];

file_put_contents($cacheFile, json_encode($output, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
header('X-Reviews-Source: live');
echo json_encode($output, JSON_UNESCAPED_UNICODE);
