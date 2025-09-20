<?php
// routes/auth.php

require_once __DIR__ . '/../config/Database.php';
use Firebase\JWT\JWT;

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
            !empty($data->email) &&
            !empty($data->nombre) &&
            !empty($data->password)
        ) {
            $query = "INSERT INTO usuario_new (email, nombre, password) VALUES (:email, :nombre, :password)";
            $stmt = $db->prepare($query);

            // Hashear la contraseña
            $passwordHash = password_hash($data->password, PASSWORD_BCRYPT);

            // Vincular datos
            $stmt->bindParam(":email", $data->email);
            $stmt->bindParam(":nombre", $data->nombre);
            $stmt->bindParam(":password", $passwordHash);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(['success' => true, 'message' => 'Usuario registrado con éxito', 'code' => 201]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'message' => 'Error al registrar el usuario', 'code' => 500]);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Datos incompletos.']);
        }
        break;

    // Inicio de sesión de usuario
    case preg_match('%/api/auth/login%', $requestUri) && $requestMethod == 'POST':
        if (!empty($data->email) && !empty($data->password)) {
            $query = "SELECT id_usuario, email, nombre, password FROM usuario_new WHERE email = :email LIMIT 0,1";
            $stmt = $db->prepare($query);
            $stmt->bindParam(':email', $data->email);
            $stmt->execute();

            $num = $stmt->rowCount();

            if ($num > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $id_usuario = $row['id_usuario'];
                $nombre = $row['nombre'];
                $password2 = $row['password'];

                if (password_verify($data->password, $password2)) {
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
                            "username" => $nombre
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
}