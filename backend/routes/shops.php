<?php
// routes/shops.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Verificacion del Token de usuario
function verifyToken() {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $arr = explode(" ", $authHeader);
    $token = $arr[1] ?? '';

    if (!$token) {
        http_response_code(401);
        echo json_encode(["message" => "Acceso denegado."]);
        exit();
    }

    try {
        $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
        // Devolvemos los datos del usuario para usarlos en la ruta
        return $decoded->data;
    } catch (Exception $e) {
        http_response_code(403);
        echo json_encode(["message" => "Acceso prohibido.", "error" => $e->getMessage()]);
        exit();
    }
}


$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));


switch (true) {
    // Registro de un local
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'POST':
        // Middleware de verificacion del token y obtener datos del usuario
        $userData = verifyToken();

        if (!empty($data->nombre) && !empty($data->direccion)) {
            $query = "INSERT INTO local (EmailUsuario, nombre, direccion) VALUES (:id_usuario, :nombre, :direccion)";
            $stmt = $db->prepare($query);

            // Vincular datos
            $stmt->bindParam(":nombre", $data->nombre);
            $stmt->bindParam(":direccion", $data->direccion);
            // El ID del usuario viene del token decodificado
            $stmt->bindParam(":id_usuario", $userData->id);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Local registrado con éxito', 'code' => 201]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al registrar el local', 'code' => 500]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
        break;

    // ver despues V V V

    // --- ELIMINAR UNA TIENDA (DELETE) ---
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'DELETE':
         $userData = verifyToken(); // Proteger la ruta

         // logica para nerds

         http_response_code(200);
         echo json_encode(['success' => true, 'message' => 'Local eliminado con éxito (lógica pendiente)', 'code' => 200]);
    break;

    // --- OBTENER TODOS LOS LOCALES (GET) ---
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken(); // Proteger la ruta

        $query = "SELECT * FROM local WHERE EmailUsuario = :email_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':email_usuario', $userData->email);
        $stmt->execute();

        $locals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($locals);
        break;

    // --- ACTUALIZAR UN LOCAL (PUT) ---
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'PUT':
        $userData = verifyToken(); // Proteger la ruta

        if (!empty($data->id) && !empty($data->nombre) && !empty($data->direccion)) {
            $query = "UPDATE local SET nombre = :nombre, direccion = :direccion WHERE IDLocal = :id_local AND EmailUsuario = :email_usuario";
            $stmt = $db->prepare($query);

            // Vincular datos
            $stmt->bindParam(":nombre", $data->nombre);
            $stmt->bindParam(":direccion", $data->direccion);
            $stmt->bindParam(":id_local", $data->id);
            $stmt->bindParam(":email_usuario", $userData->email);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Local actualizado con éxito', 'code' => 200]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al actualizar el local', 'code' => 500]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
        break;
}