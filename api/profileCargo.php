<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/profileCargo.class.php';

$_answers = new answers;
$_profile = new profileCargo;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    // ── GET ──────────────────────────────────────────────────────────────────
    case 'GET':
        header('Content-Type: application/json');
        $action = $_GET['action'] ?? '';

        if ($action === 'personnel' && isset($_GET['idEmpresa'])) {
            // Lista de personal (roles) de process_personnel para llenar los selects
            echo json_encode($_profile->getPersonnelByEmpresa($_GET['idEmpresa']));

        } elseif ($action === 'list' && isset($_GET['idEmpresa'])) {
            // Lista de perfiles de cargo de la empresa
            echo json_encode($_profile->list($_GET['idEmpresa']));

        } elseif ($action === 'get' && isset($_GET['id'])) {
            // Perfil completo (con subtablas)
            $data = $_profile->get($_GET['id']);
            echo json_encode($data ?? []);

        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        http_response_code(200);
        break;

    // ── POST ─────────────────────────────────────────────────────────────────
    case 'POST':
        header('Content-Type: application/json');
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $_GET['action'] ?? '';
        $resp   = null;

        if ($action === 'create') {
            $resp = $_profile->post($data);
        } elseif ($action === 'addItem') {
            $resp = $_profile->addItem($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    // ── PUT ──────────────────────────────────────────────────────────────────
    case 'PUT':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true) ?? [];
        $resp = $_profile->put($data);
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    // ── DELETE ───────────────────────────────────────────────────────────────
    case 'DELETE':
        header('Content-Type: application/json');
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $action = $_GET['action'] ?? '';
        $resp   = null;

        if ($action === 'deleteItem') {
            $resp = $_profile->deleteItem($data);
        } else {
            $resp = $_profile->delete($data);
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
