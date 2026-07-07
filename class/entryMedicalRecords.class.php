<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class entryMedicalRecords extends connection {

    private $table = 'entry_medical_records';
    private $token;

    public function list($idEmpresa, $idEntry) {
        $idEmpresa = intval($idEmpresa);
        $idEntry   = intval($idEntry);
        return parent::getData("SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa AND idEntry = $idEntry ORDER BY fechaCreacion ASC");
    }

    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa    = intval($data['idEmpresa'] ?? 0);
        $idEntry      = intval($data['idEntry'] ?? 0);
        $tipoRegistro = $this->sanitize($data['tipoRegistro'] ?? '');
        $fecha        = $this->sanitize($data['fecha'] ?? date('Y-m-d'));
        $descripcion  = $this->sanitize($data['descripcion'] ?? '');
        $estado       = $this->sanitize($data['estado'] ?? 'Abierto');

        if (!$idEmpresa || !$idEntry || !$tipoRegistro || !$descripcion) return $_answers->error_400();

        $query = "INSERT INTO {$this->table} (idEmpresa, idEntry, tipoRegistro, fecha, descripcion, estado)
                  VALUES ($idEmpresa, $idEntry, '$tipoRegistro', '$fecha', '$descripcion', '$estado')";

        $idRecord = parent::nonQueryId($query);

        if ($idRecord) {
            $resp = $_answers->response;
            $resp['result'] = ['idRecord' => $idRecord];
            return $resp;
        }
        return $_answers->error_500("Error al guardar el registro.");
    }

    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idRecord  = intval($data['idRecord'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        
        if (!$idRecord || !$idEmpresa) return $_answers->error_400();

        $fecha       = $this->sanitize($data['fecha'] ?? '');
        $descripcion = $this->sanitize($data['descripcion'] ?? '');
        $seguimiento = $this->sanitize($data['seguimiento'] ?? '');
        $estado      = $this->sanitize($data['estado'] ?? '');

        $updates = [];
        if ($fecha !== '') $updates[] = "fecha='$fecha'";
        if ($descripcion !== '') $updates[] = "descripcion='$descripcion'";
        if ($seguimiento !== '') $updates[] = "seguimiento='$seguimiento'";
        if ($estado !== '') $updates[] = "estado='$estado'";

        if ($updates) {
            parent::nonQuery("UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE idRecord=$idRecord AND idEmpresa=$idEmpresa");
        }

        $resp = $_answers->response;
        $resp['result'] = ['idRecord' => $idRecord];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idRecord  = intval($data['idRecord'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idRecord || !$idEmpresa) return $_answers->error_400();

        parent::nonQuery("DELETE FROM {$this->table} WHERE idRecord=$idRecord AND idEmpresa=$idEmpresa");

        $resp = $_answers->response;
        $resp['result'] = ['idRecord' => $idRecord];
        return $resp;
    }

    private function verifyToken($data, &$_answers) {
        $_token = new token;
        if (!isset($data['token'])) { $_answers->response = $_answers->error_401(); return false; }
        $this->token = $data['token'];
        if (!$_token->searchToken($this->token)) { $_answers->response = $_answers->error_401(); return false; }
        return true;
    }

    private function sanitize($v) {
        return addslashes(trim(strip_tags($v)));
    }
}
?>
