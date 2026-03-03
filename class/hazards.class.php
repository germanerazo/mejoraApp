<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class hazards extends connection {

    private $table = 'hazard_procedures';
    private $token;

    public function list($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData("SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC, titulo ASC");
    }

    public function post($data, $files) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa   = intval($data['idEmpresa']   ?? 0);
        $titulo      = $this->sanitize($data['titulo']      ?? '');
        $descripcion = $this->sanitize($data['descripcion'] ?? '');
        $fecha       = $this->sanitize($data['fechaCreacion'] ?? date('Y-m-d'));

        if (!$idEmpresa || !$titulo) return $_answers->error_400();

        $idHazard = parent::nonQueryId(
            "INSERT INTO {$this->table} (idEmpresa, titulo, descripcion, fechaCreacion)
             VALUES ($idEmpresa, '$titulo', '$descripcion', '$fecha')"
        );

        if ($idHazard) {
            $ruta = $this->processFile($idEmpresa, $idHazard, $files);
            if ($ruta) {
                parent::nonQuery("UPDATE {$this->table} SET rutaArchivo='$ruta' WHERE idHazard=$idHazard");
            }
            $resp = $_answers->response;
            $resp['result'] = ['idHazard' => $idHazard, 'rutaArchivo' => $ruta];
            return $resp;
        }
        return $_answers->error_500("Error al guardar el procedimiento.");
    }

    public function put($data, $files) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idHazard    = intval($data['idHazard']    ?? 0);
        $idEmpresa   = intval($data['idEmpresa']   ?? 0);
        $titulo      = $this->sanitize($data['titulo']      ?? '');
        $descripcion = $this->sanitize($data['descripcion'] ?? '');
        $fecha       = $this->sanitize($data['fechaCreacion'] ?? '');

        if (!$idHazard || !$idEmpresa) return $_answers->error_400();

        $updates = [];
        if ($titulo)      $updates[] = "titulo='$titulo'";
        if ($descripcion) $updates[] = "descripcion='$descripcion'";
        if ($fecha)       $updates[] = "fechaCreacion='$fecha'";

        $ruta = $this->processFile($idEmpresa, $idHazard, $files);
        if ($ruta) $updates[] = "rutaArchivo='$ruta'";

        if ($updates) {
            parent::nonQuery("UPDATE {$this->table} SET " . implode(',', $updates) . " WHERE idHazard=$idHazard AND idEmpresa=$idEmpresa");
        }

        $resp = $_answers->response;
        $resp['result'] = ['idHazard' => $idHazard, 'rutaArchivo' => $ruta];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idHazard  = intval($data['idHazard']  ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idHazard || !$idEmpresa) return $_answers->error_400();

        $rows = parent::getData("SELECT rutaArchivo FROM {$this->table} WHERE idHazard=$idHazard AND idEmpresa=$idEmpresa");
        parent::nonQuery("DELETE FROM {$this->table} WHERE idHazard=$idHazard AND idEmpresa=$idEmpresa");

        if (!empty($rows[0]['rutaArchivo'])) {
            $path = dirname(__DIR__) . '/' . $rows[0]['rutaArchivo'];
            if (file_exists($path)) unlink($path);
        }

        $resp = $_answers->response;
        $resp['result'] = ['idHazard' => $idHazard];
        return $resp;
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    private function processFile($idEmpresa, $idHazard, $files) {
        if (!isset($files['archivo']) || $files['archivo']['error'] !== UPLOAD_ERR_OK) return null;

        $file      = $files['archivo'];
        $ext       = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename  = "hazard_{$idHazard}_" . time() . ".$ext";
        $targetDir = "dataClients/{$idEmpresa}/hazards/";
        $fullPath  = dirname(__DIR__) . "/$targetDir";

        if (!is_dir($fullPath)) mkdir($fullPath, 0777, true);

        if (move_uploaded_file($file['tmp_name'], $fullPath . $filename)) {
            return $targetDir . $filename;
        }
        return null;
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
