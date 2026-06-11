<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/copasst.class.php';

$_answers = new answers;
$_copasst = new copasst;

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
        
        // Requiere parametro obligatorio idEmpresa
        if (isset($_GET['idEmpresa'])) {
            $data = $_copasst->listCopasst($_GET['idEmpresa']);
            echo json_encode($data);
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        
        // Permite variables en JSON body o multipart/form-data
        if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
            $postBody = file_get_contents('php://input');
            $data = json_decode($postBody, true);
        } else {
            $data = $_POST;
        }

        $files = $_FILES;
        
        $dataArray = $_copasst->post($data, $files);
        
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_copasst->delete(json_decode($postBody, true));
        if(isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
