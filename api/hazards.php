<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/hazards.class.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$_answers = new answers;
$_hazards = new hazards;

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        if (!isset($_GET['idEmpresa'])) { http_response_code(400); echo json_encode($_answers->error_400()); break; }
        echo json_encode($_hazards->list($_GET['idEmpresa']));
        http_response_code(200);
        break;

    case 'POST':
        header('Content-Type: application/json');
        $method = $_GET['_method'] ?? '';
        $data   = array_merge($_POST, []);

        if ($method === 'PUT') {
            $resp = $_hazards->put($data, $_FILES);
        } else {
            $resp = $_hazards->post($data, $_FILES);
        }
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $resp = $_hazards->delete($data);
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
}
?>
