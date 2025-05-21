<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/options.class.php';

$_answers = new answers;
$_options = new options;

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        header('Content-Type: application/json');

        if (!empty($_GET['page'])) {
            echo json_encode($_options->listOptions($_GET['page']));
            http_response_code(200);
        } elseif (!empty($_GET['id'])) {
            echo json_encode($_options->getOption($_GET['id']));
            http_response_code(200);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        break;

    case 'POST':
        header('Content-Type: application/json');
        $postBody = file_get_contents('php://input');
        $dataArray = $_options->post($postBody);
        if(isset($dataArray["result"]["error_id"])) {
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
        $dataArray = $_options->put($postBody);
        if(isset($dataArray["result"]["error_id"])) {
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
        $dataArray = $_options->delete($postBody);
        if(isset($dataArray["result"]["error_id"])) {
            $responseCode = $dataArray["result"]["error_id"];
            http_response_code($responseCode);
        } else {
            http_response_code(200);
        }
        echo json_encode($dataArray);
        // Handle DELETE request
        break;

    default:
        // Method not allowed
        header('Content-Type: application/json');
        $dataArray = $_answers->error_405();
        echo json_encode($dataArray);
        break;
}
?>
