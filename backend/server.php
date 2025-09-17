<?php
// server.php
$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)
);

// Este archivo permite al servidor de desarrollo de PHP emular
// el comportamiento de "mod_rewrite" de Apache.
if ($uri !== '/' && file_exists(__DIR__ . $uri)) {
    return false; // Sirve el recurso solicitado directamente.
}

// Para cualquier otra cosa, carga el index.php
require_once __DIR__ . '/index.php';
