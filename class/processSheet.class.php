<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class processSheet extends connection {

    private $token;

    public function getSheetData($idEmpresa, $code) {
        $idEmpresa = intval($idEmpresa);
        $code = $this->sanitize($code);

        $qSheet = "SELECT * FROM process_sheet WHERE idEmpresa = $idEmpresa AND code = '$code' LIMIT 1";
        $sheetData = parent::getData($qSheet);

        $response = [
            "sheet" => null,
            "activities" => [],
            "resources" => [],
            "inputs" => [],
            "procedures" => [],
            "personnel" => []
        ];

        if ($sheetData && count($sheetData) > 0) {
            $response['sheet'] = $sheetData[0];
            $idFicha = $sheetData[0]['idFicha'];

            $response['activities'] = parent::getData("SELECT * FROM process_activity WHERE idFicha = $idFicha");
            $response['resources'] = parent::getData("SELECT * FROM process_resource WHERE idFicha = $idFicha");
            $response['inputs'] = parent::getData("SELECT * FROM process_input WHERE idFicha = $idFicha");
            $response['procedures'] = parent::getData("SELECT * FROM process_procedure WHERE idFicha = $idFicha");
            
            $personnel = parent::getData("SELECT * FROM process_personnel WHERE idFicha = $idFicha");
            // Decode JSON strings back to arrays for frontend
            foreach ($personnel as &$p) {
                $p['responsibilities'] = json_decode($p['responsibilities'], true) ?: [];
                $p['accountabilities'] = json_decode($p['accountabilities'], true) ?: [];
            }
            $response['personnel'] = $personnel;
        }

        return $response;
    }

    public function saveSheet($data) {
        $answers = new answers;
        if(!$this->verifyToken($data, $answers)) return $answers->response;

        $idEmpresa = intval($data['idEmpresa']);
        $code = $this->sanitize($data['code']);
        $objeto = $this->sanitize($data['objeto']);
        $responsable = $this->sanitize($data['responsable']);

        $qSearch = "SELECT idFicha FROM process_sheet WHERE idEmpresa = $idEmpresa AND code = '$code'";
        $resSearch = parent::getData($qSearch);
        
        if ($resSearch && count($resSearch) > 0) {
            $idFicha = $resSearch[0]['idFicha'];
            $qUpdate = "UPDATE process_sheet SET objeto='$objeto', responsable='$responsable' WHERE idFicha = $idFicha";
            parent::nonQuery($qUpdate);
            $resp = $answers->response;
            $resp['result'] = ["idFicha" => $idFicha];
            return $resp;
        } else {
            $qInsert = "INSERT INTO process_sheet (idEmpresa, code, objeto, responsable) VALUES ($idEmpresa, '$code', '$objeto', '$responsable')";
            $idFicha = parent::nonQueryId($qInsert);
            $resp = $answers->response;
            $resp['result'] = ["idFicha" => $idFicha];
            return $resp;
        }
    }

    // Generic Add/Edit/Delete
    public function manageItem($data) {
        $answers = new answers;
        if(!$this->verifyToken($data, $answers)) return $answers->response;
        
        $table = $this->sanitize($data['table']);
        $action = $this->sanitize($data['action']); // 'add', 'edit', 'delete'
        $idFicha = intval($data['idFicha']);
        
        // Define primary key names based on table
        $pkName = 'id';
        if ($table == 'process_activity') $pkName = 'idActivity';
        if ($table == 'process_resource') $pkName = 'idResource';
        if ($table == 'process_input')    $pkName = 'idInput';
        if ($table == 'process_procedure')$pkName = 'idProcedure';
        if ($table == 'process_personnel')$pkName = 'idPersonnel';

        $idValue = isset($data['id']) ? intval($data['id']) : 0;
        
        if ($action === 'delete') {
            $q = "DELETE FROM $table WHERE $pkName = $idValue AND idFicha = $idFicha";
            parent::nonQuery($q);
            $resp = $answers->response;
            $resp['result'] = ["deleted" => $idValue];
            return $resp;
        }
        
        // fields logic
        if ($table == 'process_activity') {
            $name = $this->sanitize($data['item']['name'] ?? '');
            $area = $this->sanitize($data['item']['area'] ?? '');
            $routine = $this->sanitize($data['item']['routine'] ?? '');
            $highRisk = $this->sanitize($data['item']['highRisk'] ?? '');
            if ($action === 'edit') {
                parent::nonQuery("UPDATE process_activity SET name='$name', area='$area', routine='$routine', highRisk='$highRisk' WHERE idActivity=$idValue");
            } else {
                $idValue = parent::nonQueryId("INSERT INTO process_activity (idFicha, name, area, routine, highRisk) VALUES ($idFicha, '$name', '$area', '$routine', '$highRisk')");
            }
        }
        else if ($table == 'process_resource' || $table == 'process_input') {
            $name = $this->sanitize($data['item']['name']);
            if ($action === 'edit') {
                parent::nonQuery("UPDATE $table SET name='$name' WHERE $pkName=$idValue");
            } else {
                $idValue = parent::nonQueryId("INSERT INTO $table (idFicha, name) VALUES ($idFicha, '$name')");
            }
        }
        else if ($table == 'process_procedure') {
            $name = $this->sanitize($data['item']['name']);
            $file = $this->sanitize($data['item']['file'] ?? '');
            if ($action === 'edit') {
                parent::nonQuery("UPDATE process_procedure SET name='$name', file='$file' WHERE idProcedure=$idValue");
            } else {
                $idValue = parent::nonQueryId("INSERT INTO process_procedure (idFicha, name, file) VALUES ($idFicha, '$name', '$file')");
            }
        }
        else if ($table == 'process_personnel') {
            $role = $this->sanitize($data['item']['role'] ?? '');
            $reportsTo = $this->sanitize($data['item']['reportsTo'] ?? '');
            $quantity = $this->sanitize($data['item']['quantity'] ?? '');
            // Expect JSON array from front
            $respJson = addslashes(json_encode($data['item']['responsibilities'] ?? []));
            $accJson = addslashes(json_encode($data['item']['accountabilities'] ?? []));
            
            if ($action === 'edit') {
                parent::nonQuery("UPDATE process_personnel SET role='$role', reportsTo='$reportsTo', quantity='$quantity', responsibilities='$respJson', accountabilities='$accJson' WHERE idPersonnel=$idValue");
            } else {
                $idValue = parent::nonQueryId("INSERT INTO process_personnel (idFicha, role, reportsTo, quantity, responsibilities, accountabilities) VALUES ($idFicha, '$role', '$reportsTo', '$quantity', '$respJson', '$accJson')");
            }
        }

        $resp = $answers->response;
        $resp['result'] = ["idSaved" => $idValue];
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
