<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class riskConsolidation extends connection {
    public function getProgram($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        
        // Ensure table has the new columns if they were missing from the initial script
        // In a real env, use proper migrations
        try {
            parent::nonQuery("ALTER TABLE risk_program_measures ADD COLUMN recurso VARCHAR(100) AFTER responsable");
        } catch(Exception $e) {}
        try {
            parent::nonQuery("ALTER TABLE risk_program_measures ADD COLUMN cargos TEXT AFTER fecha");
        } catch(Exception $e) {}
        try {
            parent::nonQuery("ALTER TABLE risk_program_indicators ADD COLUMN responsable VARCHAR(100) AFTER formula");
        } catch(Exception $e) {}
        try {
            parent::nonQuery("ALTER TABLE risk_program_indicators ADD COLUMN tipo_indicador VARCHAR(100) AFTER periodicidad");
        } catch(Exception $e) {}
        try {
            parent::nonQuery("ALTER TABLE risk_program_indicators ADD COLUMN tipo_limite VARCHAR(100) AFTER tipo_indicador");
        } catch(Exception $e) {}
        try {
            parent::nonQuery("CREATE TABLE IF NOT EXISTS risk_program_dangers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                id_program INT NOT NULL,
                danger_name VARCHAR(255) NOT NULL
            )");
        } catch(Exception $e) {}

        // Get Program
        $queryProgram = "SELECT * FROM risk_program WHERE id_empresa = $idEmpresa LIMIT 1";
        $programData = parent::getData($queryProgram);
        
        if (empty($programData)) {
            // Mock empty state if not exists
            return [
                "status" => "ok",
                "result" => [
                    "programa" => [
                        "id" => null,
                        "objetivo" => "",
                        "marcoLegal" => "",
                        "peligrosAsociados" => []
                    ],
                    "indicadores" => [],
                    "medidas" => []
                ]
            ];
        }

        $program = $programData[0];
        $idProgram = $program['id'];

        // Get Indicators
        $queryIndicators = "SELECT * FROM risk_program_indicators WHERE id_program = $idProgram";
        $indicators = parent::getData($queryIndicators);

        // Get Measures
        $queryMeasures = "SELECT * FROM risk_program_measures WHERE id_program = $idProgram";
        $measuresRaw = parent::getData($queryMeasures);
        
        $medidas = [];
        foreach($measuresRaw as $m) {
            $medidas[] = [
                'id' => $m['id'],
                'medida' => $m['accion'],
                'responsable' => $m['responsable'],
                'recurso' => $m['recurso'] ?? '',
                'fechaPlaneacion' => $m['fecha'],
                'cargos' => empty($m['cargos']) ? [] : json_decode($m['cargos'], true)
            ];
        }

        $indicadores = [];
        foreach($indicators as $i) {
            $indicadores[] = [
                'id' => $i['id'],
                'formula' => $i['formula'],
                'responsable' => $i['responsable'] ?? '',
                'limiteEsperado' => $i['limite_esperado'],
                'limiteCritico' => $i['limite_critico'],
                'fuente' => $i['fuente'],
                'periodicidad' => $i['periodicidad'],
                'tipo_indicador' => $i['tipo_indicador'] ?? '',
                'tipo_limite' => $i['tipo_limite'] ?? '',
                'dirigidoA' => $i['dirigido_a']
            ];
        }

        // Get Dangers
        $queryDangers = "SELECT id, danger_name as nombre FROM risk_program_dangers WHERE id_program = $idProgram";
        $dangers = parent::getData($queryDangers);
        $peligrosAsociados = is_array($dangers) ? $dangers : [];

        return [
            "status" => "ok",
            "result" => [
                "programa" => [
                    "id" => $idProgram,
                    "objetivo" => $program['objetivo'],
                    "marcoLegal" => $program['marco_legal'],
                    "peligrosAsociados" => $peligrosAsociados
                ],
                "indicadores" => $indicadores,
                "medidas" => $medidas
            ]
        ];
    }
    
    public function saveProgram($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $objetivo = addslashes($data['objetivo'] ?? '');
        $marcoLegal = addslashes($data['marcoLegal'] ?? '');
        
        // Check if exists
        $check = parent::getData("SELECT id FROM risk_program WHERE id_empresa = $idEmpresa");
        if (empty($check)) {
            $query = "INSERT INTO risk_program (id_empresa, objetivo, marco_legal) VALUES ($idEmpresa, '$objetivo', '$marcoLegal')";
            $id = parent::nonQueryId($query);
        } else {
            $id = $check[0]['id'];
            $query = "UPDATE risk_program SET objetivo = '$objetivo', marco_legal = '$marcoLegal' WHERE id = $id";
            parent::nonQuery($query);
        }
        
        return ["status" => "ok", "result" => ["idProgram" => $id]];
    }

    public function saveActionData($data) {
        $idEmpresa = intval($data['idEmpresa']);
        // Ensure program exists
        $prog = $this->saveProgram($data);
        $idProgram = $prog['result']['idProgram'];

        // We receive the whole object of medidas, indicadores and programa (peligros)
        // For simplicity we truncate and insert to sync the state.
        
        parent::nonQuery("DELETE FROM risk_program_dangers WHERE id_program = $idProgram");
        if (isset($data['programa']['peligrosAsociados']) && is_array($data['programa']['peligrosAsociados'])) {
            foreach ($data['programa']['peligrosAsociados'] as $p) {
                $nombre = addslashes($p['nombre'] ?? '');
                if (!empty($nombre)) {
                    $query = "INSERT INTO risk_program_dangers (id_program, danger_name) VALUES ($idProgram, '$nombre')";
                    parent::nonQueryId($query);
                }
            }
        }
        
        parent::nonQuery("DELETE FROM risk_program_indicators WHERE id_program = $idProgram");
        if (isset($data['indicadores']) && is_array($data['indicadores'])) {
            foreach ($data['indicadores'] as $ind) {
                $formula = addslashes($ind['formula'] ?? '');
                $responsable = addslashes($ind['responsable'] ?? '');
                $esperado = addslashes($ind['limiteEsperado'] ?? '');
                $critico = addslashes($ind['limiteCritico'] ?? '');
                $fuente = addslashes($ind['fuente'] ?? '');
                $periodicidad = addslashes($ind['periodicidad'] ?? '');
                $dirigidoA = addslashes($ind['dirigidoA'] ?? '');
                
                $tipoIndicador = addslashes($ind['tipoIndicador'] ?? $ind['tipo_indicador'] ?? '');
                $tipoLimite = addslashes($ind['tipoLimite'] ?? $ind['tipo_limite'] ?? '');
                
                $query = "INSERT INTO risk_program_indicators (id_program, formula, responsable, limite_esperado, limite_critico, fuente, periodicidad, tipo_indicador, tipo_limite, dirigido_a) 
                          VALUES ($idProgram, '$formula', '$responsable', '$esperado', '$critico', '$fuente', '$periodicidad', '$tipoIndicador', '$tipoLimite', '$dirigidoA')";
                parent::nonQueryId($query);
            }
        }
        
        parent::nonQuery("DELETE FROM risk_program_measures WHERE id_program = $idProgram");
        if (isset($data['medidas']) && is_array($data['medidas'])) {
            foreach ($data['medidas'] as $med) {
                $accion = $med['medida'] ?? '';
                $responsable = $med['responsable'] ?? '';
                $recurso = $med['recurso'] ?? '';
                $fecha = $med['fechaPlaneacion'] ?? date('Y-m-d');
                $cargos = isset($med['cargos']) ? json_encode($med['cargos']) : '[]';
                
                $query = "INSERT INTO risk_program_measures (id_program, accion, responsable, recurso, fecha, cargos) 
                          VALUES ($idProgram, '$accion', '$responsable', '$recurso', '$fecha', '$cargos')";
                parent::nonQueryId($query);
            }
        }

        return ["status" => "ok", "result" => "Saved"];
    }
}
?>
