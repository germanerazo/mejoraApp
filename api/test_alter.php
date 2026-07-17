<?php
require_once '../class/connection/connection.php';
class DBTest extends connection {
    public function run() {
        try {
            $this->nonQuery("ALTER TABLE risk_program_indicators ADD COLUMN responsable VARCHAR(100) AFTER formula");
            echo "Success!";
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }
}
$test = new DBTest();
$test->run();
