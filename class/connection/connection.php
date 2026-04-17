<?php

class connection
{

    private $server;
    private $user;
    private $password;
    private $database;
    private $port;
    private $connection;

    function __construct()
    {
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

    private function dataConnection()
    {
        $direction = dirname(__FILE__);
        $jsonData = file_get_contents($direction . '/' . 'config');
        return json_decode($jsonData, true);
    }

    private function convertUTF8($array)
    {
        array_walk_recursive($array, function (&$item, $key) {
            if (!mb_detect_encoding($item, 'utf-8', true)) {
                $item = mb_convert_encoding($item, 'UTF-8', 'ISO-8859-1');
            }
        });
        return $array;
    }

    public function getData($sqlstr)
    {
        $results = $this->connection->query($sqlstr);
        $resultArray = array();
        foreach ($results as $key) {
            $resultArray[] = $key;
        }
        return $this->convertUTF8($resultArray);
    }

    public function nonQuery($sqlstr)
    {
        $this->auditQuery($sqlstr);
        $results = $this->connection->query($sqlstr);
        return $this->connection->affected_rows;
    }

    // INSERT
    public function nonQueryId($sqlstr)
    {
        $this->auditQuery($sqlstr);
        $results = $this->connection->query($sqlstr);
        $rows = $this->connection->affected_rows;
        if ($rows >= 1) {
            return $this->connection->insert_id;
        } else {
            return 0;
        }
    }

    private function getAuditUser() {
        $user = 'System';
        $headers = array();
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
        } else if (isset($_SERVER['HTTP_TOKEN'])) {
            $headers['token'] = $_SERVER['HTTP_TOKEN'];
        }

        $token = '';
        if (isset($headers['token'])) {
            $token = $headers['token'];
        } else if (isset($headers['Token'])) {
            $token = $headers['Token'];
        }

        if ($token != '') {
            $safeToken = $this->connection->real_escape_string($token);
            $qToken = "SELECT u.nombre FROM users u INNER JOIN users_token ut ON u.idUsuario = ut.userId WHERE ut.token = '$safeToken' AND ut.state = 0";
            $resToken = $this->connection->query($qToken);
            if ($resToken && $resToken->num_rows > 0) {
                $row = $resToken->fetch_assoc();
                $user = $row['nombre'];
            }
        }
        return $user;
    }

    private function getAuditIp() {
        $ip = '127.0.0.1';
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } elseif (isset($_SERVER['REMOTE_ADDR'])) {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    private function auditQuery($sqlstr) {
        $sqlUpper = strtoupper(trim($sqlstr));
        if (strpos($sqlUpper, 'INSERT') === 0 || strpos($sqlUpper, 'UPDATE') === 0 || strpos($sqlUpper, 'DELETE') === 0) {
            if (strpos($sqlUpper, 'INTO AUDIT_LOGS') !== false) {
                return; // Prevent infinite loop format
            }

            $user = $this->getAuditUser();
            $ip = $this->getAuditIp();
            $date_time = date('Y-m-d H:i:s');
            
            $action = 'Database modification';
            if (strpos($sqlUpper, 'INSERT') === 0) $action = 'Record creation';
            if (strpos($sqlUpper, 'UPDATE') === 0) $action = 'Record modification';
            if (strpos($sqlUpper, 'DELETE') === 0) $action = 'Record deletion';

            $safeUser = $this->connection->real_escape_string($user);
            $safeAction = $this->connection->real_escape_string($action);
            // Provide a shorter/cleaner description in details, truncating if it's too large, or just keep full SQL
            $safeDetails = $this->connection->real_escape_string($sqlstr);
            $safeIp = $this->connection->real_escape_string($ip);

            $auditSql = "INSERT INTO audit_logs (user, date_time, ip, action, details) VALUES ('$safeUser', '$date_time', '$safeIp', '$safeAction', '$safeDetails')";
            $this->connection->query($auditSql);
        }
    }

    public function auditAction($action, $details = '', $userLabel = null) {
        $user = $userLabel ? $userLabel : $this->getAuditUser();
        $ip = $this->getAuditIp();
        $date_time = date('Y-m-d H:i:s');

        $safeUser = $this->connection->real_escape_string($user);
        $safeAction = $this->connection->real_escape_string($action);
        $safeDetails = $this->connection->real_escape_string($details);
        $safeIp = $this->connection->real_escape_string($ip);

        $auditSql = "INSERT INTO audit_logs (user, date_time, ip, action, details) VALUES ('$safeUser', '$date_time', '$safeIp', '$safeAction', '$safeDetails')";
        $this->connection->query($auditSql);
    }

    protected function encript($string)
    {
        return hash('sha256', $this->encriptMD5($string));
    }

    protected function encriptMD5($string)
    {
        return md5($string);
    }
}
