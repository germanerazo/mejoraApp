<?php
require_once 'connection/connection.php';
require_once 'answers.class.php';
require_once 'config.php';

class auth  extends connection {

    public function login($json) {
        $_answers = new answers;
        $data = json_decode($json, true);
        if (!isset($data['user']) || !isset($data['password'])) {
            return $_answers->error_400();
        } else {
            $user = $data['user'];
            $password = $data['password'];
            $password = parent::encript($password);
            $data = $this->getDataUser($user);
            if ($data) {
                if ($data[0]['contrasena_nueva'] == $password) {
                    if($data[0]['estado'] == 0) {
                        $validate = $this->insertToken($data[0]['idUsuario']);
                        if($validate) {
                            $result = $_answers->response;
                            $result['result'] = array(
                                "token" => $validate,
                                "user" => array(
                                    "id" => $data[0]['idUsuario'],
                                    "name" => $data[0]['nombre'],
                                    "email" => $data[0]['email'],
                                    "user" => $data[0]['codusr'],
                                    "idClient" => $data[0]['idCliente'],
                                    "profile" => $data[0]['perfil'],
                                )
                            );
                            return $result;
                        } else {
                            return $_answers->error_500("Internal error, The token could not be saved");
                        }
                    } else {
                        return $_answers->error_200("The user is inactive");
                    }
                } else {
                    return $_answers->error_200("Invalid password");
                }
            } else {
                return $_answers->error_200("User $user not found");
            }
        }
    }

    private function getDataUser($codusr) {
        $query = "SELECT * FROM users WHERE codusr = '$codusr'";
        $data = parent::getData($query);
        if(isset($data[0]['idUsuario'])) {
            return $data;
        } else {
            return 0;
        }
    }

    private function insertToken($idUser) {
        $val = true;
        $token = bin2hex(openssl_random_pseudo_bytes(16, $val));
        $date = date('Y-m-d H:i');
        $state = 0;
        $query = "INSERT INTO users_token (userId, token, date, state) VALUES ('$idUser', '$token', '$date', '$state')";
        $validate = parent::nonQuery($query);
        if($validate) {
            return $token;
        } else {
            return false;
        }
    }

}

?>