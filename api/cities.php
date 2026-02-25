<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once '../class/cities.class.php';

$_answers = new answers;
$_cities  = new cities;

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
            // GET ?id=1  →  una ciudad por ID
            $city = $_cities->getCity($_GET['id']);
            if ($city) {
                echo json_encode($city);
                http_response_code(200);
            } else {
                http_response_code(404);
                echo json_encode($_answers->error_400());
            }

        } elseif (!empty($_GET['depto'])) {
            // GET ?depto=05  →  ciudades de un departamento
            $data = $_cities->getCitiesByDepto($_GET['depto']);
            echo json_encode($data);
            http_response_code(200);

        } elseif (isset($_GET['search']) && $_GET['search'] !== '') {
            // GET ?search=bogota  →  búsqueda por nombre
            $data = $_cities->searchCities($_GET['search']);
            echo json_encode($data);
            http_response_code(200);

        } elseif (!empty($_GET['page'])) {
            // GET ?page=1  →  listado completo paginado
            $data = $_cities->listCities($_GET['page']);
            echo json_encode($data);
            http_response_code(200);

        } else {
            // Sin parámetros: devuelve página 1 completa
            $data = $_cities->listCities(1);
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
