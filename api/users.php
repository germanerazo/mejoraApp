<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/users.class.php';

$_answers = new answers;
$_users = new users;
// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// Permitir cabeceras personalizadas
header("Access-Control-Allow-Headers: Content-Type, Authorization");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        header('Content-Type: application/json');

        if (!empty($_GET['page'])) {
            echo json_encode($_users->listUsers($_GET['page']));
            http_response_code(200);
        } elseif (!empty($_GET['id'])) {
            echo json_encode($_users->getUser($_GET['id']));
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_users->post($postBody);
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        // Handle POST request
        break;

    case 'PUT':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_users->put($postBody);
        if (isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        // Handle PUT request
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
        // Handle DELETE request
        break;

    default:
        // Handle unsupported request methods
        header('Content-Type: application/json');
        $dataArray = $_answers->error_405();
        echo json_encode($dataArray);
        break;
}
