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
function uploadImage($file, $folder = 'uploads/', $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'], $maxSize = 5 * 1024 * 1024) {
    // Verificar que se haya enviado el archivo
    if (!isset($file) || $file['error'] != 0) {
        return ['success' => false, 'message' => 'No se subió ningún archivo o ocurrió un error.'];
    }

    // Verificar tamaño
    if ($file['size'] > $maxSize) {
        return ['success' => false, 'message' => 'El archivo es demasiado grande. Máx: ' . ($maxSize / (1024*1024)) . ' MB'];
    }

    // Verificar tipo
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowedTypes)) {
        return ['success' => false, 'message' => 'Tipo de archivo no permitido.'];
    }

    // Crear carpeta si no existe
    if (!is_dir($folder)) {
        mkdir($folder, 0755, true);
    }

    // Generar nombre único
    $newName = uniqid('img_', true) . '.' . $ext;
    $destination = $folder . $newName;

    // Mover archivo
    if (move_uploaded_file($file['tmp_name'], $destination)) {
        return ['success' => true, 'path' => $destination];
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

        $query = "SELECT id_usuario, nombre_usuario, email_usuario, foto 
                FROM usuario 
                WHERE id_usuario = :id_usuario 
                LIMIT 0,1";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && !empty($user['foto'])) {
            // Construye la URL completa a la imagen
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
            $uploadResult = uploadImage($_FILES['imagen'], 'uploads/users/');
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
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'POST':
        
    break;

    // Eliminar usuario
    case preg_match('%/api/users/%', $requestUri) && $requestMethod == 'POST':
        
    break;
}