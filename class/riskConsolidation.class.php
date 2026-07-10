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
            parent::nonQuery("ALTER TABLE risk_program_measures ADD COLUMN cargos TEXT AFTER fecha");
        } catch(Exception $e) {
            // ignore if already exists
        }

        // Get Program
        $queryProgram = "SELECT * FROM risk_program WHERE id_empresa = $idEmpresa LIMIT 1";
        $programData = parent::obtenerDatos($queryProgram);
        
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
        $indicators = parent::obtenerDatos($queryIndicators);

        // Get Measures
        $queryMeasures = "SELECT * FROM risk_program_measures WHERE id_program = $idProgram";
        $measuresRaw = parent::obtenerDatos($queryMeasures);
        
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
                'limiteEsperado' => $i['limite_esperado'],
                'limiteCritico' => $i['limite_critico'],
                'fuente' => $i['fuente'],
                'periodicidad' => $i['periodicidad'],
                'dirigidoA' => $i['dirigido_a']
            ];
        }

        return [
            "status" => "ok",
            "result" => [
                "programa" => [
                    "id" => $idProgram,
                    "objetivo" => $program['objetivo'],
                    "marcoLegal" => $program['marco_legal'],
                    "peligrosAsociados" => [] // simplified
                ],
                "indicadores" => $indicadores,
                "medidas" => $medidas
            ]
        ];
    }
    
    public function saveProgram($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $objetivo = parent::nonQueryId("SELECT '" . ($data['objetivo'] ?? '') . "'");
        $marcoLegal = parent::nonQueryId("SELECT '" . ($data['marcoLegal'] ?? '') . "'");
        
        // Check if exists
        $check = parent::obtenerDatos("SELECT id FROM risk_program WHERE id_empresa = $idEmpresa");
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

        // We receive the whole object of medidas and indicadores. 
        // For simplicity we truncate and insert to sync the state.
        
        parent::nonQuery("DELETE FROM risk_program_indicators WHERE id_program = $idProgram");
        if (isset($data['indicadores']) && is_array($data['indicadores'])) {
            foreach ($data['indicadores'] as $ind) {
                $formula = $ind['formula'] ?? '';
                $esperado = $ind['limiteEsperado'] ?? '';
                $critico = $ind['limiteCritico'] ?? '';
                $fuente = $ind['fuente'] ?? '';
                $periodicidad = $ind['periodicidad'] ?? '';
                $dirigidoA = $ind['dirigidoA'] ?? '';
                
                $query = "INSERT INTO risk_program_indicators (id_program, formula, limite_esperado, limite_critico, fuente, periodicidad, dirigido_a) 
                          VALUES ($idProgram, '$formula', '$esperado', '$critico', '$fuente', '$periodicidad', '$dirigidoA')";
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
