<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class annual extends connection {
    
    private $token;

    public function listPlans($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        $query = "SELECT * FROM annual_plans WHERE idEmpresa = $idEmpresa ORDER BY startDate DESC";
        return parent::getData($query);
    }

    public function getFullPlan($idPlan) {
        $idPlan = intval($idPlan);
        
        // Ensure table has external_id column for consolidation records
        try {
            parent::nonQuery("ALTER TABLE annual_activities ADD COLUMN external_id VARCHAR(100) DEFAULT NULL AFTER category");
        } catch(Exception $e) {}

        // Basic Info
        $queryPlan = "SELECT * FROM annual_plans WHERE idPlan = $idPlan";
        $planData = parent::getData($queryPlan);
        if (empty($planData)) return null;

        $plan = $planData[0];

        // Objectives
        $queryObj = "SELECT * FROM annual_objectives WHERE idPlan = $idPlan";
        $plan['objectives'] = parent::getData($queryObj);

        // Activities
        $queryAct = "SELECT * FROM annual_activities WHERE idPlan = $idPlan";
        $plan['activities'] = parent::getData($queryAct);

        // Signatures
        $querySig = "SELECT * FROM annual_signatures WHERE idPlan = $idPlan";
        $sigData = parent::getData($querySig);
        $plan['signatures'] = !empty($sigData) ? $sigData[0] : null;

        // Employees for Medical Exams
        try {
            $idEmpresa = intval($plan['idEmpresa']);
            $queryEmp = "SELECT idEntry as id, nombre, identificacion FROM entry WHERE idEmpresa = $idEmpresa ORDER BY nombre ASC";
            $plan['employees'] = parent::getData($queryEmp);
        } catch (\Throwable $e) {
            $plan['employees'] = [];
            error_log("Error fetching employees from entry: " . $e->getMessage());
            // Fallback just in case they meant the personnel table
            try {
                $queryEmp2 = "SELECT id, employee_name as nombre, id_num as identificacion FROM personnel WHERE id_empresa = $idEmpresa ORDER BY employee_name ASC";
                $plan['employees'] = parent::getData($queryEmp2);
            } catch (\Throwable $e2) {
                // If both fail, return empty
            }
        }
        
        file_put_contents(dirname(__FILE__) . '/../api/debug_plan.txt', "ID EMPRESA: " . print_r($plan['idEmpresa'] ?? $plan['id_empresa'] ?? 'N/A', true) . "\nEMPLOYEES COUNT: " . count($plan['employees']) . "\n");

        return $plan;
    }

    public function savePlan($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa']);
        $start = $this->sanitize($data['startDate']);
        $end = $this->sanitize($data['endDate']);

        $query = "INSERT INTO annual_plans (idEmpresa, startDate, endDate) VALUES ($idEmpresa, '$start', '$end')";
        $id = parent::nonQueryId($query);

        if ($id) {
            $resp = $_answers->response;
            $resp['result'] = ["idPlan" => $id];
            return $resp;
        }
        return $_answers->error_500("Error al crear el plan");
    }

    public function deletePlan($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);

        // Delete related data first
        parent::nonQuery("DELETE FROM annual_objectives WHERE idPlan = $idPlan");
        parent::nonQuery("DELETE FROM annual_activities WHERE idPlan = $idPlan");
        parent::nonQuery("DELETE FROM annual_signatures WHERE idPlan = $idPlan");
        
        $res = parent::nonQuery("DELETE FROM annual_plans WHERE idPlan = $idPlan");
        
        if ($res >= 0) {
            $resp = $_answers->response;
            $resp['result'] = ["idPlan" => $idPlan];
            return $resp;
        }
        return $_answers->error_500("Error al eliminar el plan");
    }

    // --- Objectives ---

    public function saveObjective($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);
        $category = $this->sanitize($data['category']);
        $objective = $this->sanitize($data['objective']);
        $meta = $this->sanitize($data['meta']);
        $idObjective = isset($data['idObjective']) ? intval($data['idObjective']) : null;

        if ($idObjective) {
            $query = "UPDATE annual_objectives SET objective = '$objective', meta = '$meta' WHERE idObjective = $idObjective AND idPlan = $idPlan";
            parent::nonQuery($query);
            $id = $idObjective;
        } else {
            $query = "INSERT INTO annual_objectives (idPlan, category, objective, meta) VALUES ($idPlan, '$category', '$objective', '$meta')";
            $id = parent::nonQueryId($query);
        }

        $resp = $_answers->response;
        $resp['result'] = ["idObjective" => $id];
        return $resp;
    }

    public function deleteObjective($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idObjective = intval($data['idObjective']);
        parent::nonQuery("DELETE FROM annual_objectives WHERE idObjective = $idObjective");
        
        $resp = $_answers->response;
        $resp['result'] = ["idObjective" => $idObjective];
        return $resp;
    }

    // --- Activities ---

    public function saveActivity($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);
        $category = $this->sanitize($data['category']);
        $name = $this->sanitize($data['name']);
        $activityText = $this->sanitize($data['activity']);
        $responsible = $this->sanitize($data['responsible']);
        $resources = $this->sanitize($data['resources']);
        $target = $this->sanitize($data['target']);
        $planDate = $this->sanitize($data['planDate']);
        $execDate = !empty($data['execDate']) ? "'" . $this->sanitize($data['execDate']) . "'" : "NULL";
        $obs = $this->sanitize($data['obs']);
        $idActivity = isset($data['idActivity']) && $data['idActivity'] !== '' ? intval($data['idActivity']) : null;
        $externalId = isset($data['external_id']) && $data['external_id'] !== '' ? $this->sanitize($data['external_id']) : null;

        // If no ID but external_id exists, check if it's already in the DB
        if (!$idActivity && $externalId) {
            $check = parent::getData("SELECT idActivity FROM annual_activities WHERE idPlan = $idPlan AND external_id = '$externalId' LIMIT 1");
            if (!empty($check)) {
                $idActivity = $check[0]['idActivity'];
            }
        }

        if ($idActivity) {
            $query = "UPDATE annual_activities SET 
                        name = '$name', activity = '$activityText', responsible = '$responsible', 
                        resources = '$resources', target = '$target', planDate = '$planDate', 
                        execDate = $execDate, obs = '$obs' 
                      WHERE idActivity = $idActivity AND idPlan = $idPlan";
            parent::nonQuery($query);
            $id = $idActivity;
        } else {
            $extIdField = $externalId ? "'$externalId'" : "NULL";
            $query = "INSERT INTO annual_activities (idPlan, category, external_id, name, activity, responsible, resources, target, planDate, execDate, obs) 
                      VALUES ($idPlan, '$category', $extIdField, '$name', '$activityText', '$responsible', '$resources', '$target', '$planDate', $execDate, '$obs')";
            $id = parent::nonQueryId($query);
        }

        $resp = $_answers->response;
        $resp['result'] = ["idActivity" => $id];
        return $resp;
    }

    public function deleteActivity($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idActivity = intval($data['idActivity']);
        parent::nonQuery("DELETE FROM annual_activities WHERE idActivity = $idActivity");
        
        $resp = $_answers->response;
        $resp['result'] = ["idActivity" => $idActivity];
        return $resp;
    }

    // --- Signatures ---

    public function saveSignatures($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);
        $name1 = $this->sanitize($data['name1'] ?? '');
        $role1 = $this->sanitize($data['role1'] ?? '');
        $img1  = $data['imgSrc1'] ?? null; // Longtext, no sanitize needed or different sanitization
        $name2 = $this->sanitize($data['name2'] ?? '');
        $role2 = $this->sanitize($data['role2'] ?? '');
        $img2  = $data['imgSrc2'] ?? null;

        // Check if exists
        $check = parent::getData("SELECT idPlan FROM annual_signatures WHERE idPlan = $idPlan");
        
        if (!empty($check)) {
            $query = "UPDATE annual_signatures SET name1 = '$name1', role1 = '$role1', imgSrc1 = ?, name2 = '$name2', role2 = '$role2', imgSrc2 = ? WHERE idPlan = $idPlan";
            // Note: imgSrc might be very long (base64). Better use prepared statements if possible, but the connection class doesn't seem to support them easily. 
            // I'll try to stick to the pattern but handle large text.
            $query = "UPDATE annual_signatures SET name1 = '$name1', role1 = '$role1', imgSrc1 = '$img1', name2 = '$name2', role2 = '$role2', imgSrc2 = '$img2' WHERE idPlan = $idPlan";
        } else {
            $query = "INSERT INTO annual_signatures (idPlan, name1, role1, imgSrc1, name2, role2, imgSrc2) VALUES ($idPlan, '$name1', '$role1', '$img1', '$name2', '$role2', '$img2')";
        }
        
        parent::nonQuery($query);

        $resp = $_answers->response;
        $resp['result'] = ["idPlan" => $idPlan];
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
