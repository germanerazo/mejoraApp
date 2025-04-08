<?php

class connection {

    private $server;
    private $user;
    private $password;
    private $database;
    private $port;
    private $connection;

    function __construct() {
        $listData = $this->dataConnection();
        foreach ($listData as $key => $value) {
                $this->server = $value['server'];
                $this->user = $value['user'];
                $this->password = $value['password'];
                $this->database = $value['database'];
                $this->port = $value['port'];
        }
        $this->connection = new mysqli($this->server, $this->user, $this->password, $this->database, $this->port);
        if ($this->connection->connect_errno) {
            echo "Connection failed: ";
            die($this->connection->connect_error);
        }
    }

    private function dataConnection() {
        $direction = dirname(__FILE__);
        $jsonData = file_get_contents($direction. '/' . 'config');
        return json_decode($jsonData, true);
    }

    private function convertUTF8($array) {
        array_walk_recursive($array, function(&$item, $key) {
            if(!mb_detect_encoding($item, 'utf-8', true)) {
                $item = mb_convert_encoding($item, 'UTF-8', 'ISO-8859-1');
            }
        });
        return $array;
    }

    public function getData($sqlstr) {
        $results = $this->connection->query($sqlstr);
        $resultArray = array();
        foreach ($results as $key) {
            $resultArray[] = $key;
        }
        return $this->convertUTF8($resultArray);
    }

    public function nonQuery($sqlstr) {
        $results = $this->connection->query($sqlstr);
        return $this->connection->affected_rows;
    }

    // INSERT
    public function nonQueryId($sqlstr) {
        $results = $this->connection->query($sqlstr);
        $rows = $this->connection->affected_rows;
        if ($rows >= 1) {
            return $this->connection->insert_id;
        } else {
            return 0;
        }
    }

    protected function encript($string) {
        return hash('sha256', $this->encriptMD5($string));
    }

    protected function encriptMD5($string) {
        return md5($string);
    }
}
?>
