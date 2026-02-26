<?php
header("Access-Control-Allow-Origin: *");

if (!isset($_GET['file'])) {
    http_response_code(400);
    echo "Falta el parámetro del archivo.";
    exit;
}

$fileParam = $_GET['file'];

// Security validation: no directory traversal allowed, and must be from dataClients folder
if (strpos($fileParam, '..') !== false || (strpos($fileParam, 'dataClients/') !== 0 && strpos($fileParam, 'front/') !== 0)) {
    http_response_code(403);
    echo "Acceso denegado.";
    exit;
}

$filePath = dirname(__DIR__) . '/' . $fileParam;

if (file_exists($filePath)) {
    // Determinar el MIME type correcto
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $filePath);
    finfo_close($finfo);

    if ($mimeType === false) {
        $mimeType = 'application/octet-stream';
    }

    // Limpiar el buffer si se estaba usando
    if (ob_get_level()) {
        ob_end_clean();
    }
    
    // Forzar la descarga con Content-Disposition: attachment
    header('Content-Description: File Transfer');
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . basename($filePath) . '"');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($filePath));
    
    // Leer el archivo y enviarlo al output
    readfile($filePath);
    exit;
} else {
    http_response_code(404);
    echo "El archivo no existe en el servidor.";
}
?>
