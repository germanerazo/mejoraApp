<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class strategic extends connection {
    
    private $token;

    public function getStrategicPlan($idEmpresa) {
        $idEmpresa = intval($idEmpresa);

        // Fetch Main Policy
        $qPolicy = "SELECT * FROM strategic_plan WHERE idEmpresa = $idEmpresa LIMIT 1";
        $policyData = parent::getData($qPolicy);

        $response = [
            "policy" => null,
            "principles" => [],
            "objectives" => []
        ];

        if ($policyData && count($policyData) > 0) {
            $policy = $policyData[0];
            $idPlan = $policy['idPlan'];
            $response['policy'] = $policy;

            // Fetch Principles
            $qPrin = "SELECT * FROM strategic_principles WHERE idPlan = $idPlan ORDER BY idPrincipio ASC";
            $response['principles'] = parent::getData($qPrin);

            // Fetch Objectives
            $qObj = "SELECT * FROM strategic_objectives WHERE idPlan = $idPlan ORDER BY idObjetivo ASC";
            $objData = parent::getData($qObj);

            // Map objectives indicator nested structure to maintain JS compatibility
            $mappedObjectives = [];
            foreach ($objData as $obj) {
                $mappedObj = [
                    "id" => $obj['idObjetivo'],
                    "text" => $obj['text'],
                    "indicator" => [
                        "formula" => $obj['indFormula'],
                        "responsible" => $obj['indResponsible'],
                        "expected" => $obj['indExpected'],
                        "critical" => $obj['indCritical'],
                        "source" => $obj['indSource'],
                        "periodicity" => $obj['indPeriodicity'],
                        "type" => $obj['indType'],
                        "limitType" => $obj['indLimitType'],
                        "target" => $obj['indTarget'],
                        "date" => $obj['indDate']
                    ]
                ];
                $mappedObjectives[] = $mappedObj;
            }
            $response['objectives'] = $mappedObjectives;
        }

        return $response;
    }

    public function savePolicy($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa']);
        $name = $this->sanitize($data['name']);
        $date = $this->sanitize($data['date']);
        $status = $this->sanitize($data['status']);
        $nature = $this->sanitize($data['nature']);
        $content = $this->sanitize($data['content']);

        $qSearch = "SELECT idPlan FROM strategic_plan WHERE idEmpresa = $idEmpresa LIMIT 1";
        $resSearch = parent::getData($qSearch);
        
        if ($resSearch && count($resSearch) > 0) {
            $idPlan = $resSearch[0]['idPlan'];
            $qUpdate = "UPDATE strategic_plan SET name='$name', date='$date', status='$status', nature='$nature', content='$content' WHERE idPlan = $idPlan";
            parent::nonQuery($qUpdate);
            
            $resp = $_answers->response;
            $resp['result'] = ["idPlan" => $idPlan];
            return $resp;
        } else {
            $qInsert = "INSERT INTO strategic_plan (idEmpresa, name, date, status, nature, content) VALUES ($idEmpresa, '$name', '$date', '$status', '$nature', '$content')";
            $idPlan = parent::nonQueryId($qInsert);
            $resp = $_answers->response;
            $resp['result'] = ["idPlan" => $idPlan];
            return $resp;
        }
    }

    public function savePrinciple($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);
        $text = $this->sanitize($data['text']);
        
        if (isset($data['idPrincipio']) && !empty($data['idPrincipio'])) {
            $id = intval($data['idPrincipio']);
            $qUpdate = "UPDATE strategic_principles SET text='$text' WHERE idPrincipio = $id AND idPlan = $idPlan";
            parent::nonQuery($qUpdate);
            $resp = $_answers->response;
            $resp['result'] = ["idPrincipio" => $id];
            return $resp;
        } else {
            $qInsert = "INSERT INTO strategic_principles (idPlan, text) VALUES ($idPlan, '$text')";
            $id = parent::nonQueryId($qInsert);
            $resp = $_answers->response;
            $resp['result'] = ["idPrincipio" => $id];
            return $resp;
        }
    }

    public function deletePrinciple($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['idPrincipio']);
        $q = "DELETE FROM strategic_principles WHERE idPrincipio = $id";
        parent::nonQuery($q);
        
        $resp = $_answers->response;
        $resp['result'] = ["idPrincipio" => $id];
        return $resp;
    }

    public function saveObjective($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idPlan = intval($data['idPlan']);
        $text = $this->sanitize($data['text']);
        
        $qInsert = "INSERT INTO strategic_objectives (idPlan, text) VALUES ($idPlan, '$text')";
        $id = parent::nonQueryId($qInsert);
        $resp = $_answers->response;
        $resp['result'] = ["idObjetivo" => $id];
        return $resp;
    }

    public function saveIndicator($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idObjetivo = intval($data['idObjetivo']);
        $formula = $this->sanitize($data['formula'] ?? '');
        $responsible = $this->sanitize($data['responsible'] ?? '');
        $expected = $this->sanitize($data['expected'] ?? '');
        $critical = $this->sanitize($data['critical'] ?? '');
        $source = $this->sanitize($data['source'] ?? '');
        $periodicity = $this->sanitize($data['periodicity'] ?? '');
        $type = $this->sanitize($data['type'] ?? '');
        $limitType = $this->sanitize($data['limitType'] ?? '');
        $target = $this->sanitize($data['target'] ?? '');
        $dateInd = $this->sanitize($data['date'] ?? '');

        $qUpdate = "UPDATE strategic_objectives SET 
            indFormula = '$formula',
            indResponsible = '$responsible',
            indExpected = '$expected',
            indCritical = '$critical',
            indSource = '$source',
            indPeriodicity = '$periodicity',
            indType = '$type',
            indLimitType = '$limitType',
            indTarget = '$target',
            indDate = " . ($dateInd ? "'$dateInd'" : "NULL") . " 
            WHERE idObjetivo = $idObjetivo";

        parent::nonQuery($qUpdate);
        $resp = $_answers->response;
        $resp['result'] = ["idObjetivo" => $idObjetivo];
        return $resp;
    }

    public function deleteObjective($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['idObjetivo']);
        $q = "DELETE FROM strategic_objectives WHERE idObjetivo = $id";
        parent::nonQuery($q);
        
        $resp = $_answers->response;
        $resp['result'] = ["idObjetivo" => $id];
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
