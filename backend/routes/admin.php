<?php
// routes/auth.php

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

// Rutas de autenticación
switch (true) {
    // Editar usuario
    case preg_match('%/api/admin/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Cambiar de contraseña
    case preg_match('%/api/admin/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Eliminar usuario
    case preg_match('%/api/admin/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Obtener reportes de locales
    case preg_match('%/api/admin/reports?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
        
        // se necesita una id en la tabla de reportes
        try {
            $query = "
                SELECT 
                    r.id_reporte AS id_reporte,
                    r.id_local,
                    l.nombre_local AS nombre_local,
                    r.razon,
                    r.id_usuario,
                    u.nombre_usuario AS nombre_usuario
                FROM reportes r
                INNER JOIN local l ON r.id_local = l.id_local
                INNER JOIN usuario u ON r.id_usuario = u.id_usuario
                ORDER BY r.id_local DESC
            ";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $reportes = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $reportes,
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener los reportes',
                'error' => $e->getMessage(),
            ]);
        }   
    break;

    // Eliminar reporte de local
    case preg_match('%/api/admin/reports/%', $requestUri) && $requestMethod == 'DELETE':
        $userData = verifyToken(); // Verifica que el usuario tenga acceso
        $id_reporte = basename($requestUri);

        try {
            $stmt = $db->prepare('DELETE FROM reportes WHERE id_reporte = :id_reporte');
            $stmt->bindParam(':id_reporte', $id_reporte, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Reporte eliminado con éxito']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Reporte no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error al eliminar el reporte', 'error' => $e->getMessage()]);
        }
    break;

    // Obtener todas las reseñas reportadas
    case preg_match('%/api/admin/reports/reviews?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken(); // Verifica que el usuario tenga acceso
        try {
            $query = "
                SELECT
                    id_resena,
                    id_usuario,
                    comentario,
                    id_local,
                    estrellas,
                    likes,
                    reportado
                FROM resenas
                WHERE reportado = 1
                ORDER BY id_resena DESC
            ";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $resenasReportadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $resenasReportadas,
            ]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al obtener las reseñas reportadas',
                'error' => $e->getMessage(),
            ]);
        }
    break;

}