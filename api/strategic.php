<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/strategic.class.php';

$_answers = new answers;
$_strategic = new strategic;

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
            $data = $_strategic->getStrategicPlan($_GET['idEmpresa']);
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
        
        if (!isset($_GET['action'])) {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        $action = $_GET['action'];
        $dataArray = null;

        if ($action === 'savePolicy') {
            $dataArray = $_strategic->savePolicy($data);
        } else if ($action === 'savePrinciple') {
            $dataArray = $_strategic->savePrinciple($data);
        } else if ($action === 'saveObjective') {
            $dataArray = $_strategic->saveObjective($data);
        } else if ($action === 'saveIndicator') {
            $dataArray = $_strategic->saveIndicator($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        
        if (isset($dataArray["result"]["error_id"])) {
            http_response_code($dataArray["result"]["error_id"]);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $data = json_decode($postBody, true);
        
        if (!isset($_GET['action'])) {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        $action = $_GET['action'];
        $dataArray = null;

        if ($action === 'deletePrinciple') {
            $dataArray = $_strategic->deletePrinciple($data);
        } else if ($action === 'deleteObjective') {
            $dataArray = $_strategic->deleteObjective($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        
        if(isset($dataArray["result"]["error_id"])) {
            http_response_code($dataArray["result"]["error_id"]);
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
