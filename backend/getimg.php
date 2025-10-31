<?php
// getimg.php

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "No se especificó ningún archivo";
    exit;
}

$filename = $_GET['file']; // ej: users/img_test.png

// Seguridad: bloquea rutas maliciosas
if (strpos($filename, '..') !== false) {
    http_response_code(400);
    echo "Ruta no permitida";
    exit;
}

// Ruta absoluta (ajusta si uploads está dentro o fuera del backend)
$path = realpath(__DIR__ . '/../uploads/' . $filename);

// Verifica existencia
if (!$path || !file_exists($path)) {
    http_response_code(404);
    echo "Archivo no encontrado: $filename";
    exit;
}

// Detecta tipo MIME real
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $path);
finfo_close($finfo);

// Limpia cualquier salida previa
if (ob_get_length()) ob_end_clean();

// Envía cabeceras
header('Content-Type: ' . $mime);
header('Content-Length: ' . filesize($path));
readfile($path);
exit;
?>
