<?php
// index.php

// Headers para permitir CORS (si tu frontend está en un dominio diferente)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once __DIR__ . '/vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

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

    // Rutas de usuarios
    case strpos($requestUri, '/api/users') !== false:
        require __DIR__ . '/routes/users.php';
        break;

    // Rutas de administración
    case strpos($requestUri, '/api/admin') !== false:
        require __DIR__ . '/routes/admin.php';
        break;

    // Rutas de notifaciones
    case strpos($requestUri, '/api/notifications') !== false:
        require __DIR__ . '/routes/notifications.php';
        break;

    // Ruta para obtener imágenes
    case strpos($requestUri, '/getimg.php') !== false:
        require __DIR__ . '/getimg.php';
        break;

    // Ruta no encontrada
    default:
        http_response_code(404);
        echo json_encode(['message' => 'Ruta no encontrada']);
        break;
}