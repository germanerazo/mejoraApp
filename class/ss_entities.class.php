<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class ss_entities extends connection {

    private $table = 'ss_entities';
    private $token;

    public function list($idEmpresa, $tipo = null) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa";
        if ($tipo) {
            $tipo = $this->sanitize($tipo);
            $query .= " AND tipo = '$tipo'";
        }
        $query .= " ORDER BY tipo ASC, nombre ASC";
        return parent::getData($query);
    }

    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        $tipo      = $this->sanitize($data['tipo'] ?? '');
        $nombre    = $this->sanitize($data['nombre'] ?? '');

        if (!$idEmpresa || !$tipo || !$nombre) return $_answers->error_400();

        $query = "INSERT INTO {$this->table} (idEmpresa, tipo, nombre) VALUES ($idEmpresa, '$tipo', '$nombre')";
        $idEntity = parent::nonQueryId($query);

        if ($idEntity) {
            $resp = $_answers->response;
            $resp['result'] = ['idEntity' => $idEntity];
            return $resp;
        }
        return $_answers->error_500("Error al guardar la entidad.");
    }

    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEntity  = intval($data['idEntity'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        
        if (!$idEntity || !$idEmpresa) return $_answers->error_400();

        $tipo   = $this->sanitize($data['tipo'] ?? '');
        $nombre = $this->sanitize($data['nombre'] ?? '');

        $updates = [];
        if ($tipo)   $updates[] = "tipo='$tipo'";
        if ($nombre) $updates[] = "nombre='$nombre'";

        if ($updates) {
            parent::nonQuery("UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE idEntity=$idEntity AND idEmpresa=$idEmpresa");
        }

        $resp = $_answers->response;
        $resp['result'] = ['idEntity' => $idEntity];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEntity  = intval($data['idEntity'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idEntity || !$idEmpresa) return $_answers->error_400();

        parent::nonQuery("DELETE FROM {$this->table} WHERE idEntity=$idEntity AND idEmpresa=$idEmpresa");

        $resp = $_answers->response;
        $resp['result'] = ['idEntity' => $idEntity];
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
