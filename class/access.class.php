<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class access extends connection {

    private $table = "access";
    private $idAcceso;
    private $codigo;
    private $rol;
    private $idUsuario;
    private $acceso;
    private $estado;
    private $token;

    public function listAccess($page = 1) {
        $initial = 0;
        $limit = 100;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit = $limit * $page;
        }
        $query = "SELECT idAcceso, codigo, rol, idUsuario, acceso, estado FROM ". $this->table." LIMIT $initial, $limit";
        $data = parent::getData($query);
        return $data;
    }

    public function getAccess($id) {
        $query = "SELECT idAcceso, codigo, rol, idUsuario, acceso, estado FROM ". $this->table." WHERE idAcceso = $id";
        $data = parent::getData($query);
        return $data;
    }

    public function post($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                if(!isset($data['codigo']) || !isset($data['rol']) || !isset($data['idUsuario']) || !isset($data['acceso']) || !isset($data['estado'])) {
                    return $_answers->error_400();
                } else {
                    $this->codigo = $data['codigo'];
                    $this->rol = $data['rol'];
                    $this->idUsuario = $data['idUsuario'];
                    $this->acceso = $data['acceso'];
                    $this->estado = $data['estado'];
                    $res = $this->setAccess();
                    if ($res) {
                        $response = $_answers->response;
                        $response['result'] = array(
                            'idAcceso' => $res,
                            'codigo' => $this->codigo,
                            'rol' => $this->rol,
                            'idUsuario' => $this->idUsuario,
                            'acceso' => $this->acceso,
                            'estado' => $this->estado
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error inserting data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function setAccess() {
        $query = "INSERT INTO ". $this->table." (codigo, rol, idUsuario, acceso, estado) 
        VALUES ('$this->codigo', '$this->rol', '$this->idUsuario', '$this->acceso', '$this->estado')";
        $response = parent::nonQueryId($query);
        if ($response) {
            return $response;
        } else {
            return 0;
        }
    }

    public function put($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                if(!isset($data['idAcceso'])) {
                    return $_answers->error_400();
                } else {
                    $this->idAcceso = $data['idAcceso'];
                    if(isset($data['codigo'])) { $this->codigo = $data['codigo']; }
                    if(isset($data['rol'])) { $this->rol = $data['rol']; }
                    if(isset($data['idUsuario'])) { $this->idUsuario = $data['idUsuario']; }
                    if(isset($data['acceso'])) { $this->acceso = $data['acceso']; }
                    if(isset($data['estado'])) { $this->estado = $data['estado']; }
                    $res = $this->updateAccess();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idAcceso" => $this->idAcceso
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error updating data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function updateAccess() {
        $query = "UPDATE ". $this->table." SET codigo = '$this->codigo', rol = '$this->rol', idUsuario = '$this->idUsuario', 
        acceso = '$this->acceso', estado = '$this->estado' WHERE idAcceso = $this->idAcceso";
        $response = parent::nonQuery($query);
        if ($response) {
            return $response;
        } else {
            return 0;
        }
    }

    public function delete($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                if(!isset($data['idAcceso'])) {
                    return $_answers->error_400();
                } else {
                    $this->idAcceso = $data['idAcceso'];
                    $res = $this->deleteAccess();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idAcceso" => $this->idAcceso
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error deleting data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function deleteAccess() {
        $query = "DELETE FROM ". $this->table." WHERE idAcceso = $this->idAcceso";
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }

}
?>