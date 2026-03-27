<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/dangerMgmt.class.php';

$_answers = new answers;
$_mgmt = new dangerMgmt;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');
        $action = $_GET['action'] ?? '';

        if ($action === 'dangerTypes') {
            echo json_encode($_mgmt->getDangerTypes());
        } else if ($action === 'dangersByType' && isset($_GET['typeId'])) {
            echo json_encode($_mgmt->getDangersByType($_GET['typeId']));
        } else if ($action === 'allDangers') {
            echo json_encode($_mgmt->getAllDangers());
        } else if ($action === 'consequences') {
            echo json_encode($_mgmt->getConsequences());
        } else if ($action === 'consequencesByDanger' && isset($_GET['dangerId'])) {
            echo json_encode($_mgmt->getConsequencesByDanger($_GET['dangerId']));
        } else if ($action === 'measures') {
            echo json_encode($_mgmt->getPreventiveMeasures());
        } else if ($action === 'measuresByDanger' && isset($_GET['dangerId'])) {
            echo json_encode($_mgmt->getMeasuresByDanger($_GET['dangerId']));
        } else if ($action === 'activityDangers' && isset($_GET['idActivity'])) {
            $idP = isset($_GET['idPlan']) ? $_GET['idPlan'] : null;
            echo json_encode($_mgmt->getActivityDangers($_GET['idActivity'], $idP));
        } else if ($action === 'fullReport' && isset($_GET['idEmpresa'])) {
            $idP = isset($_GET['idPlan']) ? $_GET['idPlan'] : null;
            echo json_encode($_mgmt->getFullReport($_GET['idEmpresa'], $idP));
        } else if ($action === 'getRiskPrograms' && isset($_GET['idPlan'])) {
            echo json_encode($_mgmt->getRiskPrograms($_GET['idPlan']));
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
        }
        http_response_code(200);
        break;

    case 'POST':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? '';
        $resp = null;

        if ($action === 'addDanger') {
            $resp = $_mgmt->addActivityDanger($data);
        } else if ($action === 'addConsequence') {
            $resp = $_mgmt->addConsequence($data);
        } else if ($action === 'addMeasure') {
            $resp = $_mgmt->addMeasure($data);
        } else if ($action === 'saveRiskProgram') {
            $resp = $_mgmt->saveRiskProgram($data);
        } else if ($action === 'initProcessRiskPlan') {
            $resp = $_mgmt->initProcessRiskPlan($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    case 'DELETE':
        header('Content-Type: application/json');
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $_GET['action'] ?? '';
        $resp = null;

        if ($action === 'removeDanger') {
            $resp = $_mgmt->removeActivityDanger($data);
        } else if ($action === 'removeConsequence') {
            $resp = $_mgmt->removeConsequence($data);
        } else if ($action === 'removeMeasure') {
            $resp = $_mgmt->removeMeasure($data);
        } else {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }

        http_response_code(isset($resp['result']['error_id']) ? $resp['result']['error_id'] : 200);
        echo json_encode($resp);
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
}
?>
