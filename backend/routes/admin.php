<?php
// routes/admin.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

// Decodificar el cuerpo de la petición JSON
$data = json_decode(file_get_contents("php://input"));

// Verificación del Token de usuario
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
        return $decoded->data;
    } catch (Exception $e) {
        http_response_code(403);
        echo json_encode(["message" => "Acceso prohibido.", "error" => $e->getMessage()]);
        exit();
    }
}

// Rutas de administración
switch (true) {
    // Obtener reportes de locales
    case preg_match('%/api/admin/reports?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
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
            echo json_encode(['success' => true, 'data' => $reportes]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al obtener los reportes', 'error' => $e->getMessage()]);
        }
    break;

    // Obtener todas las reseñas reportadas
    case preg_match('%/api/admin/reports/reviews?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
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
            echo json_encode(['success' => true, 'data' => $resenasReportadas]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al obtener las reseñas reportadas', 'error' => $e->getMessage()]);
        }
    break;

    // Quitar estado de reportado
    case preg_match('%/api/admin/reports/reviews/(\d+)$%', $requestUri, $matches) && $requestMethod == 'PUT':
        $userData = verifyToken();
        $id_resena = $matches[1];
        $stmt = $db->prepare("UPDATE resenas SET reportado = 0 WHERE id_resena = ?");
        if ($stmt->execute([$id_resena])) {
            echo json_encode(['success' => true, 'message' => 'Reseña marcada como no reportada']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la reseña']);
        }
    break;

    // Eliminar reseña
    case preg_match('%^/api/admin/reports/reviews/(\d+)/?$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $userData = verifyToken();
        $id_resena = $matches[1];

        $stmt = $db->prepare("DELETE FROM resenas WHERE id_resena = ?");
        if ($stmt->execute([$id_resena])) {
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Reseña eliminada correctamente']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'Reseña no encontrada']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al eliminar reseña']);
        }
    break;

    // Eliminar reporte de local
    case preg_match('%/api/admin/reports/%', $requestUri) && $requestMethod == 'DELETE':
        $userData = verifyToken();
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

    // Eliminar un local
    case preg_match('%/api/admin/shops/(\d+)$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $userData = verifyToken();
        $id_local = $matches[1];

        try {
            // Eliminar reportes asociados
            $stmtReportes = $db->prepare('DELETE FROM reportes WHERE id_local = :id_local');
            $stmtReportes->bindParam(':id_local', $id_local, PDO::PARAM_INT);
            $stmtReportes->execute();

            // Eliminar el local
            $stmt = $db->prepare('DELETE FROM local WHERE id_local = :id_local');
            $stmt->bindParam(':id_local', $id_local, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Local eliminado con éxito']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Local no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error al eliminar el local', 'error' => $e->getMessage()]);
        }
    break;
}
