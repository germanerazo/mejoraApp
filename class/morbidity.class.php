<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class morbidity extends connection {
    public function getMorbidity($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, id_num as idNum, employee_name as name, start_date as startDate, end_date as endDate, days, code_cie10 as code, type_absence as type, cause FROM morbidity WHERE id_empresa = $idEmpresa ORDER BY id DESC";
        $data = parent::obtenerDatos($query);
        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveMorbidity($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        
        $name = parent::nonQueryId("SELECT '" . ($data['name'] ?? '') . "'");
        $type = parent::nonQueryId("SELECT '" . ($data['type'] ?? '') . "'");
        $start = $data['startDate'] ?? '';
        $end = $data['endDate'] ?? '';
        $days = intval($data['days'] ?? 0);
        $code = parent::nonQueryId("SELECT '" . ($data['code'] ?? '') . "'");
        $cause = parent::nonQueryId("SELECT '" . ($data['cause'] ?? '') . "'");
        
        if ($id > 0) {
            // Update
            $query = "UPDATE morbidity SET employee_name = '$name', type_absence = '$type', start_date = '$start', end_date = '$end', days = $days, code_cie10 = '$code', cause = '$cause' WHERE id = $id AND id_empresa = $idEmpresa";
            parent::nonQuery($query);
            return ["status" => "ok", "result" => ["updatedId" => $id]];
        } else {
            // Insert
            $idNum = rand(10000000, 999999999);
            $query = "INSERT INTO morbidity (id_empresa, id_num, employee_name, type_absence, start_date, end_date, days, code_cie10, cause) VALUES ($idEmpresa, '$idNum', '$name', '$type', '$start', '$end', $days, '$code', '$cause')";
            $newId = parent::nonQueryId($query);
            return ["status" => "ok", "result" => ["insertedId" => $newId]];
        }
    }
    
    public function deleteMorbidity($id) {
        $id = intval($id);
        $query = "DELETE FROM morbidity WHERE id = $id";
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
