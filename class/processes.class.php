<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class processes extends connection {
    
    private $token;

    public function getProcesses($idEmpresa) {
        $idEmpresa = intval($idEmpresa);

        $q = "SELECT * FROM processes WHERE idEmpresa = $idEmpresa ORDER BY idProceso ASC";
        $data = parent::getData($q);

        $response = [
            'Estratégicos' => [],
            'Operacionales' => [],
            'De Apoyo' => []
        ];

        foreach ($data as $row) {
            $tabName = $row['tabName'];
            if (isset($response[$tabName])) {
                $response[$tabName][] = [
                    'idProceso' => $row['idProceso'],
                    'code' => $row['code'],
                    'name' => $row['name'],
                    'status' => $row['status'],
                    'created' => $row['created'],
                    'modified' => $row['modified'],
                    'sede' => $row['sede']
                ];
            }
        }

        return $response;
    }

    public function createProcess($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa']);
        $tabName = $this->sanitize($data['tabName']);
        $name = $this->sanitize($data['name']);
        $status = $this->sanitize($data['status']);
        $sede = $this->sanitize($data['sede'] ?? '');
        $date = date('Y-m-d');

        // Auto-generate code
        $prefix = 'PE';
        if ($tabName === 'Operacionales') $prefix = 'PO';
        if ($tabName === 'De Apoyo') $prefix = 'PA';

        // Count existing processes in this tab to assign a code
        $qCount = "SELECT COUNT(*) as total FROM processes WHERE idEmpresa = $idEmpresa AND tabName = '$tabName'";
        $resCount = parent::getData($qCount);
        $nextNumber = intval($resCount[0]['total']) + 1;
        $code = $prefix . '-' . str_pad($nextNumber, 3, '0', STR_PAD_LEFT);

        $qInsert = "INSERT INTO processes (idEmpresa, tabName, code, name, status, sede, created, modified) 
                    VALUES ($idEmpresa, '$tabName', '$code', '$name', '$status', '$sede', '$date', '$date')";
        
        $id = parent::nonQueryId($qInsert);
        $resp = $_answers->response;
        $resp['result'] = ["idProceso" => $id, "code" => $code];
        return $resp;
    }

    public function updateProcess($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idProceso = intval($data['idProceso']);
        $name = $this->sanitize($data['name']);
        $status = $this->sanitize($data['status']);
        $sede = $this->sanitize($data['sede'] ?? '');
        $date = date('Y-m-d');

        $qUpdate = "UPDATE processes SET name = '$name', status = '$status', sede = '$sede', modified = '$date' WHERE idProceso = $idProceso";
        parent::nonQuery($qUpdate);

        $resp = $_answers->response;
        $resp['result'] = ["idProceso" => $idProceso];
        return $resp;
    }

    public function deleteProcess($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idProceso = intval($data['idProceso']);
        $q = "DELETE FROM processes WHERE idProceso = $idProceso";
        parent::nonQuery($q);

        $resp = $_answers->response;
        $resp['result'] = ["idProceso" => $idProceso];
        return $resp;
    }

    private function verifyToken($data, &$_answers) {
        $_token = new token;
        if(!isset($data['token'])) {
            $_answers->response = $_answers->error_401();
            return false;
        }
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if(!$arrayToken) {
            $_answers->response = $_answers->error_401();
            return false;
        }
        return true;
    }

    private function sanitize($value) {
        if ($value === null) return '';
        return addslashes(trim(strip_tags($value)));
    }
}
?>
