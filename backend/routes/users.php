<?php
// routes/auth.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Obtener la conexión a la base de datos
$database = new Database();
$db = $database->getConnection();

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

// Subida de imagenes
function uploadImage($file, $subfolder = 'users/', $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'], $maxSize = 5 * 1024 * 1024) {
    $uploadBase = dirname(dirname(__DIR__)) . '/uploads/'; // Carpeta donde se suben las imagenes
    $uploadPath = $uploadBase . trim($subfolder, '/');

    if (!is_dir($uploadPath)) {
        mkdir($uploadPath, 0755, true);
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $newName = uniqid('img_', true) . '.' . $ext;
    $destination = $uploadPath . '/' . $newName;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Devuelve la ruta relativa
        return ['success' => true, 'path' => $subfolder . $newName];
    } else {
        return ['success' => false, 'message' => 'Error al guardar la imagen.'];
    }
}


// Decodificar el cuerpo de la petición JSON
$data = json_decode(file_get_contents("php://input"));

// Rutas de autenticación
switch (true) {
    // Obtener datos del usuario
    case preg_match('%/api/users/?$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
        $id_usuario = $userData->id;

        $query = "SELECT 
                    u.id_usuario, 
                    u.nombre_usuario, 
                    u.email_usuario, 
                    u.foto,
                    t.nombre AS tipo_usuario
                FROM usuario u
                INNER JOIN usuario_tipos t ON u.tipo_usuario = t.id
                WHERE u.id_usuario = :id_usuario
                LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && !empty($user['foto'])) {
            // Si el campo 'foto' en la base de datos guarda "users/img_....png"
            $baseUrl = "http://localhost:8000/getimg.php?file=";
            $user['foto'] = $baseUrl . urlencode($user['foto']);
        }

        echo json_encode(['success' => true, 'data' => $user]);
    break;


    // Editar usuario
    case preg_match('%/api/users/?$%', $requestUri)
     && ($requestMethod == 'PUT' || ($requestMethod == 'POST' && ($_POST['_method'] ?? '') === 'PUT')):

    $userData = verifyToken();

    $id_usuario = $userData->id;
    $nombre_usuario = $_POST['nombre_usuario'] ?? null;
    $email_usuario = $_POST['email_usuario'] ?? null;

    if (!empty($id_usuario)) {
        $imagePath = null;
        if (isset($_FILES['imagen'])) {
            $uploadResult = uploadImage($_FILES['imagen']);
            if ($uploadResult['success']) {
                $imagePath = $uploadResult['path'];
            } else {
                echo json_encode(['success' => false, 'message' => $uploadResult['message']]);
                break;
            }
        }

        $query = "UPDATE usuario 
                  SET nombre_usuario = :nombre_usuario, email_usuario = :email_usuario";
        if ($imagePath) {
            $query .= ", foto = :foto";
        }
        $query .= " WHERE id_usuario = :id_usuario";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':nombre_usuario', $nombre_usuario);
        $stmt->bindParam(':email_usuario', $email_usuario);
        if ($imagePath) {
            $stmt->bindParam(':foto', $imagePath);
        }

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario actualizado con éxito']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el usuario']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'ID de usuario requerido']);
    }
    break;


    // Cambiar de contraseña
    case preg_match('%/api/users/passchange%', $requestUri) && $requestMethod == 'POST':
        $userData = verifyToken();
        $id_usuario = $userData->id;

        $data = json_decode(file_get_contents("php://input"));
        $password_antigua = $data->password_antigua ?? null;
        $password_nueva = $data->password_nueva ?? null;

        if (!$password_antigua || !$password_nueva) {
            echo json_encode(['success' => false, 'message' => 'Ambas contraseñas (antigua y nueva) son requeridas.']);
            break;
        }

        $query = "SELECT password_usuario FROM usuario WHERE id_usuario = :id_usuario LIMIT 1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
            break;
        }

        if (!password_verify($password_antigua, $user['password_usuario'])) {
            echo json_encode(['success' => false, 'message' => 'Contraseña antigua incorrecta.']);
            break;
        }

        $passwordHash = password_hash($password_nueva, PASSWORD_BCRYPT);

        $query = "UPDATE usuario SET password_usuario = :password_usuario WHERE id_usuario = :id_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->bindParam(':password_usuario', $passwordHash);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Contraseña actualizada con éxito.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar la contraseña.']);
        }
    break;

    // Eliminar usuario
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'DELETE':
        $userData = verifyToken();
        $authenticatedUserId = $userData->id;

        try {
            $stmt = $db->prepare('DELETE FROM users WHERE id = :id');
            $stmt->bindParam(':id', $authenticatedUserId, PDO::PARAM_INT);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['message' => 'Cuenta eliminada con éxito']);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Usuario no encontrado']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['message' => 'Error al eliminar la cuenta', 'error' => $e->getMessage()]);
        }
    break;

    // Ver locales favoritos del usuario
    case preg_match('%/api/users/favorites$%', $requestUri) && $requestMethod == 'GET':
        $userData = verifyToken();
        $id_usuario = $userData->id;

        $query = "SELECT l.id_local, l.nombre_local, l.descripcion, l.foto, l.etiquetas, l.numero
                  FROM favoritos f
                  INNER JOIN local l ON f.id_local = l.id_local
                  WHERE f.id_usuario = :id_usuario";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        $favorites = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'data' => $favorites]);
    break;
}