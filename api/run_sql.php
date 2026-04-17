<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../class/connection/connection.php';
class installer extends connection {
    public function run() {
        $sql = file_get_contents('../sql/create_audit_logs.sql');
        return $this->nonQuery($sql);
    }
}
$ins = new installer();
$result = $ins->run();
echo "Result: " . $result;
?>
