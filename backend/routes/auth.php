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

// Rutas de autenticación
switch (true) {
    // Registro de usuario
    case preg_match('%/api/auth/register%', $requestUri) && $requestMethod == 'POST':
        if (
            !empty($data->email_usuario) &&
            !empty($data->nombre_usuario) &&
            !empty($data->password_usuario) &&
            !empty($data->tipo_usuario)
        ) {
            $query = "INSERT INTO usuario (email_usuario, nombre_usuario, password_usuario, tipo_usuario) VALUES (:email_usuario, :nombre_usuario, :password_usuario, :tipo_usuario)"; // Cambiar la consulta de tabla
            $stmt = $db->prepare($query);

            // Hashear la contraseña
            $passwordHash = password_hash($data->password_usuario, PASSWORD_BCRYPT);

            // Vincular datos
            $stmt->bindParam(":email_usuario", $data->email_usuario);
            $stmt->bindParam(":nombre_usuario", $data->nombre_usuario);
            $stmt->bindParam(":tipo_usuario", $data->tipo_usuario);
            $stmt->bindParam(":password_usuario", $passwordHash);
            try {
                if ($stmt->execute()) {
                    http_response_code(201);
                    echo json_encode(['success' => true, 'message' => 'Usuario registrado con éxito', 'code' => 201]);
                } else {
                    http_response_code(500);
                    echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario', 'code' => 500]);
                }
            } catch (PDOException $e) {
                if ($e->getCode() == 23000) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'El email ya está registrado', 'code' => 400]);
                    exit;
                } else {
                    throw $e; // En caso de ser otro error
                }
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
        break;

    // Inicio de sesión de usuario
    case preg_match('%/api/auth/login%', $requestUri) && $requestMethod == 'POST':
        if (!empty($data->email_usuario) && !empty($data->password_usuario)) {
            $query = "SELECT id_usuario, email_usuario, nombre_usuario, password_usuario FROM usuario WHERE email_usuario = :email_usuario LIMIT 0,1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email_usuario', $data->email_usuario);
            $stmt->execute();

            $num = $stmt->rowCount();

            if ($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $id_usuario = $row['id_usuario'];
                $nombre = $row['nombre_usuario'];
                $password2 = $row['password_usuario'];
                $email = $row['email_usuario'];

                if (password_verify($data->password_usuario, $password2)) {
                    $secret_key = $_ENV['JWT_SECRET'];
                    $issuer_claim = "localhost";
                    $issuedat_claim = time();
                    $expire_claim = $issuedat_claim + 3600; // 1 hora

                    $token = array(
                        "iss" => $issuer_claim,
                        "iat" => $issuedat_claim,
                        "exp" => $expire_claim,
                        "data" => array(
                            "id" => $id_usuario,
                            "username" => $nombre,
                        )
                    );

                    http_response_code(200);
                    $jwt = JWT::encode($token, $secret_key, 'HS256');
                    echo json_encode(
                        array(
                            "message" => "Inicio de sesión exitoso",
                            "token" => $jwt
                        )
                    );
                } else {
                    http_response_code(401);
                    echo json_encode(['success' => false, 'message' => 'Las credenciales no coinciden', 'code' => 401]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Credenciales inválidas']);
            }
        } else {
             http_response_code(400);
             echo json_encode(['message' => 'Email y contraseña requeridos.']);
        }
    break;

    // Obtener información del usuario autenticado
    case preg_match('%/api/auth/user%', $requestUri) && $requestMethod == 'GET':
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
            list($jwt) = sscanf($authHeader, 'Bearer %s');

            if ($jwt) {
                try {
                    $secret_key = $_ENV['JWT_SECRET'];
                    $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));

                    http_response_code(200);
                    echo json_encode([
                        'id' => $decoded->data->id,
                        'nombre_usuario' => $decoded->data->username,
                    ]);
                } catch (Exception $e) {
                    http_response_code(401);
                    echo json_encode(['message' => 'Acceso denegado', 'error' => $e->getMessage()]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['message' => 'Token no proporcionado.']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Cabecera de autorización no encontrada.']);
        }
    break;
}