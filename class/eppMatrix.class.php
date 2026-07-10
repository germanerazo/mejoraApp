<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class eppMatrix extends connection {
    public function getMatrix($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT id, cargo, epp_name as epp, norma, frecuencia, almacenamiento, mantenimiento, disposicion FROM epp_matrix WHERE id_empresa = $idEmpresa ORDER BY id DESC";
        $data = parent::obtenerDatos($query);
        return [
            "status" => "ok",
            "result" => $data
        ];
    }
    
    public function saveMatrix($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        
        $cargo = parent::nonQueryId("SELECT '" . ($data['cargo'] ?? '') . "'");
        $epp = parent::nonQueryId("SELECT '" . ($data['epp'] ?? '') . "'");
        $norma = parent::nonQueryId("SELECT '" . ($data['norma'] ?? '') . "'");
        $frec = parent::nonQueryId("SELECT '" . ($data['frecuencia'] ?? '') . "'");
        $alm = parent::nonQueryId("SELECT '" . ($data['almacenamiento'] ?? '') . "'");
        $mant = parent::nonQueryId("SELECT '" . ($data['mantenimiento'] ?? '') . "'");
        $disp = parent::nonQueryId("SELECT '" . ($data['disposicion'] ?? '') . "'");
        
        if ($id > 0) {
            $query = "UPDATE epp_matrix SET cargo = '$cargo', epp_name = '$epp', norma = '$norma', frecuencia = '$frec', almacenamiento = '$alm', mantenimiento = '$mant', disposicion = '$disp' WHERE id = $id AND id_empresa = $idEmpresa";
            parent::nonQuery($query);
            return ["status" => "ok", "result" => ["updatedId" => $id]];
        } else {
            $query = "INSERT INTO epp_matrix (id_empresa, cargo, epp_name, norma, frecuencia, almacenamiento, mantenimiento, disposicion) VALUES ($idEmpresa, '$cargo', '$epp', '$norma', '$frec', '$alm', '$mant', '$disp')";
            $newId = parent::nonQueryId($query);
            return ["status" => "ok", "result" => ["insertedId" => $newId]];
        }
    }
    
    public function deleteMatrix($id) {
        $id = intval($id);
        $query = "DELETE FROM epp_matrix WHERE id = $id";
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
