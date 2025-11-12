<?php
// routes/shops.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Verificacion del Token de usuario
function verifyToken($required = true) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    $arr = explode(" ", $authHeader);
    $token = $arr[1] ?? '';

    if (!$token) {
        if ($required) {
            http_response_code(401);
            echo json_encode(["message" => "Acceso denegado."]);
            exit();
        } else {
            return null;
        }
    }

    try {
        $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
        return $decoded->data;
    } catch (Exception $e) {
        if ($required) {
            http_response_code(403);
            echo json_encode(["message" => "No se puede acceder a la siguiente funcion.", "error" => $e->getMessage()]);
            exit();
        } else {
            return null;
        }
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
                ROUND(AVG(r.estrellas), 1) AS estrellas,
                GROUP_CONCAT(DISTINCT e.nombre ORDER BY e.nombre SEPARATOR ', ') AS etiquetas
            FROM local l
            LEFT JOIN resenas r ON r.id_local = l.id_local
            LEFT JOIN local_etiquetas le ON le.id_local = l.id_local
            LEFT JOIN etiquetas e ON e.id_etiqueta = le.id_etiqueta
            GROUP BY l.id_local
        ";

        $stmt = $db->prepare($query);
        $stmt->execute();

        $locals = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // etiquetas a array
        foreach ($locals as &$local) {
            $local['etiquetas'] = $local['etiquetas'] ? explode(', ', $local['etiquetas']) : [];
        }

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
    
    // Editar un local
    case preg_match('%/api/shops/(\d+)/?$%', $requestUri, $matches):

        $id_local = $matches[1];
        $userData = verifyToken();

        // detectar posts o put
        $actualMethod = $requestMethod;
        if ($requestMethod === 'POST' && !empty($_POST['_method'])) {
            $actualMethod = strtoupper($_POST['_method']);
        }

        if ($actualMethod !== 'PUT') {
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido. Use PUT o POST con _method=PUT.',
                'code' => 405
            ]);
            break;
        }

        $nombre_local = $ubicacion = $descripcion = $slogan = $numero = null;
        $logoPath = $bannerPath = null;

        if ($requestMethod === 'POST') {
            // form-data
            $nombre_local = $_POST['nombre_local'] ?? null;
            $ubicacion    = $_POST['ubicacion'] ?? null;
            $descripcion  = $_POST['descripcion'] ?? null;
            $slogan       = $_POST['slogan'] ?? null;
            $numero       = $_POST['numero'] ?? null;

            if (!empty($_FILES['logo']['tmp_name'])) {
                $uploadLogo = uploadImage($_FILES['logo'], 'locals/logos/');
                if ($uploadLogo['success']) $logoPath = $uploadLogo['path'];
            }

            if (!empty($_FILES['banner']['tmp_name'])) {
                $uploadBanner = uploadImage($_FILES['banner'], 'locals/banners/');
                if ($uploadBanner['success']) $bannerPath = $uploadBanner['path'];
            }

        } else {
            // si es un put, solo se manda el json sin imagenes
            $data = json_decode(file_get_contents("php://input"), true);
            $nombre_local = $data['nombre_local'] ?? null;
            $ubicacion    = $data['ubicacion'] ?? null;
            $descripcion  = $data['descripcion'] ?? null;
            $slogan       = $data['slogan'] ?? null;
            $numero       = $data['numero'] ?? null;
        }

        if (empty($nombre_local) || empty($ubicacion)) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Datos incompletos. nombre_local y ubicacion son obligatorios.',
                'code' => 400
            ]);
            break;
        }

        $query = "UPDATE local SET
                    nombre_local = :nombre_local,
                    ubicacion = :ubicacion,
                    descripcion = :descripcion,
                    slogan = :slogan,
                    numero = :numero";

        if ($logoPath)   $query .= ", logo = :logo";
        if ($bannerPath) $query .= ", banner = :banner";

        $query .= " WHERE id_local = :id_local AND id_usuario = :id_usuario";

        $stmt = $db->prepare($query);
        $stmt->bindParam(":nombre_local", $nombre_local);
        $stmt->bindParam(":ubicacion", $ubicacion);
        $stmt->bindParam(":descripcion", $descripcion);
        $stmt->bindParam(":slogan", $slogan);
        $stmt->bindParam(":numero", $numero);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->bindParam(":id_usuario", $userData->id);
        if ($logoPath)   $stmt->bindParam(":logo", $logoPath);
        if ($bannerPath) $stmt->bindParam(":banner", $bannerPath);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Local actualizado con éxito',
                'code' => 200
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Error al actualizar el local',
                'code' => 500
            ]);
        }

    break;


    // Registrar producto de un local
    case preg_match('%/api/shops/(\d+)/products$%', $requestUri, $matches) && $requestMethod == 'POST':
        $id_local = $matches[1] ?? null;
        $userData = verifyToken();

        if (!empty($id_local)) {
            $fotoPath = null;

            // Subir foto si existe
            if (isset($_FILES['foto'])) {
                $uploadFoto = uploadImage($_FILES['foto'], 'locals/fotos/');
                if ($uploadFoto['success']) {
                    $fotoPath = $uploadFoto['path'];
                } else {
                    echo json_encode(['success' => false, 'message' => $uploadFoto['message']]);
                    break;
                }
            }

            $titulo = $_POST['titulo'] ?? null;
            $precio = $_POST['precio'] ?? null;
            $descripcion = $_POST['descripcion'] ?? null;
            $etiqueta = $_POST['etiqueta_producto'] ?? null;

            if (!$titulo || !$descripcion) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Campos requeridos faltantes.']);
                break;
            }

            $query = "INSERT INTO productos (id_local, titulo, foto, precio, descripcion_producto, etiqueta_producto)
                    VALUES (:id_local, :titulo, :foto, :precio, :descripcion_producto, :etiqueta_producto)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':id_local', $id_local);
            $stmt->bindParam(':foto', $fotoPath);
            $stmt->bindParam(':titulo', $titulo);
            $stmt->bindParam(':precio', $precio);
            $stmt->bindParam(':descripcion_producto', $descripcion);
            $stmt->bindParam(':etiqueta_producto', $etiqueta);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Producto creado con éxito', 'code' => 201]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al crear el producto', 'code' => 500]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID del local no proporcionada.', 'code' => 400]);
        }
    break;

    // Obtener productos de un local
    case preg_match('%/api/shops/(\d+)/products$%', $requestUri, $matches) && $requestMethod == 'GET':
        $id_local = $matches[1] ?? null;

        $query = "
            SELECT 
                p.id_producto,
                p.titulo,
                p.precio,
                p.descripcion_producto,
                p.etiqueta_producto,
                p.foto
            FROM productos p
            WHERE p.id_local = :id_local
        ";
        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_local', $matches[1]);
        $stmt->execute();

        $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($productos);
    break;

    // Registrar publicacion de un local --- [NO CHECKEADO]
    case preg_match('%/api/shops/(\d+)/posts$%', $requestUri, $matches) && $requestMethod == 'POST':
        $id_local = $matches[1] ?? null;
        $userData = verifyToken();

        if (!empty($id_local)) {
                $fotoPath = null;

                // Subir logo si existe
                if (isset($_FILES['logo'])) {
                    $uploadLogo = uploadImage($_FILES['logo'], 'locals/logos/');
                    if ($uploadLogo['success']) {
                        $fotoPath = $uploadLogo['path'];
                    } else {
                        echo json_encode(['success' => false, 'message' => $uploadLogo['message']]);
                        break;
                    }
                }

                $query = "INSERT INTO publicacion (id_local, foto, descripcion) VALUES (:id_local, :foto, :descripcion)";
                $stmt = $db->prepare($query);
                $stmt->bindParam(':id_local', $id_local);
                $stmt->bindParam(':foto', $fotoPath);
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
        $userData = verifyToken(false);

        $id_usuario = $userData ? $userData->id : null;

        $query = "
            SELECT 
                r.*, 
                u.nombre_usuario,
                (SELECT COUNT(*) FROM likes_resena l WHERE l.id_resena = r.id_resena) AS likes,
                CASE 
                    WHEN :id_usuario IS NOT NULL AND EXISTS (
                        SELECT 1 FROM likes_resena l2 
                        WHERE l2.id_resena = r.id_resena 
                        AND l2.id_usuario = :id_usuario
                    ) 
                    THEN 1 ELSE 0
                END AS liked
            FROM resenas r
            INNER JOIN usuario u ON r.id_usuario = u.id_usuario
            WHERE r.id_local = :id_local
        ";

        $stmt = $db->prepare($query);
        $stmt->bindParam(':id_local', $id_local);
        $stmt->bindParam(':id_usuario', $id_usuario);
        $stmt->execute();

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
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
    
    // Dar like a una reseña
    case preg_match('%/api/shops/(\d+)/review/(\d+)/like$%', $requestUri, $matches) && $requestMethod == 'POST':
        $userData = verifyToken();
        $id_usuario = $userData->id;

        $id_local = intval($matches[1] ?? 0);
        $id_resena = intval($matches[2] ?? 0);

        // Verificar que la reseña exista
        $stmt = $db->prepare("SELECT * FROM resenas WHERE id_local = :id_local AND id_resena = :id_resena");
        $stmt->execute([':id_local' => $id_local, ':id_resena' => $id_resena]);
        $resena = $stmt->fetch(PDO::FETCH_OBJ);
        
        if (!$resena) {
            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Reseña no encontrada']);
            break;
        }

        // no auto-like
        if ($resena->id_usuario == $id_usuario) {
            http_response_code(403);
            echo json_encode(['success' => false, 'message' => 'No puedes dar like a tu propia reseña']);
            break;
        }

        $stmt = $db->prepare("SELECT * FROM likes_resena WHERE id_usuario = :id_usuario AND id_resena = :id_resena");
        $stmt->execute([':id_usuario' => $id_usuario, ':id_resena' => $id_resena]);
        $like = $stmt->fetch(PDO::FETCH_OBJ);

        if ($like) {
            // rem like
            $db->prepare("DELETE FROM likes_resena WHERE id_usuario = :id_usuario AND id_resena = :id_resena")
            ->execute([':id_usuario' => $id_usuario, ':id_resena' => $id_resena]);

            $db->prepare("UPDATE resenas SET likes = likes - 1 WHERE id_resena = :id_resena")
            ->execute([':id_resena' => $id_resena]);

            echo json_encode(['success' => true, 'liked' => false]);
        } else {
            // add like
            $db->prepare("INSERT INTO likes_resena (id_usuario, id_resena) VALUES (:id_usuario, :id_resena)")
            ->execute([':id_usuario' => $id_usuario, ':id_resena' => $id_resena]);

            $db->prepare("UPDATE resenas SET likes = likes + 1 WHERE id_resena = :id_resena")
            ->execute([':id_resena' => $id_resena]);

            echo json_encode(['success' => true, 'liked' => true]);
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

    // Obtener local favoritos del usuario (nose si es optimo)
    case preg_match('%/api/shops/(\d+)/favorite$%', $requestUri, $matches) && $requestMethod == 'GET':
        $userData = verifyToken();
        $id_local = $matches[1] ?? null;

        $query = "SELECT COUNT(*) FROM favoritos WHERE id_usuario = :id_usuario AND id_local = :id_local";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id_usuario", $userData->id);
        $stmt->bindParam(":id_local", $id_local);
        $stmt->execute();
        $exists = $stmt->fetchColumn();

        echo json_encode([
            'success' => true,
            'isFavorite' => $exists > 0,
        ]);
    break;


    // Buscar tienda por nombre
    case preg_match('%/api/shops/search/?$%', $requestUri) && $requestMethod === 'GET':
        $searchTerm = trim($_GET['q'] ?? '');

        if ($searchTerm === '') {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'message' => 'Término de búsqueda no proporcionado.',
                'code' => 400
            ]);
            exit;
        }

        $query = "
            SELECT 
                l.id_local,
                l.nombre_local,
                l.ubicacion,
                l.numero,
                ROUND(AVG(r.estrellas), 1) AS estrellas_promedio
            FROM local l
            LEFT JOIN resenas r ON r.id_local = l.id_local
            WHERE l.nombre_local LIKE :searchTerm
            GROUP BY l.id_local, l.nombre_local, l.ubicacion, l.numero
            ORDER BY estrellas_promedio DESC
            LIMIT 50
        ";

        $stmt = $db->prepare($query);
        $likeTerm = '%' . $searchTerm . '%';
        $stmt->bindValue(':searchTerm', $likeTerm, PDO::PARAM_STR);
        $stmt->execute();

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'success' => true,
            'data' => $results
        ]);
    break;

    // Obtener todas las etiquetas
    case preg_match('%/api/shops/tags$%', $requestUri) && $requestMethod == 'GET':
        $query = "SELECT * FROM etiquetas";
        $stmt = $db->prepare($query);
        $stmt->execute();

        $etiquetas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($etiquetas);
    break;

    // Agregar etiquetas a un local
    case preg_match('%/api/shops/(\d+)/tags$%', $requestUri, $matches) && $requestMethod == 'POST':
        $id_local = $matches[1];
        $data = json_decode(file_get_contents('php://input'), true);
        $etiquetas = $data['etiquetas'] ?? [];

        // Limpia etiquetas anteriores (opcional)
        $stmt = $db->prepare("DELETE FROM local_etiquetas WHERE id_local = ?");
        $stmt->execute([$id_local]);

        // Inserta las nuevas relaciones
        $stmt = $db->prepare("INSERT INTO local_etiquetas (id_local, id_etiqueta) VALUES (?, ?)");

        foreach ($etiquetas as $id_etiqueta) {
            $stmt->execute([$id_local, $id_etiqueta]);
        }

        echo json_encode(["message" => "Etiquetas actualizadas correctamente"]);
    break;

    // Subir imagen de prueba
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

    // Ver reseñas de mis locales
    case (preg_match('%/api/shops/myreviews/?$%', $requestUri) && $requestMethod == 'GET'):
    $userData = verifyToken();
    $id_usuario = $userData->id;

    // Consulta: obtenemos todas las reseñas de los locales que pertenecen al usuario
    $query = "
        SELECT r.*,
            u.nombre_usuario,
            l.id_local,
            l.nombre_local,
            (SELECT COUNT(*) FROM likes_resena lr WHERE lr.id_resena = r.id_resena) AS likes,
            CASE 
                WHEN EXISTS (
                    SELECT 1 
                    FROM likes_resena likesresenas2 
                    WHERE likesresenas2.id_resena = r.id_resena 
                        AND likesresenas2.id_usuario = :id_usuario
                ) THEN 1
                ELSE 0
            END AS liked
        FROM resenas r
        INNER JOIN local l ON r.id_local = l.id_local
        INNER JOIN usuario u ON r.id_usuario = u.id_usuario
        WHERE l.id_usuario = :id_usuario
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_INT);
    $stmt->execute();

    $resenas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Agrupar reseñas por local
    $locales = [];
    foreach ($resenas as $r) {
        $id_local = $r['id_local'];
        if (!isset($locales[$id_local])) {
            $locales[$id_local] = [
                'id_local' => $id_local,
                'nombre_local' => $r['nombre_local'],
                'resenas' => []
            ];
        }

        // Eliminamos datos repetidos del local dentro de cada reseña
        unset($r['id_local'], $r['nombre_local']);
        $locales[$id_local]['resenas'][] = $r;
    }

    // Convertir a array indexado para JSON
    $locales = array_values($locales);

    echo json_encode($locales);
break;
}

