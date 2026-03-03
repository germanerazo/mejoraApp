<?php
require_once '../class/legalProcedure.class.php';
$_legal = new legalProcedure;

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $idEmpresa = intval($_GET['idEmpresa'] ?? 0);
    if ($idEmpresa) {
        $data = $_legal->list($idEmpresa);
        header('Content-Type: application/json');
        echo json_encode($data);
    }
} elseif ($method === 'POST') {
    $_method = $_GET['_method'] ?? 'POST';
    if ($_method === 'PUT') {
        $data = $_POST;
        $files = $_FILES;
        $resp = $_legal->put($data, $files);
        header('Content-Type: application/json');
        echo json_encode($resp);
    } else {
        $data = $_POST;
        $files = $_FILES;
        $resp = $_legal->post($data, $files);
        header('Content-Type: application/json');
        echo json_encode($resp);
    }
} elseif ($method === 'DELETE') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $resp = $_legal->delete($data);
    header('Content-Type: application/json');
    echo json_encode($resp);
}
?>
