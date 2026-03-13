<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class dangerMgmt extends connection {

    private $token;

    // ── CATÁLOGOS ─────────────────────────────────────────────────

    public function getDangerTypes() {
        return parent::getData("SELECT * FROM danger_types ORDER BY name ASC");
    }

    public function getDangersByType($typeId) {
        $typeId = intval($typeId);
        return parent::getData("SELECT * FROM dangers WHERE danger_type_id = $typeId ORDER BY name ASC");
    }

    public function getAllDangers() {
        return parent::getData("SELECT d.*, dt.name as typeName FROM dangers d JOIN danger_types dt ON d.danger_type_id = dt.id ORDER BY dt.name, d.name");
    }

    public function getConsequences() {
        return parent::getData("SELECT * FROM consequences ORDER BY name ASC");
    }

    public function getConsequencesByDanger($dangerId) {
        $dangerId = intval($dangerId);
        return parent::getData("SELECT c.* FROM consequences c JOIN danger_consequences dc ON c.id = dc.consequence_id WHERE dc.danger_id = $dangerId ORDER BY c.name");
    }

    public function getPreventiveMeasures() {
        return parent::getData("SELECT * FROM preventive_measures ORDER BY name ASC");
    }

    public function getMeasuresByDanger($dangerId) {
        $dangerId = intval($dangerId);
        return parent::getData("SELECT pm.* FROM preventive_measures pm JOIN danger_preventive_measures dpm ON pm.id = dpm.preventive_measure_id WHERE dpm.danger_id = $dangerId ORDER BY pm.name");
    }

    // ── ASOCIACIONES POR ACTIVIDAD ────────────────────────────────

    public function getActivityDangers($idActivity) {
        $idActivity = intval($idActivity);

        $dangers = parent::getData(
            "SELECT ad.id as activity_danger_id, d.id as danger_id, d.name as danger_name, dt.name as type_name
             FROM activity_dangers ad
             JOIN dangers d ON ad.danger_id = d.id
             JOIN danger_types dt ON d.danger_type_id = dt.id
             WHERE ad.idActivity = $idActivity
             ORDER BY dt.name, d.name"
        );

        foreach ($dangers as &$danger) {
            $adId = intval($danger['activity_danger_id']);

            // Consecuencias
            $consequences = parent::getData(
                "SELECT adc.id as adc_id, c.id as consequence_id, c.name as consequence_name
                 FROM activity_danger_consequences adc
                 JOIN consequences c ON adc.consequence_id = c.id
                 WHERE adc.activity_danger_id = $adId
                 ORDER BY c.name"
            );

            foreach ($consequences as &$cons) {
                $adcId = intval($cons['adc_id']);
                $cons['measures'] = parent::getData(
                    "SELECT adcm.id as adcm_id, pm.id as measure_id, pm.name as measure_name
                     FROM activity_danger_consequence_measures adcm
                     JOIN preventive_measures pm ON adcm.preventive_measure_id = pm.id
                     WHERE adcm.activity_danger_consequence_id = $adcId
                     ORDER BY pm.name"
                );
            }

            $danger['consequences'] = $consequences;
        }

        return $dangers;
    }

    // ── AGREGAR ASOCIACIONES ──────────────────────────────────────

    public function addActivityDanger($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idActivity = intval($data['idActivity']);
        $dangerId = intval($data['danger_id']);

        // Check if already exists
        $exists = parent::getData("SELECT id FROM activity_dangers WHERE idActivity = $idActivity AND danger_id = $dangerId");
        if (!empty($exists)) {
            return $_answers->error_400("Este peligro ya está asignado a la actividad.");
        }

        $id = parent::nonQueryId("INSERT INTO activity_dangers (idActivity, danger_id) VALUES ($idActivity, $dangerId)");
        $resp = $_answers->response;
        $resp['result'] = ["id" => $id];
        return $resp;
    }

    public function addConsequence($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $adId = intval($data['activity_danger_id']);
        $consId = intval($data['consequence_id']);

        $exists = parent::getData("SELECT id FROM activity_danger_consequences WHERE activity_danger_id = $adId AND consequence_id = $consId");
        if (!empty($exists)) {
            return $_answers->error_400("Esta consecuencia ya está asignada.");
        }

        $id = parent::nonQueryId("INSERT INTO activity_danger_consequences (activity_danger_id, consequence_id) VALUES ($adId, $consId)");
        $resp = $_answers->response;
        $resp['result'] = ["id" => $id];
        return $resp;
    }

    public function addMeasure($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $adcId = intval($data['activity_danger_consequence_id']);
        $measureId = intval($data['preventive_measure_id']);

        $exists = parent::getData("SELECT id FROM activity_danger_consequence_measures WHERE activity_danger_consequence_id = $adcId AND preventive_measure_id = $measureId");
        if (!empty($exists)) {
            return $_answers->error_400("Esta medida ya está asignada.");
        }

        $id = parent::nonQueryId("INSERT INTO activity_danger_consequence_measures (activity_danger_consequence_id, preventive_measure_id) VALUES ($adcId, $measureId)");
        $resp = $_answers->response;
        $resp['result'] = ["id" => $id];
        return $resp;
    }

    // ── ELIMINAR ASOCIACIONES ─────────────────────────────────────

    public function removeActivityDanger($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['activity_danger_id']);

        // Cascade: delete measures → consequences → danger link
        $consequences = parent::getData("SELECT id FROM activity_danger_consequences WHERE activity_danger_id = $id");
        foreach ($consequences as $c) {
            parent::nonQuery("DELETE FROM activity_danger_consequence_measures WHERE activity_danger_consequence_id = " . intval($c['id']));
        }
        parent::nonQuery("DELETE FROM activity_danger_consequences WHERE activity_danger_id = $id");
        parent::nonQuery("DELETE FROM activity_dangers WHERE id = $id");

        $resp = $_answers->response;
        $resp['result'] = ["deleted" => $id];
        return $resp;
    }

    public function removeConsequence($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['adc_id']);
        parent::nonQuery("DELETE FROM activity_danger_consequence_measures WHERE activity_danger_consequence_id = $id");
        parent::nonQuery("DELETE FROM activity_danger_consequences WHERE id = $id");

        $resp = $_answers->response;
        $resp['result'] = ["deleted" => $id];
        return $resp;
    }

    public function removeMeasure($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['adcm_id']);
        parent::nonQuery("DELETE FROM activity_danger_consequence_measures WHERE id = $id");

        $resp = $_answers->response;
        $resp['result'] = ["deleted" => $id];
        return $resp;
    }

    // ── Helpers ───────────────────────────────────────────────────

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
