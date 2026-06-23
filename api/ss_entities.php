<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/ss_entities.class.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$_answers = new answers;
$_ss_entities = new ss_entities;

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        if (!isset($_GET['idEmpresa'])) { http_response_code(400); echo json_encode($_answers->error_400()); break; }
        $tipo = $_GET['tipo'] ?? null;
        echo json_encode($_ss_entities->list($_GET['idEmpresa'], $tipo));
        http_response_code(200);
        break;

    case 'POST':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) $data = $_POST;

        $method = $_GET['_method'] ?? '';
        
        if ($method === 'PUT') {
            $resp = $_ss_entities->put($data);
        } else {
            $resp = $_ss_entities->post($data);
        }
        
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'PUT':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $resp = $_ss_entities->put($data);
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $resp = $_ss_entities->delete($data);
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
}
?>
