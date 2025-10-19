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

        if (!empty($data->nombre_local) && !empty($data->ubicacion)) {
            $query = "INSERT INTO local (id_usuario, ubicacion, descripcion, nombre_local) VALUES (:id_usuario, :ubicacion, :descripcion, :nombre_local)";
            $stmt = $db->prepare($query);

            // Falta ver que tener unico para que no se repitan los locales Lol,,,,,,

            // Vincular datos
            $stmt->bindParam(":id_usuario", $userData->id);
            $stmt->bindParam(":ubicacion", $data->ubicacion);
            $stmt->bindParam(":descripcion", $data->descripcion);
            $stmt->bindParam(":nombre_local", $data->nombre_local);

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

    // Eliminar un local
    case preg_match('%/api/shops/(\d+)$%', $requestUri, $matches) && $requestMethod == 'DELETE':
         $userData = verifyToken(); // Proteger la ruta

         $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
            $query = "DELETE FROM local WHERE id_local = :id_local AND id_usuario = :id_usuario";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":id_local", $id_local);
            $stmt->bindParam(":id_usuario", $userData->id);
            
            if ($stmt->execute()) {
                 http_response_code(200);
                 echo json_encode(['success' => true, 'message' => 'Local eliminado con éxito', 'code' => 200]);
             } else {
                 http_response_code(500);
                 echo json_encode(['success' => false, 'message' => 'Error al eliminar el local', 'code' => 500]);
             }
         } else {
             http_response_code(400);
             echo json_encode(['message' => 'ID de local no proporcionado.']);
         }
    break;

    // Obtener todos los locales
    case preg_match('%/api/shops/all?$%', $requestUri) && $requestMethod == 'GET':
        $query = "SELECT * FROM local";
        $stmt = $db->prepare($query);
        $stmt->execute();

        $locals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($locals);
    break;

    // Obtener un local
    case preg_match('%/api/shops/(\d+)$%', $requestUri, $matches) && $requestMethod == 'GET':

        $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
            $query = "SELECT * FROM local WHERE id_local = :id_local";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->execute();

            $local = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($local);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
        }
    break;
    
    // Obtener mis locales
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken(); // Proteger la ruta

        $query = "SELECT * FROM local WHERE id_usuario = :id_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $userData->id);
        $stmt->execute();

        $locals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($locals);
    break;
    
    // --- ACTUALIZAR UN LOCAL (PUT) --- [NO CHECKEADO]
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
            echo json_encode(['success' => false, 'message' => 'Datos incompletos.', 'code' => 400]);
        }
    break;

    // Registrar publicacion de un local --- [NO CHECKEADO]
    case preg_match('%/api/shops/(\d+)/posts$%', $requestUri, $matches) && $requestMethod == 'POST':
        $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
                $query = "INSERT INTO publicacion (id_local, fecha_inicio, fecha_fin, descripcion) VALUES (:id_local, :fecha_inicio, :fecha_fin, :descripcion)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id_local', $id_local);
                $stmt->bindParam(':fecha_inicio', $data->fecha_inicio);
                $stmt->bindParam(':fecha_fin', $data->fecha_fin);
                $stmt->bindParam(':descripcion', $data->descripcion);

                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(['success' => true, 'message' => 'Publicación creada con éxito', 'code' => 201]);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Error al crear la publicación', 'code' => 500]);
                }  
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
        }
    break;

    // Ver publicaciones de un local
    case preg_match('%/api/shops/(\d+)/posts$%', $requestUri, $matches) && $requestMethod == 'GET':
        $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
            $query = "SELECT * FROM publicacion WHERE id_local = :id_local";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->execute();

            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($posts);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
        }
    break;

    // Ver publicaciones de un local
    case preg_match('%/api/shops/(\d+)/posts/(\d+)$%', $requestUri, $matches) && $requestMethod == 'GET':
        $id_local = $matches[1] ?? null;
        $id_post = $matches[2] ?? null;

        if (!empty($id_local) && !empty($id_post)) {
            $query = "SELECT * FROM publicacion WHERE id_local = :id_local AND id_publicacion = :id_post";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->bindParam(':id_post', $id_post);
            $stmt->execute();

            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($posts);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
        }
    break;

    // Eliminar publicacion de un local
    case preg_match('%/api/shops/(\d+)/posts/(\d+)$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $id_local = $matches[1] ?? null;
        $id_post = $matches[2] ?? null;

        if (!empty($id_local) && !empty($id_post)) {
            $query = "DELETE FROM publicacion WHERE id_local = :id_local AND id_publicacion = :id_post";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->bindParam(':id_post', $id_post);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Publicación eliminada con éxito', 'code' => 200]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al eliminar la publicación', 'code' => 500]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local o de la publicación no proporcionada.', 'code' => 400]);
        }
    break;

    // Ver reseñas de un local
    case preg_match('%/api/shops/(\d+)/review?$%', $requestUri, $matches) && $requestMethod == 'GET':
        
        $id_local = $matches[1] ?? null;

        $query = "SELECT * FROM resenas WHERE id_local = :id_local";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_local', $id_local);
        $stmt->execute();

        $locals = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($locals);
    break;

    // Reseñar un local
    case preg_match('%/api/shops/(\d+)/review?$%', $requestUri, $matches) && $requestMethod == 'POST':
        $userData = verifyToken(); // Proteger la ruta

        $id_local = $matches[1] ?? null;

        // Verificar si ya existe una reseña
        $checkQuery = "SELECT * FROM resenas WHERE id_local = :id_local AND id_usuario = :id_usuario";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":id_local", $id_local);
        $checkStmt->bindParam(":id_usuario", $userData->id);
        $checkStmt->execute();

        $exists = $checkStmt->fetchColumn();

        if ($exists) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Ya has enviado una reseña para este local.', 'code' => 400]);
        break;
        }

        // Pegarle una mirada a la estructura de la tabla reseñas: reportado no es boolean && verificar los nombres de las variables - ago2020

        $query = "INSERT INTO resenas (id_local, id_usuario, texto, votacion, reportado) VALUES (:id_local, :id_usuario, :texto, :votacion, :reportado)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_usuario", $userData->id);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->bindParam(":texto", $data->texto);
        $stmt->bindParam(":votacion", $data->votacion);
        $stmt->bindParam(":reportado", $data->reportado);
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Reseña registrada con éxito', 'code' => 201]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Error al registrar la reseña', 'code' => 500]);
        }
    break;
    
    // Eliminar reseña de un local
    case preg_match('%/api/shops/(\d+)/review?$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $userData = verifyToken(); // Proteger la ruta

        $id_local = $matches[1] ?? null;

        $query = "DELETE FROM resenas WHERE id_local = :id_local AND id_usuario = :id_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->bindParam(":id_usuario", $userData->id);
        
        if ($stmt->execute()) {
             http_response_code(200);
             echo json_encode(['success' => true, 'message' => 'Reseña eliminada con éxito', 'code' => 200]);
         } else {
             http_response_code(500);
             echo json_encode(['success' => false, 'message' => 'Error al eliminar la reseña', 'code' => 500]);
         }
    break;

    // Por revisar V V V

    // Reportar reseña de un local
    case preg_match('%/api/shops/(\d+)/review/(\d+)$%', $requestUri, $matches) && $requestMethod == 'PUT':
        $userData = verifyToken(); // Proteger la ruta

        $id_local = $matches[1] ?? null;
        $id_usuario = $matches[2] ?? null;

        $query = "UPDATE resenas SET reportado = 1 WHERE id_local = :id_local AND id_usuario = :id_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->bindParam(":id_usuario", $id_usuario);
        
        echo json_encode($data);
        
        if ($stmt->execute()) {
             http_response_code(200);
             echo json_encode(['success' => true, 'message' => 'Reseña reportada con éxito', 'code' => 200]);
         } else {
             http_response_code(500);
             echo json_encode(['success' => false, 'message' => 'Error al reportar la reseña', 'code' => 500]);
         }
    break;
}