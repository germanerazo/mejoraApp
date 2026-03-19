<?php
require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/legalMatrix.class.php';

$_answers     = new answers;
$_legalMatrix = new legalMatrix;

header('Content-Type: application/json');

switch ($_SERVER['REQUEST_METHOD']) {

    // ─────────────────────────────────────────────────────────────────────
    // GET  – Listar registros
    //   ?idEmpresa=X
    //   ?idEmpresa=X&clasificacion=H
    //   ?idEmpresa=X&norma=Decreto
    // ─────────────────────────────────────────────────────────────────────
    case 'GET':
        if (!isset($_GET['idEmpresa'])) {
            http_response_code(400);
            echo json_encode($_answers->error_400());
            break;
        }
        $data = $_legalMatrix->list(
            $_GET['idEmpresa'],
            $_GET['clasificacion'] ?? '',
            $_GET['norma']         ?? ''
        );
        http_response_code(200);
        echo json_encode($data);
        break;

    // ─────────────────────────────────────────────────────────────────────
    // POST – Crear  (normal) o Actualizar (con ?_method=PUT)
    //         o Eliminar todos (con ?_method=DELETE_ALL)
    // ─────────────────────────────────────────────────────────────────────
    case 'POST':
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (stripos($contentType, 'application/json') !== false) {
            $data = json_decode(file_get_contents('php://input'), true) ?? [];
        } else {
            $data = $_POST;
        }

        $overrideMethod = $_GET['_method'] ?? '';

        if ($overrideMethod === 'PUT') {
            $result = $_legalMatrix->put($data);
        } elseif ($overrideMethod === 'DELETE_ALL') {
            $result = $_legalMatrix->deleteAll($data);
        } else {
            $result = $_legalMatrix->post($data);
        }

        $code = isset($result['result']['error_id']) ? intval($result['result']['error_id']) : 200;
        http_response_code($code);
        echo json_encode($result);
        break;

    // ─────────────────────────────────────────────────────────────────────
    // PUT  – Actualizar (vía JSON body sin archivo)
    // ─────────────────────────────────────────────────────────────────────
    case 'PUT':
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $result = $_legalMatrix->put($data);
        $code   = isset($result['result']['error_id']) ? intval($result['result']['error_id']) : 200;
        http_response_code($code);
        echo json_encode($result);
        break;

    // ─────────────────────────────────────────────────────────────────────
    // DELETE – Eliminar un registro
    //          Body JSON: { idLegal, idEmpresa, token }
    //          Con flag ?_method=DELETE_ALL  → todos los de la empresa
    // ─────────────────────────────────────────────────────────────────────
    case 'DELETE':
        $data   = json_decode(file_get_contents('php://input'), true) ?? [];
        $overrideMethod = $_GET['_method'] ?? '';

        if ($overrideMethod === 'DELETE_ALL') {
            $result = $_legalMatrix->deleteAll($data);
        } else {
            $result = $_legalMatrix->delete($data);
        }

        $code = isset($result['result']['error_id']) ? intval($result['result']['error_id']) : 200;
        http_response_code($code);
        echo json_encode($result);
        break;

    default:
        http_response_code(405);
        echo json_encode($_answers->error_405());
        break;
}
?>
