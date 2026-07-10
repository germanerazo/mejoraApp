<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class personnel extends connection {
    public function getPersonnel($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, cargo, reporta, personas, responsabilidades, rendicion, frecuencia FROM personnel_profile WHERE id_empresa = $idEmpresa ORDER BY id ASC";
        $data = parent::obtenerDatos($query);
        
        $formattedData = [];
        foreach ($data as $row) {
            $respArray = array_filter(array_map('trim', explode("\n", $row['responsabilidades'])));
            $formattedData[] = [
                'id' => $row['id'],
                'cargo' => $row['cargo'],
                'reporta' => $row['reporta'],
                'personas' => $row['personas'],
                'responsabilidades' => empty($respArray) ? [] : array_values($respArray),
                'rendicion' => $row['rendicion'],
                'frecuencia' => $row['frecuencia']
            ];
        }

        // Si no hay datos, devolver los datos de prueba temporalmente para no romper la vista
        if (empty($formattedData)) {
            $formattedData = [
                [
                    'cargo' => 'Gerente General',
                    'reporta' => 'Junta Directiva',
                    'personas' => 1,
                    'responsabilidades' => ['Definir la estrategia corporativa', 'Aprobar presupuestos anuales', 'Representar legalmente a la compañía'],
                    'rendicion' => 'Informe de Gestión',
                    'frecuencia' => 'Anual'
                ],
                [
                    'cargo' => 'Director Logístico',
                    'reporta' => 'Gerente General',
                    'personas' => 1,
                    'responsabilidades' => ['Gestionar la cadena de suministro', 'Supervisar personal de bodega', 'Optimizar rutas de entrega'],
                    'rendicion' => 'Indicadores de Cumplimiento',
                    'frecuencia' => 'Mensual'
                ]
            ];
        }

        return [
            "status" => "ok",
            "result" => $formattedData
        ];
    }
}
?>
