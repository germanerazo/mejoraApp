<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class eppProcedures extends connection {
    public function getProcedures($idEmpresa) {
        $this->ensureTableExists();
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, title, procedure_date as date, file_path as file FROM epp_procedures WHERE id_empresa = $idEmpresa ORDER BY id DESC";
        $data = parent::obtenerDatos($query);
        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveProcedure($post, $file) {
        $this->ensureTableExists();
        $idEmpresa = intval($post['idEmpresa']);
        $title = str_replace("'", "''", $post['title'] ?? '');
        $date = $post['date'] ?? '';
        
        $fileName = 'documento_epp.pdf';
        if (isset($file['name']) && !empty($file['name'])) {
            $fileName = $file['name'];
        }
        
        $query = "INSERT INTO epp_procedures (id_empresa, title, procedure_date, file_path) VALUES ('$idEmpresa', '$title', '$date', '$fileName')";
        $id = parent::nonQueryId($query);
        
        if ($id) {
            return ["status" => "ok", "result" => ["insertedId" => $id]];
        } else {
            $_answers = new answers;
            return $_answers->error_500("Error al guardar el procedimiento");
        }
    }
    
    public function deleteProcedure($id) {
        $id = intval($id);
        $query = "DELETE FROM epp_procedures WHERE id = $id";
        $resp = parent::nonQuery($query);
        if ($resp >= 1) {
            return ["status" => "ok", "result" => "Eliminado correctamente"];
        } else {
            $_answers = new answers;
            return $_answers->error_500("No se pudo eliminar el procedimiento");
        }
    }
    
    private function ensureTableExists() {
        $query = "CREATE TABLE IF NOT EXISTS epp_procedures (
            id INT AUTO_INCREMENT PRIMARY KEY,
            id_empresa INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            procedure_date DATE NOT NULL,
            file_path VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        parent::nonQuery($query);
    }
}
?>
