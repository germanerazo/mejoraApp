<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class exams extends connection {

    private $table = 'exams';
    private $token;

    public function list($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData("SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC");
    }

    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa      = intval($data['idEmpresa'] ?? 0);
        $empleadoCedula = $this->sanitize($data['empleadoCedula'] ?? '');
        $empleadoNombre = $this->sanitize($data['empleadoNombre'] ?? '');
        $empleadoCargo  = $this->sanitize($data['empleadoCargo'] ?? '');
        $fechaExamen    = $this->sanitize($data['fechaExamen'] ?? date('Y-m-d'));
        $tipoExamen     = $this->sanitize($data['tipoExamen'] ?? '');
        $ipsNombre      = $this->sanitize($data['ipsNombre'] ?? '');
        $ipsTelefono    = $this->sanitize($data['ipsTelefono'] ?? '');
        $ipsDireccion   = $this->sanitize($data['ipsDireccion'] ?? '');

        if (!$idEmpresa || !$empleadoNombre || !$tipoExamen) return $_answers->error_400();

        $query = "INSERT INTO {$this->table} (idEmpresa, empleadoCedula, empleadoNombre, empleadoCargo, fechaExamen, tipoExamen, ipsNombre, ipsTelefono, ipsDireccion)
                  VALUES ($idEmpresa, '$empleadoCedula', '$empleadoNombre', '$empleadoCargo', '$fechaExamen', '$tipoExamen', '$ipsNombre', '$ipsTelefono', '$ipsDireccion')";

        $idExam = parent::nonQueryId($query);

        if ($idExam) {
            $resp = $_answers->response;
            $resp['result'] = ['idExam' => $idExam];
            return $resp;
        }
        return $_answers->error_500("Error al guardar el examen.");
    }

    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idExam         = intval($data['idExam'] ?? 0);
        $idEmpresa      = intval($data['idEmpresa'] ?? 0);
        
        if (!$idExam || !$idEmpresa) return $_answers->error_400();

        $empleadoCedula = $this->sanitize($data['empleadoCedula'] ?? '');
        $empleadoNombre = $this->sanitize($data['empleadoNombre'] ?? '');
        $empleadoCargo  = $this->sanitize($data['empleadoCargo'] ?? '');
        $fechaExamen    = $this->sanitize($data['fechaExamen'] ?? '');
        $tipoExamen     = $this->sanitize($data['tipoExamen'] ?? '');
        $ipsNombre      = $this->sanitize($data['ipsNombre'] ?? '');
        $ipsTelefono    = $this->sanitize($data['ipsTelefono'] ?? '');
        $ipsDireccion   = $this->sanitize($data['ipsDireccion'] ?? '');

        $updates = [];
        if ($empleadoCedula) $updates[] = "empleadoCedula='$empleadoCedula'";
        if ($empleadoNombre) $updates[] = "empleadoNombre='$empleadoNombre'";
        if ($empleadoCargo)  $updates[] = "empleadoCargo='$empleadoCargo'";
        if ($fechaExamen)    $updates[] = "fechaExamen='$fechaExamen'";
        if ($tipoExamen)     $updates[] = "tipoExamen='$tipoExamen'";
        if ($ipsNombre)      $updates[] = "ipsNombre='$ipsNombre'";
        if ($ipsTelefono)    $updates[] = "ipsTelefono='$ipsTelefono'";
        if ($ipsDireccion)   $updates[] = "ipsDireccion='$ipsDireccion'";

        if ($updates) {
            parent::nonQuery("UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE idExam=$idExam AND idEmpresa=$idEmpresa");
        }

        $resp = $_answers->response;
        $resp['result'] = ['idExam' => $idExam];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idExam    = intval($data['idExam']  ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idExam || !$idEmpresa) return $_answers->error_400();

        parent::nonQuery("DELETE FROM {$this->table} WHERE idExam=$idExam AND idEmpresa=$idEmpresa");

        $resp = $_answers->response;
        $resp['result'] = ['idExam' => $idExam];
        return $resp;
    }

    // ── helpers ────────────────────────────────────────────────────────────────

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
