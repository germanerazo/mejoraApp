<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class healthConditions extends connection {
    
    private $table = "health_conditions";
    private $token;

    public function listHealthConditions($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM " . $this->table . " WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC, nomCondicion ASC";
        return parent::getData($query);
    }

    public function post($data, $files) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401("Token inválido o expirado");

        if(!isset($data['idEmpresa']) || !isset($data['nomCondicion']) || !isset($data['fechaCreacion'])) {
            return $_answers->error_400();
        }

        $idEmpresa = intval($data['idEmpresa']);
        $nomCondicion = $this->sanitize($data['nomCondicion']);
        $fechaCreacion = $this->sanitize($data['fechaCreacion']);
        
        $query = "INSERT INTO " . $this->table . " (idEmpresa, nomCondicion, fechaCreacion) VALUES ($idEmpresa, '$nomCondicion', '$fechaCreacion')";
        $idCondicion = parent::nonQueryId($query);

        if ($idCondicion) {
            $rutaArchivo = $this->processFile($idEmpresa, $files);
            if ($rutaArchivo) {
                $queryUpdate = "UPDATE " . $this->table . " SET rutaArchivo = '$rutaArchivo' WHERE idCondicion = $idCondicion";
                parent::nonQuery($queryUpdate);
            }

            $response = $_answers->response;
            $response['result'] = array("idCondicion" => $idCondicion);
            return $response;
        }

        return $_answers->error_500("Error insertando el documento");
    }

    public function delete($data) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401();

        if(!isset($data['idCondicion']) || !isset($data['idEmpresa'])) return $_answers->error_400();

        $idCondicion = intval($data['idCondicion']);
        $idEmpresa = intval($data['idEmpresa']);

        // Obtener rutaArchivo para borrarlo físicamente
        $queryRuta = "SELECT rutaArchivo FROM " . $this->table . " WHERE idCondicion = $idCondicion AND idEmpresa = $idEmpresa";
        $dataRuta = parent::getData($queryRuta);
        
        $query = "DELETE FROM " . $this->table . " WHERE idCondicion = $idCondicion AND idEmpresa = $idEmpresa";
        $res = parent::nonQuery($query);

        if ($res >= 0) {
            if (!empty($dataRuta) && !empty($dataRuta[0]['rutaArchivo'])) {
                $filePath = dirname(__DIR__) . "/" . $dataRuta[0]['rutaArchivo'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            $response = $_answers->response;
            $response["result"] = array("idCondicion" => $idCondicion);
            return $response;
        }
        return $_answers->error_500("Error eliminando el documento");
    }

    private function processFile($idEmpresa, $files) {
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $file = $files['archivo'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "healthCondition_" . time() . "_" . rand(100, 999) . "." . strtolower($extension);

            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/healthConditions/";
            $fullPath = $rootPath . $targetDir;

            if (!is_dir($fullPath)) {
                mkdir($fullPath, 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $fullPath . $filename)) {
                return $targetDir . $filename;
            }
        }
        return null;
    }

    private function sanitize($value) {
        return addslashes(trim(strip_tags($value)));
    }
}
?>
