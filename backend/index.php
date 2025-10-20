<?php
// index.php

// Headers para permitir CORS (si tu frontend está en un dominio diferente)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Prueba para mostrar la variable de entorno DB_DATABASE (para ver si hay alguna)
echo getenv('DB_DATABASE');

// Analizar la URL para el enrutamiento
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$requestMethod = $_SERVER['REQUEST_METHOD'];

// Enrutador simple
switch (true) {
    // Rutas de autenticación
    case strpos($requestUri, '/api/auth') !== false:
        require __DIR__ . '/routes/auth.php';
        break;

    // Rutas de tiendas
    case strpos($requestUri, '/api/shops') !== false:
        require __DIR__ . '/routes/shops.php';
        break;

    // Ruta no encontrada
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Ruta no encontrada']);
        break;
}