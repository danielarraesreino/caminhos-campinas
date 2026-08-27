<?php
// Salve como upload.php na Hostinger
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['audio'])) {
    // Check for upload errors
    if ($_FILES['audio']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'Erro no upload: ' . $_FILES['audio']['error']]);
        exit;
    }

    // Check file size (max 10MB)
    if ($_FILES['audio']['size'] > 10 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'Arquivo muito grande (max 10MB)']);
        exit;
    }

    // Check MIME type securely
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->file($_FILES['audio']['tmp_name']);

    $allowedMimeTypes = ['audio/webm', 'video/webm', 'audio/ogg', 'audio/mpeg'];
    if (!in_array($mimeType, $allowedMimeTypes, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato de arquivo não suportado (' . $mimeType . ')']);
        exit;
    }

    $dir = 'uploads/dilemas/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    
    $name = uniqid('relato_') . '.webm';
    if (move_uploaded_file($_FILES['audio']['tmp_name'], $dir . $name)) {
        echo json_encode(['url' => 'https://' . $_SERVER['HTTP_HOST'] . '/' . $dir . $name]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Falha ao salvar']);
    }
}
?>
