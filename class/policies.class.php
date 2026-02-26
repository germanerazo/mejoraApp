<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class policies extends connection {
    
    private $table = "policies";
    private $token;

    public function listPolicies($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM " . $this->table . " WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC, nomPolitica ASC";
        return parent::getData($query);
    }

    public function post($data, $files) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401("Token inválido o expirado");

        if(!isset($data['idEmpresa']) || !isset($data['nomPolitica']) || !isset($data['fechaCreacion'])) {
            return $_answers->error_400();
        }

        $idEmpresa = intval($data['idEmpresa']);
        $nomPolitica = $this->sanitize($data['nomPolitica']);
        $fechaCreacion = $this->sanitize($data['fechaCreacion']);
        
        $query = "INSERT INTO " . $this->table . " (idEmpresa, nomPolitica, fechaCreacion) VALUES ($idEmpresa, '$nomPolitica', '$fechaCreacion')";
        $idPolitica = parent::nonQueryId($query);

        if ($idPolitica) {
            $rutaArchivo = $this->processFile($idEmpresa, $files);
            if ($rutaArchivo) {
                $queryUpdate = "UPDATE " . $this->table . " SET rutaArchivo = '$rutaArchivo' WHERE idPolitica = $idPolitica";
                parent::nonQuery($queryUpdate);
            }

            $response = $_answers->response;
            $response['result'] = array("idPolitica" => $idPolitica);
            return $response;
        }

        return $_answers->error_500("Error insertando la política");
    }

    public function put($data, $files) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401();

        if(!isset($data['idPolitica']) || !isset($data['idEmpresa'])) return $_answers->error_400();

        $idPolitica = intval($data['idPolitica']);
        $idEmpresa = intval($data['idEmpresa']);

        $updates = [];
        if(isset($data['nomPolitica'])) $updates[] = "nomPolitica = '" . $this->sanitize($data['nomPolitica']) . "'";
        if(isset($data['fechaCreacion'])) $updates[] = "fechaCreacion = '" . $this->sanitize($data['fechaCreacion']) . "'";

        // Check if there is a new file
        $rutaArchivo = $this->processFile($idEmpresa, $files);
        if ($rutaArchivo) {
            $updates[] = "rutaArchivo = '$rutaArchivo'";
        }

        if (count($updates) > 0) {
            $query = "UPDATE " . $this->table . " SET " . implode(", ", $updates) . " WHERE idPolitica = $idPolitica AND idEmpresa = $idEmpresa";
            $res = parent::nonQuery($query);
            if ($res >= 0) {
                $response = $_answers->response;
                $response['result'] = array("idPolitica" => $idPolitica);
                return $response;
            } else {
                return $_answers->error_500("Error actualizando la política");
            }
        }

        // Si no se actualizó nada de texto ni archivo pero la petición fue exitosa
        $response = $_answers->response;
        $response['result'] = array("idPolitica" => $idPolitica);
        return $response;
    }

    public function delete($data) {
        $_answers = new answers;
        $_token = new token;

        if(!isset($data['token'])) return $_answers->error_401();
        
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) return $_answers->error_401();

        if(!isset($data['idPolitica']) || !isset($data['idEmpresa'])) return $_answers->error_400();

        $idPolitica = intval($data['idPolitica']);
        $idEmpresa = intval($data['idEmpresa']);

        // Opcional: obtener rutaArchivo para borrarlo físicamente
        $queryRuta = "SELECT rutaArchivo FROM " . $this->table . " WHERE idPolitica = $idPolitica AND idEmpresa = $idEmpresa";
        $dataRuta = parent::getData($queryRuta);
        
        $query = "DELETE FROM " . $this->table . " WHERE idPolitica = $idPolitica AND idEmpresa = $idEmpresa";
        $res = parent::nonQuery($query);

        if ($res >= 0) {
            if (!empty($dataRuta) && !empty($dataRuta[0]['rutaArchivo'])) {
                $filePath = dirname(__DIR__) . "/" . $dataRuta[0]['rutaArchivo'];
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }
            $response = $_answers->response;
            $response["result"] = array("idPolitica" => $idPolitica);
            return $response;
        }
        return $_answers->error_500("Error eliminando la política");
    }

    private function processFile($idEmpresa, $files) {
        if (isset($files['archivo']) && $files['archivo']['error'] === UPLOAD_ERR_OK) {
            $file = $files['archivo'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "politica_" . time() . "_" . rand(100, 999) . "." . strtolower($extension);

            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/policies/";
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
