<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class emergency extends connection {
    public function getEmergency($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, name, date_emergency as date, file_path as file FROM emergency_plan WHERE id_empresa = $idEmpresa ORDER BY id DESC";
        $data = parent::obtenerDatos($query);
        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveEmergency($post, $file) {
        $idEmpresa = intval($post['idEmpresa']);
        $name = str_replace("'", "''", $post['name'] ?? '');
        $date = $post['date'] ?? '';
        
        $fileName = 'documento_emergencia.pdf';
        if (isset($file['name']) && !empty($file['name'])) {
            $fileName = $file['name'];
        }
        
        $query = "INSERT INTO emergency_plan (id_empresa, name, date_emergency, file_path) VALUES ('$idEmpresa', '$name', '$date', '$fileName')";
        $id = parent::nonQueryId($query);
        
        if ($id) {
            return ["status" => "ok", "result" => ["insertedId" => $id]];
        } else {
            $_answers = new answers;
            return $_answers->error_500("Error al guardar el documento de emergencia");
        }
    }
    
    public function deleteEmergency($id) {
        $id = intval($id);
        $query = "DELETE FROM emergency_plan WHERE id = $id";
        $resp = parent::nonQuery($query);
        if ($resp >= 1) {
            return ["status" => "ok", "result" => "Eliminado correctamente"];
        } else {
            $_answers = new answers;
            return $_answers->error_500("No se pudo eliminar el documento de emergencia");
        }
    }
}
?>
