<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/entryMedicalFiles.class.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$_answers = new answers;
$_emf = new entryMedicalFiles;

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        if (!isset($_GET['idEmpresa']) || !isset($_GET['idEntry'])) {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        echo json_encode($_emf->list($_GET['idEmpresa'], $_GET['idEntry']));
        http_response_code(200);
        break;

    case 'POST':
        header('Content-Type: application/json');
        
        // Always multipart/form-data for file uploads
        $data = $_POST;
        $files = $_FILES;
        
        if (isset($data['_method']) && $data['_method'] === 'PUT') {
            $resp = $_emf->put($data, $files);
        } else {
            $resp = $_emf->post($data, $files);
        }
        
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $resp = $_emf->delete($data);
        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
}
?>
