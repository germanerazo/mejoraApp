<?php
require_once 'connection/connection.php';
require_once 'answers.class.php';

class audit extends connection {

    public function createAudit($action, $details = '') {
        try {
            $user = 'System';
            $ip = $this->getUserIP();
            $date_time = date('Y-m-d H:i:s');
            
            // Try to get token from header to find out the user
            $headers = apache_request_headers();
            if (isset($headers['token'])) {
                $token = $headers['token'];
                $userData = $this->getUserByToken($token);
                if ($userData && isset($userData[0]['nombre'])) {
                    $user = $userData[0]['nombre'];
                }
            }

            $query = "INSERT INTO audit_logs (user, date_time, ip, action, details) ";
            $query .= "VALUES ('" . $this->escapeString($user) . "', '$date_time', '$ip', '" . $this->escapeString($action) . "', '" . $this->escapeString($details) . "')";
            
            $result = parent::nonQueryId($query);
            return $result;
        } catch (Exception $e) {
            // Silently fail or log to file if db fails so we don't break main flow
            error_log("Audit error: " . $e->getMessage());
            return 0;
        }
    }

    private function getUserByToken($token) {
        $query = "SELECT u.nombre FROM users u INNER JOIN users_token ut ON u.idUsuario = ut.userId WHERE ut.token = '$token' AND ut.state = 0";
        return parent::getData($query);
    }

    private function getUserIP() {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1';
        }
        return $ip;
    }

    private function escapeString($string) {
        // Simple escape for single quotes to avoid breaking SQL
        // In a real framework we'd use prepared statements, but this follows the current class simple query style
        return str_replace("'", "''", $string);
    }
}
?>
