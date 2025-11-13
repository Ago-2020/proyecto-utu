<?php
// routes/notification.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

// Decodificar el cuerpo de la petición JSON
$data = json_decode(file_get_contents("php://input"));

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

// Rutas de administración
switch (true) {
    // Ver notificaciones
    case preg_match('%/api/notifications/?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
        $id_usuario = $userData->id;

        $query = "SELECT id_notificacion, titulo, mensaje, leida, fecha_creacion 
                FROM notificaciones 
                WHERE id_usuario = :id_usuario 
                ORDER BY fecha_creacion DESC";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();

        $notificaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $notificaciones]);
    break;


    // Crear nueva notificacion
    case preg_match('%/api/notifications/?$%', $requestUri) && $requestMethod == 'POST':
        $userData = verifyToken();
        $data = json_decode(file_get_contents("php://input"), true);

        $id_usuario = $data['id_usuario'] ?? null;
        $titulo = trim($data['titulo'] ?? '');
        $mensaje = trim($data['mensaje'] ?? '');

        if (!$id_usuario || !$titulo || !$mensaje) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos incompletos.']);
            break;
        }

        $stmt = $db->prepare("INSERT INTO notificaciones (id_usuario, titulo, mensaje) VALUES (:id_usuario, :titulo, :mensaje)");
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':titulo', $titulo);
        $stmt->bindParam(':mensaje', $mensaje);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Notificación creada correctamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al crear notificación.']);
        }
    break;


    // Marcar como leido
    case preg_match('%/api/notifications/(\d+)/read$%', $requestUri, $matches) && $requestMethod == 'PUT':
        $userData = verifyToken();
        $id_usuario = $userData->id;
        $id_notificacion = $matches[1];

        $stmt = $db->prepare("UPDATE notificaciones SET leida = 1 WHERE id_notificacion = :id_notificacion AND id_usuario = :id_usuario");
        $stmt->bindParam(':id_notificacion', $id_notificacion);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Notificación marcada como leída.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se encontró la notificación o no pertenece al usuario.']);
        }
    break;


    // Eliminar notificacion
    case preg_match('%/api/notifications/(\d+)$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $userData = verifyToken();
        $id_usuario = $userData->id;
        $id_notificacion = $matches[1];

        $stmt = $db->prepare("DELETE FROM notificaciones WHERE id_notificacion = :id_notificacion AND id_usuario = :id_usuario");
        $stmt->bindParam(':id_notificacion', $id_notificacion);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Notificación eliminada correctamente.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'No se pudo eliminar la notificación.']);
        }
    break;
}
