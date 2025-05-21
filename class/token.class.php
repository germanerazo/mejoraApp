<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';

class token extends connection {

    private $table = "users_token";

    public function searchToken($token) {
        $query = "SELECT * FROM ".$this->table." WHERE token = '$token' AND state = 0";
        $data = parent::getData($query);
        if($data) {
            $tokenDate = strtotime($data[0]['date']); // campo 'date' del token
            $now = time();
            $diffHours = ($now - $tokenDate) / 3600;
            
            if ($diffHours > 12) {
                // Expirar el token porque pasaron más de 12 horas
                $this->updateToken($data[0]['tokenId']);
                return 0; // Token ya no es válido
            }
            return $data;
        } else {
            return 0;
        }
    }

    private function updateToken($tokenid) {
        $date = date("Y-m-d H:i:s");
        $query = "UPDATE ".$this->table." SET state = 1, date = '$date' WHERE tokenId = '$tokenid'";
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }
}

?>