<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/access.class.php';

$_answers = new answers;
$_access = new access;
// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
// Permitir cabeceras personalizadas
header("Access-Control-Allow-Headers: Content-Type, Authorization");
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        header('Content-Type: application/json');

        if (!empty($_GET['page'])) {
            echo json_encode($_access->listAccess($_GET['page']));
            http_response_code(200);
        } elseif (!empty($_GET['id'])) {
            echo json_encode($_access->getAccess($_GET['id']));
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_access->post($postBody);
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
        $postBody = file_get_contents('php://input');
        $dataArray = $_access->put($postBody);
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
        $dataArray = $_users->delete($postBody);
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        break;

    default:
        header('Content-Type: application/json');
        http_response_code(405); // Método no permitido
        echo json_encode($_answers->error_405());
}
