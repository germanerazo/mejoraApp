<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class entryMedicalFiles extends connection {

    private $table = 'entry_medical_files';
    private $token;

    public function list($idEmpresa, $idEntry) {
        $idEmpresa = intval($idEmpresa);
        $idEntry   = intval($idEntry);
        return parent::getData("SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa AND idEntry = $idEntry ORDER BY fechaCreacion DESC");
    }

    public function post($data, $files) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa   = intval($data['idEmpresa'] ?? 0);
        $idEntry     = intval($data['idEntry'] ?? 0);
        $tipoExamen  = $this->sanitize($data['tipoExamen'] ?? '');
        $fechaExamen = $this->sanitize($data['fechaExamen'] ?? date('Y-m-d'));

        if (!$idEmpresa || !$idEntry || !$tipoExamen) return $_answers->error_400();

        // Enforce max 1 for ingreso and retiro
        if ($tipoExamen === 'ingreso' || $tipoExamen === 'retiro') {
            $existing = parent::getData("SELECT idFile FROM {$this->table} WHERE idEmpresa = $idEmpresa AND idEntry = $idEntry AND tipoExamen = '$tipoExamen'");
            if (is_array($existing) && count($existing) > 0) {
                return $_answers->error_400("Ya existe un examen de tipo '$tipoExamen' para este empleado. Elimine el existente primero.");
            }
        }

        // Process file upload
        $rutaArchivo = $this->processFile($idEmpresa, $idEntry, $files);
        $nombreArchivo = '';
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $nombreArchivo = $this->sanitize($files['archivo']['name']);
        }

        $query = "INSERT INTO {$this->table} (idEmpresa, idEntry, tipoExamen, fechaExamen, rutaArchivo, nombreArchivo)
                  VALUES ($idEmpresa, $idEntry, '$tipoExamen', '$fechaExamen', '$rutaArchivo', '$nombreArchivo')";

        $idFile = parent::nonQueryId($query);

        if ($idFile) {
            $resp = $_answers->response;
            $resp['result'] = [
                'idFile' => $idFile,
                'rutaArchivo' => $rutaArchivo,
                'nombreArchivo' => $nombreArchivo
            ];
            return $resp;
        }
        return $_answers->error_500("Error al guardar el examen médico.");
    }

    public function put($data, $files) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idFile      = intval($data['idFile'] ?? 0);
        $idEmpresa   = intval($data['idEmpresa'] ?? 0);
        $fechaExamen = $this->sanitize($data['fechaExamen'] ?? '');

        if (!$idFile || !$idEmpresa) return $_answers->error_400();

        $updates = [];
        if ($fechaExamen !== '') {
            $updates[] = "fechaExamen='$fechaExamen'";
        }

        // Si viene un archivo nuevo, subirlo y reemplazar el antiguo
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            // Eliminar el antiguo
            $fileData = parent::getData("SELECT idEntry, rutaArchivo FROM {$this->table} WHERE idFile = $idFile AND idEmpresa = $idEmpresa");
            if (is_array($fileData) && count($fileData) > 0) {
                $oldPath = dirname(__DIR__) . "/" . $fileData[0]['rutaArchivo'];
                if (file_exists($oldPath) && !is_dir($oldPath)) {
                    unlink($oldPath);
                }
                
                // Subir el nuevo
                $idEntry = $fileData[0]['idEntry'];
                $rutaArchivo = $this->processFile($idEmpresa, $idEntry, $files);
                $nombreArchivo = $this->sanitize($files['archivo']['name']);

                $updates[] = "rutaArchivo='$rutaArchivo'";
                $updates[] = "nombreArchivo='$nombreArchivo'";
            }
        }

        if (count($updates) > 0) {
            $query = "UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE idFile=$idFile AND idEmpresa=$idEmpresa";
            parent::nonQuery($query);
        }

        $resp = $_answers->response;
        $resp['result'] = ['idFile' => $idFile];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idFile    = intval($data['idFile'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idFile || !$idEmpresa) return $_answers->error_400();

        // Get file path before deleting record
        $fileData = parent::getData("SELECT rutaArchivo FROM {$this->table} WHERE idFile = $idFile AND idEmpresa = $idEmpresa");
        
        if (is_array($fileData) && count($fileData) > 0 && !empty($fileData[0]['rutaArchivo'])) {
            $filePath = dirname(__DIR__) . "/" . $fileData[0]['rutaArchivo'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        parent::nonQuery("DELETE FROM {$this->table} WHERE idFile=$idFile AND idEmpresa=$idEmpresa");

        $resp = $_answers->response;
        $resp['result'] = ['idFile' => $idFile];
        return $resp;
    }

    // ── helpers ────────────────────────────────────────────────────────────────

    private function processFile($idEmpresa, $idEntry, $files) {
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $file = $files['archivo'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "exam_" . time() . "_" . rand(100, 999) . "." . strtolower($extension);

            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/entry/" . $idEntry . "/";
            $fullPath = $rootPath . $targetDir;

            if (!is_dir($fullPath)) {
                mkdir($fullPath, 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $fullPath . $filename)) {
                return $targetDir . $filename;
            }
        }
        return '';
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
