<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, token");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
require_once '../class/audit.class.php';
require_once '../class/answers.class.php';

$_answers = new answers;
$_audit = new audit;

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // API to log an action manually from front-end if needed
    $postBody = file_get_contents("php://input");
    $data = json_decode($postBody, true);
    
    if (isset($data['action'])) {
        $details = isset($data['details']) ? json_encode($data['details']) : '';
        $tableName = isset($data['table_name']) ? $data['table_name'] : 'N/A';
        $resp = $_audit->createAudit($data['action'], $details, $tableName);
        http_response_code(200);
        echo json_encode(["status" => "ok", "audit_id" => $resp]);
    } else {
        http_response_code(400);
        echo json_encode($_answers->error_400());
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // Fetch logs (would need token validation for admin in real scenario)
    $query = "SELECT * FROM audit_logs ORDER BY date_time DESC LIMIT 100";
    $data = $_audit->getData($query);
    http_response_code(200);
    echo json_encode($data);
} else {
    header('Content-Type: application/json');
    $dataArray = $_answers->error_405();
    echo json_encode($dataArray);
}
?>
