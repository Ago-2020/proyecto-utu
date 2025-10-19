<?php
// routes/auth.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

// Decodificar el cuerpo de la petición JSON
$data = json_decode(file_get_contents("php://input"));

// Rutas de autenticación
switch (true) {
    // Editar usuario
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Cambiar de contraseña
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Eliminar usuario
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'POST':
        
    break;
}