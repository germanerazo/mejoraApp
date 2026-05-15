<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class procedures extends connection {
    
    private $table = "procedures";
    private $token;

    public function listProcedures($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM " . $this->table . " WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC, nomProcedimiento ASC";
        return parent::getData($query);
    }

    public function post($data, $files) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401("Token inválido o expirado");

        if(!isset($data['idEmpresa']) || !isset($data['nomProcedimiento']) || !isset($data['fechaCreacion'])) {
            return $_answers->error_400();
        }

        $idEmpresa = intval($data['idEmpresa']);
        $nomProcedimiento = $this->sanitize($data['nomProcedimiento']);
        $fechaCreacion = $this->sanitize($data['fechaCreacion']);
        
        $query = "INSERT INTO " . $this->table . " (idEmpresa, nomProcedimiento, fechaCreacion) VALUES ($idEmpresa, '$nomProcedimiento', '$fechaCreacion')";
        $idProcedimiento = parent::nonQueryId($query);

        if ($idProcedimiento) {
            $rutaArchivo = $this->processFile($idEmpresa, $files);
            if ($rutaArchivo) {
                $queryUpdate = "UPDATE " . $this->table . " SET rutaArchivo = '$rutaArchivo' WHERE idProcedimiento = $idProcedimiento";
                parent::nonQuery($queryUpdate);
            }

            $response = $_answers->response;
            $response['result'] = array("idProcedimiento" => $idProcedimiento);
            return $response;
        }

        return $_answers->error_500("Error insertando el procedimiento");
    }

    public function delete($data) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401();

        if(!isset($data['idProcedimiento']) || !isset($data['idEmpresa'])) return $_answers->error_400();

        $idProcedimiento = intval($data['idProcedimiento']);
        $idEmpresa = intval($data['idEmpresa']);

        // Obtener rutaArchivo para borrarlo físicamente
        $queryRuta = "SELECT rutaArchivo FROM " . $this->table . " WHERE idProcedimiento = $idProcedimiento AND idEmpresa = $idEmpresa";
        $dataRuta = parent::getData($queryRuta);
        
        $query = "DELETE FROM " . $this->table . " WHERE idProcedimiento = $idProcedimiento AND idEmpresa = $idEmpresa";
        $res = parent::nonQuery($query);

        if ($res >= 0) {
            if (!empty($dataRuta) && !empty($dataRuta[0]['rutaArchivo'])) {
                $filePath = dirname(__DIR__) . "/" . $dataRuta[0]['rutaArchivo'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            $response = $_answers->response;
            $response["result"] = array("idProcedimiento" => $idProcedimiento);
            return $response;
        }
        return $_answers->error_500("Error eliminando el procedimiento");
    }

    private function processFile($idEmpresa, $files) {
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $file = $files['archivo'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "procedure_" . time() . "_" . rand(100, 999) . "." . strtolower($extension);

            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/procedures/";
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
