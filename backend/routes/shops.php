<?php
// routes/shops.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// --- FUNCIÓN DE MIDDLEWARE PARA VERIFICAR TOKEN ---
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
    // --- REGISTRAR UNA TIENDA (POST) ---
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'POST':
        // Middleware: Verificar el token y obtener datos del usuario
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

    // --- ELIMINAR UNA TIENDA (DELETE) ---
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'DELETE':
         $userData = verifyToken(); // Proteger la ruta

         // Aquí iría la lógica para eliminar, por ejemplo, usando un ID de la URL o del body
         // $id_local = $data->id;
         // DELETE FROM local WHERE IDLocal = ? AND EmailUsuario = ? (para asegurar que solo el dueño borra)

         http_response_code(200);
         echo json_encode(['success' => true, 'message' => 'Local eliminado con éxito (lógica pendiente)', 'code' => 200]);
        break;

    // Aquí podrías agregar las rutas GET y PUT de manera similar
}