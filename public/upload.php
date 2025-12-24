<?php
// Salve como upload.php na Hostinger
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['audio'])) {
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
