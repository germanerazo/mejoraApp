<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/personnel.class.php';

$_answers = new answers;
$_personnel = new personnel;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    if (isset($_GET['idEmpresa'])) {
        $data = $_personnel->getPersonnel($_GET['idEmpresa']);
        echo json_encode($data);
        http_response_code(200);
    } else {
        http_response_code(400);
        echo json_encode($_answers->error_400());
    }
} else {
    header('Content-Type: application/json');
    echo json_encode($_answers->error_405());
    http_response_code(405);
}
?>
