<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';


class users extends connection {

    private $table = "users";
    private $id;
    private $name;
    private $email;
    private $cc;
    private $idClient;
    private $password;
    private $passwordMD5;
    private $profile;
    private $token;

    public function listUsers($page = 1) {
        $initial = 0;
        $limit = 100;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit = $limit * $page;
        }
        $query = "SELECT idUsuario, nombre, email, codusr, idCliente, perfil FROM ". $this->table." LIMIT $initial, $limit";
        $data = parent::getData($query);
        return $data;
    }

    public function getUser($id) {
        $query = "SELECT idUsuario, nombre, email, codusr, idCliente, perfil FROM ". $this->table." WHERE codusr = $id";
        $data = parent::getData($query);
        return $data;
    }

    public function post($json) {
        $_answers = new answers;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $this->searchToken();
            if($arrayToken) {
                if(!isset($data['name']) || !isset($data['email']) || !isset($data['cc']) || 
                !isset($data['idClient']) || !isset($data['password']) || !isset($data['profile'])) {
                return $_answers->error_400();
                } else {
                    $this->name = $data['name'];
                    $this->email = $data['email'];
                    $this->cc = $data['cc'];
                    $this->idClient = $data['idClient'];
                    $this->password = $data['password'];
                    $this->profile = $data['profile'];
                    $this->password = parent::encript($this->password);
                    $this->passwordMD5 = parent::encriptMD5($this->password);
                    $res = $this->setUser();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "id" => $res,
                            "name" => $this->name,
                            "email" => $this->email,
                            "cc" => $this->cc,
                            "idClient" => $this->idClient
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

    private function setUser() {
        $query = "INSERT INTO ". $this->table." (nombre, email, codusr, idCliente, contrasena_nueva, pwdusr, perfil) 
        VALUES ('$this->name', '$this->email', '$this->cc', '$this->idClient', '$this->password', '$this->passwordMD5', '$this->profile')";
        $response = parent::nonQueryId($query);
        if ($response) {
            return $response;
        } else {
            return 0;
        }
    }

    public function put($json) {
        $_answers = new answers;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $this->searchToken();
            if($arrayToken) {
                if(!isset($data['userId'])) {
                    return $_answers->error_400();
                } else {
                    $this->id = $data['userId'];
                    if(isset($data['name'])) { $this->name = $data['name']; }
                    if(isset($data['email'])) { $this->email = $data['email']; }
                    if(isset($data['cc'])) { $this->cc = $data['cc']; }
                    if(isset($data['idClient'])) { $this->idClient = $data['idClient']; }
                    if(isset($data['password'])) { 
                        $this->password = $data['password']; 
                        $this->password = parent::encript($this->password);
                        $this->passwordMD5 = parent::encriptMD5($this->password);
                    }
                    if(isset($data['profile'])) { $this->profile = $data['profile']; }
                    $res = $this->updateUser();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "userId" => $this->id
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

    private function updateUser() {
        $query = "UPDATE ". $this->table." SET nombre = '$this->name', email = '$this->email', codusr = '$this->cc', idCliente = '$this->idClient', perfil = '$this->profile' WHERE idUsuario = $this->id"; 
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }

    public function delete($json) {
        $_answers = new answers;
        $data = json_decode($json, true);

        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $this->searchToken();
            if($arrayToken) {
                if(!isset($data['userId'])) {
                    return $_answers->error_400();
                } else {
                    $this->id = $data['userId'];
                    $res = $this->deleteUser();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "userId" => $this->id
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

    private function deleteUser() {
        $query = "DELETE FROM ". $this->table." WHERE idUsuario = $this->id"; 
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }

    private function searchToken() {
        $query = "SELECT * FROM users_token WHERE token = '$this->token' AND state = 0";
        $data = parent::getData($query);
        if($data) {
            return $data;
        } else {
            return 0;
        }
    }

    private function updateToken($tokenid) {
        $date = date("Y-m-d H:i:s");
        $query = "UPDATE usuarios_token SET date = '$date' WHERE tokenId = '$tokenid'";
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }

}

?>