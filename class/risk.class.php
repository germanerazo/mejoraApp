<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class risk extends connection {
    public function getRiskSummary($idEmpresa) {
        // En una implementación completa, esto haría un GROUP BY de la tabla risk_matrix
        // Por ahora, devolveremos una estructura que reemplace el mock data
        $queryHazards = "
            SELECT 
                danger_type as name,
                SUM(CASE WHEN acceptability = 'No Aceptable' THEN 1 ELSE 0 END) as noAceptable,
                SUM(CASE WHEN acceptability = 'Aceptable con Control Especifico' THEN 1 ELSE 0 END) as conControl,
                SUM(CASE WHEN acceptability = 'Mejorable' THEN 1 ELSE 0 END) as mejorable,
                SUM(CASE WHEN acceptability = 'Aceptable' THEN 1 ELSE 0 END) as aceptable
            FROM risk_matrix 
            WHERE id_empresa = $idEmpresa
            GROUP BY danger_type
        ";
        
        $queryProcesses = "
            SELECT 
                process as name,
                SUM(CASE WHEN acceptability = 'No Aceptable' THEN 1 ELSE 0 END) as noAceptable,
                SUM(CASE WHEN acceptability = 'Aceptable con Control Especifico' THEN 1 ELSE 0 END) as conControl,
                SUM(CASE WHEN acceptability = 'Mejorable' THEN 1 ELSE 0 END) as mejorable,
                SUM(CASE WHEN acceptability = 'Aceptable' THEN 1 ELSE 0 END) as aceptable
            FROM risk_matrix 
            WHERE id_empresa = $idEmpresa
            GROUP BY process
        ";
        
        $queryPrevention = "SELECT DISTINCT effects as prevention FROM risk_matrix WHERE id_empresa = $idEmpresa AND effects IS NOT NULL AND effects != '' LIMIT 10";

        // Si la tabla está vacía, retornar datos por defecto para que la vista no se rompa (simulando que aún no hay datos cargados)
        $hazards = parent::obtenerDatos($queryHazards);
        $processes = parent::obtenerDatos($queryProcesses);
        $preventionRaw = parent::obtenerDatos($queryPrevention);
        
        $prevention = [];
        foreach ($preventionRaw as $p) {
            $prevention[] = $p['prevention'];
        }

        if (empty($hazards)) {
            $hazards = [
                ["name" => "Biomecánico", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0],
                ["name" => "Físico", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0],
                ["name" => "Psicosocial", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0],
                ["name" => "Condiciones de Seguridad", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0]
            ];
        }
        
        if (empty($processes)) {
            $processes = [
                ["name" => "Gestión Administrativa", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0],
                ["name" => "Operaciones", "noAceptable" => 0, "conControl" => 0, "mejorable" => 0, "aceptable" => 0]
            ];
        }

        return [
            "status" => "ok",
            "result" => [
                "hazards" => $hazards,
                "processes" => $processes,
                "prevention" => $prevention
            ]
        ];
    }
}
?>
