<?php
require_once '../class/auth.class.php';
require_once '../class/answers.class.php';

$_answers = new answers;
$_auth = new auth; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Set the content type to JSON
    $postBody = file_get_contents('php://input');
    $dataArray = $_auth->login($postBody);
    header('Content-Type: application/json');
    if (isset($dataArray['result']['error_id'])) {
        $responseCode = $dataArray['result']['error_id'];
        http_response_code($responseCode);
    } else {
        http_response_code(200);
    }
    echo (json_encode($dataArray));
} else {
    header('Content-Type: application/json');
    $dataArray = $_answers->error_405();
    echo json_encode($dataArray);
}

?>