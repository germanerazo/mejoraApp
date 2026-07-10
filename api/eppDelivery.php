<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/eppDelivery.class.php';

$_answers = new answers;
$_eppDelivery = new eppDelivery;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        header('Content-Type: application/json');
        if (isset($_GET['idEmpresa'])) {
            $data = $_eppDelivery->getDeliveryData($_GET['idEmpresa']);
            echo json_encode($data);
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $data = json_decode($postBody, true);
        
        if (isset($data['idEmpresa'])) {
            $dataArray = $_eppDelivery->saveDelivery($data);
            if (isset($dataArray["result"]["error_id"])) {
                http_response_code($dataArray["result"]["error_id"]);
            } else {
                http_response_code(200);
            }
            echo json_encode($dataArray);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if ($id) {
            $dataArray = $_eppDelivery->deleteDelivery($id);
            if (isset($dataArray["result"]["error_id"])) {
                http_response_code($dataArray["result"]["error_id"]);
            } else {
                http_response_code(200);
            }
            echo json_encode($dataArray);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
