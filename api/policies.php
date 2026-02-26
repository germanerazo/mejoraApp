<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/policies.class.php';

$_answers = new answers;
$_policies = new policies;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        
        // Requiere parametro obligatorios idEmpresa
        if (isset($_GET['idEmpresa'])) {
            $data = $_policies->listPolicies($_GET['idEmpresa']);
            echo json_encode($data);
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        
        // Permite variables en JSON body o multipart/form-data
        if (isset($_SERVER["CONTENT_TYPE"]) && strpos($_SERVER["CONTENT_TYPE"], "application/json") !== false) {
            $postBody = file_get_contents('php://input');
            $data = json_decode($postBody, true);
        } else {
            $data = $_POST;
        }

        $files = $_FILES;
        
        if (isset($_GET['_method']) && $_GET['_method'] === 'PUT') {
            $dataArray = $_policies->put($data, $files);
        } else {
            $dataArray = $_policies->post($data, $files);
        }
        
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    case 'PUT':
        header('Content-Type: application/json');
        // Cuando hay subida de archivos (multipart), PUT en PHP no recibe $_POST ni $_FILES.
        // Simulamos el PUT usando POST y un parametro _method=PUT. Así que aquí la lógica PUT
        // a menudo se rutea en POST, pero mantengamos PUT estándar para el caso de JSON sin archivos.
        $postBody = file_get_contents('php://input');
        $data = json_decode($postBody, true);
        
        // Si no hay json, podría ser parse_str si es urlencoded, pero como pasaremos FormData 
        // desde JS, vamos a capturarlo en el case POST con un flag.
        if (empty($data)) {
            parse_str($postBody, $data);
        }
        
        $files = []; // En PUT puro de PHP $_FILES no funciona out of the box. 

        $dataArray = $_policies->put($data, $files);
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_policies->delete(json_decode($postBody, true));
        if(isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
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
