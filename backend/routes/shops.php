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

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));


switch (true) {
// Registro de un local
    case preg_match('%/api/shops/?$%', $requestUri) && $requestMethod == 'POST':

        // Middleware de verificación del token
        $userData = verifyToken();

        // Si se envió un formulario con multipart/form-data (para imagen)
        if (isset($_POST['nombre_local'])) {
            // multipart/form-data
            $nombre_local = $_POST['nombre_local'];
            $ubicacion = $_POST['ubicacion'];
            $descripcion = $_POST['descripcion'];
            $slogan = $_POST['slogan'];
            $numero = $_POST['numero'];
        } else {
            // JSON normal
            $data = json_decode(file_get_contents("php://input"));
            $nombre_local = $data->nombre_local ?? null;
            $ubicacion = $data->ubicacion ?? null;
            $descripcion = $data->descripcion ?? null;
            $slogan = $data->slogan ?? null;
            $numero = $data->numero ?? null;
        }

        error_log(print_r($_FILES, true));
        error_log(print_r($_POST, true));


        // Validar campos requeridos
        if (!empty($nombre_local) && !empty($ubicacion)) {

            $logoPath = null;
            $bannerPath = null;

            // Subir logo si existe
            if (isset($_FILES['logo'])) {
                $uploadLogo = uploadImage($_FILES['logo'], 'locals/logos/');
                if ($uploadLogo['success']) {
                    $logoPath = $uploadLogo['path'];
                } else {
                    echo json_encode(['success' => false, 'message' => $uploadLogo['message']]);
                    break;
                }
            }

            // Subir banner si existe
            if (isset($_FILES['banner'])) {
                $uploadBanner = uploadImage($_FILES['banner'], 'locals/banners/');
                if ($uploadBanner['success']) {
                    $bannerPath = $uploadBanner['path'];
                } else {
                    echo json_encode(['success' => false, 'message' => $uploadBanner['message']]);
                    break;
                }
            }

            // Insertar local en la base de datos
            $query = "INSERT INTO local (id_usuario, ubicacion, descripcion, nombre_local, logo, banner, slogan, numero)
                    VALUES (:id_usuario, :ubicacion, :descripcion, :nombre_local, :logo, :banner, :slogan, :numero)";
            $stmt = $db->prepare($query);

            $stmt->bindParam(":id_usuario", $userData->id);
            $stmt->bindParam(":nombre_local", $nombre_local);
            $stmt->bindParam(":logo", $logoPath);
            $stmt->bindParam(":banner", $bannerPath);
            $stmt->bindParam(":slogan", $slogan);
            $stmt->bindParam(":descripcion", $descripcion);
            $stmt->bindParam(":numero", $numero);
            $stmt->bindParam(":ubicacion", $ubicacion);


            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Local registrado con éxito', 'code' => 201]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al registrar el local', 'code' => 500]);
            }

        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Datos incompletos.', 'code' => 400]);
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
             echo json_encode(['message' => 'ID de local no proporcionado.', 'code' => 400]);
         }
    break;

    // Obtener promedio de estrellas de un local
    case preg_match('%/api/shops/(\d+)/reviews/average$%', $requestUri, $matches) && $requestMethod == 'GET':
        $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
            $query = "SELECT AVG(estrellas) as promedio_estrellas FROM resenas WHERE id_local = :id_local";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->execute();

            $average = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode($average);
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'ID de local no proporcionado.', 'code' => 400]);
        }
    break;

    // Obtener todos los locales
    case preg_match('%/api/shops/all?$%', $requestUri) && $requestMethod == 'GET':
        $query = "
            SELECT 
                l.*, 
                ROUND(AVG(r.estrellas), 1) AS estrellas
            FROM local l
            LEFT JOIN resenas r ON r.id_local = l.id_local
            GROUP BY l.id_local
        ";

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

    // Obtener productos de un local
    case preg_match('%/api/shops/(\d+)/products$%', $requestUri, $matches) && $requestMethod == 'GET':
        $id_local = $matches[1] ?? null;

        if (!empty($id_local)) {
            $query = "SELECT * FROM productos WHERE id_local = :id_local";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->execute();

            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($products);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
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

    // Ver publicacion de un local
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
        $query = "
        SELECT r.*, u.nombre_usuario 
        FROM resenas r
        INNER JOIN usuario u ON r.id_usuario = u.id_usuario
        WHERE r.id_local = :id_local
    ";
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

        $likes = 0;
        $reportado = 0;

        $query = "INSERT INTO resenas (id_local, id_usuario, comentario, estrellas, reportado, likes) VALUES (:id_local, :id_usuario, :comentario, :estrellas, :reportado, :likes)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_usuario", $userData->id);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->bindParam(":comentario", $data->comentario);
        $stmt->bindParam(":estrellas", $data->estrellas);
        $stmt->bindValue(":likes", 0);
        $stmt->bindValue(":reportado", 0);
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
        $userData = verifyToken();

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

    // Reportar reseña de un local
    case preg_match('%/api/shops/(\d+)/review/(\d+)$%', $requestUri, $matches) && $requestMethod == 'PUT':
        $userData = verifyToken();

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
    
    case preg_match('%/api/shops/upload-test$%', $requestUri) && $requestMethod == 'POST':
    
        if (!isset($_FILES['imagen'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'No se envió ninguna imagen.']);
            break;
        }
    
        $uploadResult = uploadImage($_FILES['imagen']);
    
        if ($uploadResult['success']) {
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Imagen subida correctamente', 'path' => $uploadResult['path']]);
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => $uploadResult['message']]);
        }
    break;

    // Agregar local a favoritos
    case preg_match('%/api/shops/(\d+)/favorite$%', $requestUri, $matches) && $requestMethod == 'POST':
        $userData = verifyToken();

        $id_local = $matches[1] ?? null;

        $checkQuery = "SELECT COUNT(*) FROM favoritos WHERE id_usuario = :id_usuario AND id_local = :id_local";
        $checkStmt = $db->prepare($checkQuery);
        $checkStmt->bindParam(":id_usuario", $userData->id);
        $checkStmt->bindParam(":id_local", $id_local);
        $checkStmt->execute();
        $exists = $checkStmt->fetchColumn();

        if ($exists > 0) {
            http_response_code(409);
            echo json_encode(['success' => false, 'message' => 'Este local ya está en tus favoritos', 'code' => 409]);
            break;
        }

        $query = "INSERT INTO favoritos (id_usuario, id_local) VALUES (:id_usuario, :id_local)";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_usuario", $userData->id);
        $stmt->bindParam(":id_local", $id_local);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Local agregado a favoritos con éxito',
                'code' => 201
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al agregar el local a favoritos',
                'code' => 500
            ]);
        }
    break;


    // Eliminar local de favoritos
    case preg_match('%/api/shops/(\d+)/favorite$%', $requestUri, $matches) && $requestMethod == 'DELETE':
        $userData = verifyToken(); // Proteger la ruta

        $id_local = $matches[1] ?? null;

        $query = "DELETE FROM favoritos WHERE id_usuario = :id_usuario AND id_local = :id_local";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_usuario", $userData->id);
        $stmt->bindParam(":id_local", $id_local);
        
        if ($stmt->execute()) {
             http_response_code(200);
             echo json_encode(['success' => true, 'message' => 'Local eliminado de favoritos con éxito', 'code' => 200]);
         } else {
             http_response_code(500);
             echo json_encode(['success' => false, 'message' => 'Error al eliminar el local de favoritos', 'code' => 500]);
         }
    break;
}

