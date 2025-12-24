<?php
// Permite que seu jogo na Vercel acesse este script
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Se for apenas uma verificação de permissão (OPTIONS), encerra aqui
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Configuração de Segurança (Defina uma senha forte aqui)
$SECRET_KEY = "SUA_SENHA_SECRETA_DO_ENV"; 

// Verifica se a chave enviada pelo jogo bate com a chave daqui
if (!isset($_POST['key']) || $_POST['key'] !== $SECRET_KEY) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Acesso negado"]);
    exit;
}

// 2. Configuração do Upload
$target_dir = "uploads/dilemas/";
// Cria a pasta se ela não existir
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES["audio"])) {
    // Gera um nome único para não sobrescrever arquivos
    $extension = pathinfo($_FILES["audio"]["name"], PATHINFO_EXTENSION);
    if(!$extension) $extension = "webm"; // Padrão para gravação web
    
    $newFileName = "dilema_" . uniqid() . "." . $extension;
    $target_file = $target_dir . $newFileName;
    
    // Tenta mover o arquivo temporário para a pasta final
    if (move_uploaded_file($_FILES["audio"]["tmp_name"], $target_file)) {
        // Sucesso: Devolve a URL pública para o jogo salvar no banco
        $publicUrl = "https://" . $_SERVER['SERVER_NAME'] . "/" . $target_file;
        echo json_encode([
            "status" => "success", 
            "url" => $publicUrl,
            "message" => "Arquivo salvo com sucesso"
        ]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Falha ao mover arquivo"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Nenhum arquivo recebido"]);
}
?>
