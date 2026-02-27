<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/processSheet.class.php';

$_answers = new answers;
$_sheet = new processSheet;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        if (isset($_GET['idEmpresa']) && isset($_GET['code'])) {
            $data = $_sheet->getSheetData($_GET['idEmpresa'], $_GET['code']);
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
        
        if (isset($_GET['action']) && $_GET['action'] == 'saveSheet') {
            $dataArray = $_sheet->saveSheet($data);
        } else if (isset($_GET['action']) && $_GET['action'] == 'manageItem') {
            $dataArray = $_sheet->manageItem($data);
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

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
