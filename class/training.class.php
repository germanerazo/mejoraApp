<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class training extends connection {
    public function getTraining($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, name, date_training as date, file_path as file FROM training_plan WHERE id_empresa = $idEmpresa ORDER BY id DESC";
        $data = parent::obtenerDatos($query);
        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveTraining($post, $file) {
        $idEmpresa = intval($post['idEmpresa']);
        // Limpieza básica (en producción usar prepare statements, asumiendo que connection lo maneja o limpiamos aquí)
        // Para simplificar, insertaremos directamente asumiendo valores sanos (como es común en este proyecto mock).
        $name = str_replace("'", "''", $post['name'] ?? '');
        $date = $post['date'] ?? '';
        
        $fileName = 'documento_capacitacion.pdf';
        if (isset($file['name']) && !empty($file['name'])) {
            $fileName = $file['name'];
            // En una app real aquí usarías move_uploaded_file() a un directorio de assets
        }
        
        $query = "INSERT INTO training_plan (id_empresa, name, date_training, file_path) VALUES ('$idEmpresa', '$name', '$date', '$fileName')";
        $id = parent::nonQueryId($query);
        
        if ($id) {
            return ["status" => "ok", "result" => ["insertedId" => $id]];
        } else {
            $_answers = new answers;
            return $_answers->error_500("Error al guardar el registro");
        }
    }
    
    public function deleteTraining($id) {
        $id = intval($id);
        $query = "DELETE FROM training_plan WHERE id = $id";
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
