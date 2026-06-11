<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/dangerCatalog.class.php';

$_answers = new answers;
$_catalog = new dangerCatalog;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        $action = $_GET['action'] ?? '';

        if ($action === 'list') {
            echo json_encode($_catalog->listDangers());
        } else if ($action === 'listTypes') {
            echo json_encode($_catalog->listTypes());
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        http_response_code(200);
        break;

    case 'POST':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? '';
        $resp = null;

        if ($action === 'createType') {
            $resp = $_catalog->createType($data);
        } else if ($action === 'createDanger') {
            $resp = $_catalog->createDanger($data);
        } else if ($action === 'updateType') {
            $resp = $_catalog->updateType($data);
        } else if ($action === 'updateDanger') {
            $resp = $_catalog->updateDanger($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? '';
        $resp = null;

        if ($action === 'deleteType') {
            $resp = $_catalog->deleteType($data);
        } else if ($action === 'deleteDanger') {
            $resp = $_catalog->deleteDanger($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
}
?>
