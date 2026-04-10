<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/budget.class.php';

$_answers = new answers;
$_budget  = new budget;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    // ── GET ──────────────────────────────────────────────────────────────────
    case 'GET':
        header('Content-Type: application/json');

        // ?idBudget=X  → full budget with items
        if (isset($_GET['idBudget'])) {
            $data = $_budget->getBudget($_GET['idBudget']);
            if ($data) {
                echo json_encode($data);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_404());
            }

        // ?idEmpresa=X  → list of years
        } elseif (isset($_GET['idEmpresa'])) {
            echo json_encode($_budget->listBudgets($_GET['idEmpresa']));
            http_response_code(200);

        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    // ── POST ─────────────────────────────────────────────────────────────────
    case 'POST':
        header('Content-Type: application/json');
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $_GET['action'] ?? '';

        if ($action === 'createBudget') {
            $resp = $_budget->createBudget($data);
        } elseif ($action === 'saveItem') {
            $resp = $_budget->saveItem($data);
        } elseif ($action === 'saveAllItems') {
            $resp = $_budget->saveAllItems($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? (int)$resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    // ── DELETE ────────────────────────────────────────────────────────────────
    case 'DELETE':
        header('Content-Type: application/json');
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $_GET['action'] ?? '';

        if ($action === 'deleteBudget') {
            $resp = $_budget->deleteBudget($data);
        } elseif ($action === 'deleteItem') {
            $resp = $_budget->deleteItem($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? (int)$resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
