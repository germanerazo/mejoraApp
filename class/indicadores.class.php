<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class indicadores extends connection {
    public function getIndicadores($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, nombre, objetivo, responsable, dirigido_a as dirigido, fuente, formula, periodicidad, tipo, tipo_limite as tipoLimite, esperado, critico FROM indicadores WHERE id_empresa = $idEmpresa ORDER BY id ASC";
        $data = parent::obtenerDatos($query);
        
        // Return fallback if empty
        if (empty($data)) {
            $data = [
                [
                    "id" => 1,
                    "nombre" => "Frecuencia de Accidentalidad",
                    "objetivo" => "Medir la frecuencia con la que ocurren accidentes de trabajo.",
                    "responsable" => "Lider SST",
                    "dirigido" => "Alta Gerencia",
                    "fuente" => "Reportes AT",
                    "formula" => "(N° AT / N° Trabajadores) * 100",
                    "periodicidad" => "Mensual",
                    "tipo" => "Resultado",
                    "tipoLimite" => "Menor o Igual",
                    "esperado" => "<= 5%",
                    "critico" => "> 10%"
                ],
                [
                    "id" => 2,
                    "nombre" => "Eficiencia de Capacitación",
                    "objetivo" => "Evaluar el impacto de las capacitaciones bimestrales.",
                    "responsable" => "Coordinador HSEQ",
                    "dirigido" => "Copasst",
                    "fuente" => "Evaluaciones",
                    "formula" => "(Evaluaciones aprobadas / Total evaluaciones) * 100",
                    "periodicidad" => "Bimestral",
                    "tipo" => "Proceso",
                    "tipoLimite" => "Mayor o Igual",
                    "esperado" => ">= 90%",
                    "critico" => "< 80%"
                ]
            ];
            // Insert mock data to DB for initial use
            foreach($data as $d) {
                $this->saveIndicador(array_merge(["idEmpresa" => $idEmpresa, "id" => 0], $d));
            }
            $data = parent::obtenerDatos($query);
        }

        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveIndicador($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        
        $nombre = parent::nonQueryId("SELECT '" . ($data['nombre'] ?? '') . "'");
        $objetivo = parent::nonQueryId("SELECT '" . ($data['objetivo'] ?? '') . "'");
        $responsable = parent::nonQueryId("SELECT '" . ($data['responsable'] ?? '') . "'");
        $dirigido = parent::nonQueryId("SELECT '" . ($data['dirigido'] ?? '') . "'");
        $fuente = parent::nonQueryId("SELECT '" . ($data['fuente'] ?? '') . "'");
        $formula = parent::nonQueryId("SELECT '" . ($data['formula'] ?? '') . "'");
        $periodicidad = parent::nonQueryId("SELECT '" . ($data['periodicidad'] ?? '') . "'");
        $tipo = parent::nonQueryId("SELECT '" . ($data['tipo'] ?? '') . "'");
        $tipoLimite = parent::nonQueryId("SELECT '" . ($data['tipoLimite'] ?? '') . "'");
        $esperado = parent::nonQueryId("SELECT '" . ($data['esperado'] ?? '') . "'");
        $critico = parent::nonQueryId("SELECT '" . ($data['critico'] ?? '') . "'");
        
        if ($id > 0) {
            $query = "UPDATE indicadores SET nombre = '$nombre', objetivo = '$objetivo', responsable = '$responsable', dirigido_a = '$dirigido', fuente = '$fuente', formula = '$formula', periodicidad = '$periodicidad', tipo = '$tipo', tipo_limite = '$tipoLimite', esperado = '$esperado', critico = '$critico' WHERE id = $id AND id_empresa = $idEmpresa";
            parent::nonQuery($query);
            return ["status" => "ok", "result" => ["updatedId" => $id]];
        } else {
            $query = "INSERT INTO indicadores (id_empresa, nombre, objetivo, responsable, dirigido_a, fuente, formula, periodicidad, tipo, tipo_limite, esperado, critico) VALUES ($idEmpresa, '$nombre', '$objetivo', '$responsable', '$dirigido', '$fuente', '$formula', '$periodicidad', '$tipo', '$tipoLimite', '$esperado', '$critico')";
            $newId = parent::nonQueryId($query);
            return ["status" => "ok", "result" => ["insertedId" => $newId]];
        }
    }
    
    public function deleteIndicador($id) {
        $id = intval($id);
        $query = "DELETE FROM indicadores WHERE id = $id";
        $resp = parent::nonQuery($query);
        if ($resp >= 1) {
            return ["status" => "ok", "result" => "Eliminado correctamente"];
        } else {
            $_answers = new answers;
            return $_answers->error_500("No se pudo eliminar el registro");
        }
    }
}
?>
