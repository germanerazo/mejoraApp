<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class copasst extends connection {
    
    private $table = "copasst";
    private $token;

    public function listCopasst($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM " . $this->table . " WHERE idEmpresa = $idEmpresa ORDER BY fechaActa DESC";
        return parent::getData($query);
    }

    public function post($data, $files) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401("Token inválido o expirado");

        if(!isset($data['idEmpresa']) || !isset($data['nomActa']) || !isset($data['fechaActa'])) {
            return $_answers->error_400();
        }

        $idEmpresa = intval($data['idEmpresa']);
        $nomActa = $this->sanitize($data['nomActa']);
        $fechaActa = $this->sanitize($data['fechaActa']);
        
        $query = "INSERT INTO " . $this->table . " (idEmpresa, nomActa, fechaActa) VALUES ($idEmpresa, '$nomActa', '$fechaActa')";
        $idCopasst = parent::nonQueryId($query);

        if ($idCopasst) {
            $rutaArchivo = $this->processFile($idEmpresa, $files);
            if ($rutaArchivo) {
                $queryUpdate = "UPDATE " . $this->table . " SET rutaArchivo = '$rutaArchivo' WHERE idCopasst = $idCopasst";
                parent::nonQuery($queryUpdate);
            }

            $response = $_answers->response;
            $response['result'] = array("idCopasst" => $idCopasst);
            return $response;
        }

        return $_answers->error_500("Error insertando el acta del COPASST");
    }

    public function delete($data) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401();

        if(!isset($data['idCopasst'])) return $_answers->error_400();

        $idCopasst = intval($data['idCopasst']);

        // Opcional: obtener rutaArchivo para borrarlo físicamente
        $queryRuta = "SELECT rutaArchivo FROM " . $this->table . " WHERE idCopasst = $idCopasst";
        $dataRuta = parent::getData($queryRuta);
        
        $query = "DELETE FROM " . $this->table . " WHERE idCopasst = $idCopasst";
        $res = parent::nonQuery($query);

        if ($res >= 0) {
            if (!empty($dataRuta) && !empty($dataRuta[0]['rutaArchivo'])) {
                $filePath = dirname(__DIR__) . "/" . $dataRuta[0]['rutaArchivo'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            $response = $_answers->response;
            $response["result"] = array("idCopasst" => $idCopasst);
            return $response;
        }
        return $_answers->error_500("Error eliminando el acta");
    }

    private function processFile($idEmpresa, $files) {
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $file = $files['archivo'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "copasst_" . time() . "_" . rand(100, 999) . "." . strtolower($extension);

            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/copasst/";
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
