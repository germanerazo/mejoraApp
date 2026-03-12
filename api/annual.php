<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/annual.class.php';

$_answers = new answers;
$_annual = new annual;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        
        if (isset($_GET['idEmpresa'])) {
            $data = $_annual->listPlans($_GET['idEmpresa']);
            echo json_encode($data);
            http_response_code(200);
        } else if (isset($_GET['idPlan'])) {
            $data = $_annual->getFullPlan($_GET['idPlan']);
            if ($data) {
                echo json_encode($data);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_404());
            }
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $data = json_decode($postBody, true);
        
        $action = $_GET['action'] ?? '';
        $dataArray = null;

        if ($action === 'savePlan') {
            $dataArray = $_annual->savePlan($data);
        } else if ($action === 'saveObjective') {
            $dataArray = $_annual->saveObjective($data);
        } else if ($action === 'saveActivity') {
            $dataArray = $_annual->saveActivity($data);
        } else if ($action === 'saveSignatures') {
            $dataArray = $_annual->saveSignatures($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        
        http_response_code(isset($dataArray["result"]["error_id"]) ? $dataArray["result"]["error_id"] : 200);
        echo json_encode($dataArray);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $data = json_decode($postBody, true);
        
        $action = $_GET['action'] ?? '';
        $dataArray = null;

        if ($action === 'deletePlan') {
            $dataArray = $_annual->deletePlan($data);
        } else if ($action === 'deleteObjective') {
            $dataArray = $_annual->deleteObjective($data);
        } else if ($action === 'deleteActivity') {
            $dataArray = $_annual->deleteActivity($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        
        http_response_code(isset($dataArray["result"]["error_id"]) ? $dataArray["result"]["error_id"] : 200);
        echo json_encode($dataArray);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
