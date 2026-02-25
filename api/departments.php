<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/departments.class.php';

$_answers     = new answers;
$_departments = new departments;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        header('Content-Type: application/json');

        if (!empty($_GET['id'])) {
            // GET ?id=1  →  un departamento por ID
            $dept = $_departments->getDepartment($_GET['id']);
            if ($dept) {
                echo json_encode($dept);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_400());
            }

        } elseif (!empty($_GET['code'])) {
            // GET ?code=05  →  un departamento por código
            $dept = $_departments->getDepartmentByCode($_GET['code']);
            if ($dept) {
                echo json_encode($dept);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_400());
            }

        } elseif (isset($_GET['search']) && $_GET['search'] !== '') {
            // GET ?search=antioquia  →  búsqueda por nombre
            $data = $_departments->searchDepartments($_GET['search']);
            echo json_encode($data);
            http_response_code(200);

        } elseif (!empty($_GET['page'])) {
            // GET ?page=1  →  listado paginado
            $data = $_departments->listDepartments($_GET['page']);
            echo json_encode($data);
            http_response_code(200);

        } else {
            // Sin parámetros: devuelve todos los departamentos
            $data = $_departments->listDepartments(1);
            echo json_encode($data);
            http_response_code(200);
        }
        break;

    default:
        header('Content-Type: application/json');
        echo json_encode($_answers->error_405());
        http_response_code(405);
        break;
}
?>
