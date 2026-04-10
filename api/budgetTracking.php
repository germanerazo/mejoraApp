<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/budgetTracking.class.php';

$_answers  = new answers;
$_tracking = new budgetTracking;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    // ── GET ──────────────────────────────────────────────────────────────────
    case 'GET':
        header('Content-Type: application/json');

        // ?idBudget=X  → tracking data (12 months)
        if (isset($_GET['idBudget'])) {
            $data = $_tracking->getTracking($_GET['idBudget']);
            if ($data) {
                echo json_encode($data);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_404());
            }

        // ?idEmpresa=X  → list of budget years
        } elseif (isset($_GET['idEmpresa'])) {
            echo json_encode($_tracking->listYears($_GET['idEmpresa']));
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

        if ($action === 'saveTracking') {
            $resp = $_tracking->saveTracking($data);
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
