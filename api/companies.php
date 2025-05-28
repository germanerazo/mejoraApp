<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/companies.class.php';

$_answers = new answers;
$_companies = new companies;
// Permitir solicitudes desde cualquier origen
header("Access-Control-Allow-Origin: *");
// Permitir cabeceras personalizadas
header("Access-Control-Allow-Headers: Content-Type, Authorization");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        header('Content-Type: application/json');

        if (!empty($_GET['page'])) {
            echo json_encode($_companies->listCompanies($_GET['page']));
            http_response_code(200);
        } elseif (!empty($_GET['id'])) {
            echo json_encode($_companies->getCompany($_GET['id']));
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_companies->post($postBody);
        if(isset($dataArray["result"]["error_id"])) {
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
        $dataArray = $_companies->put($postBody);
        if(isset($dataArray["result"]["error_id"])) {
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
        $dataArray = $_companies->delete($postBody);
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
        $dataArray = $_answers->error_405();
        echo json_encode($dataArray);
        break;
}