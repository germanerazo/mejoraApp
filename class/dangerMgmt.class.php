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
                "SELECT adc.id as adc_id, c.id as consequence_id, c.name as consequence_name,
                        adc.existing_controls, adc.deficiency_level, adc.exposure_level,
                        adc.consequence_level, adc.exposed_count, adc.worst_consequence, adc.legal_requirements
                 FROM activity_danger_consequences adc
                 JOIN consequences c ON adc.consequence_id = c.id
                 WHERE adc.activity_danger_id = $adId
                 ORDER BY c.name"
            );

            foreach ($consequences as &$cons) {
                $adcId = intval($cons['adc_id']);
                $cons['measures'] = parent::getData(
                    "SELECT adcm.id as adcm_id, pm.id as measure_id, pm.name as measure_name,
                            adcm.elimination, adcm.substitution, adcm.engineering_control,
                            adcm.administrative_control, adcm.ppe
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

    // ── REPORTE COMPLETO (una fila por actividad+peligro+consecuencia) ────────

    public function getFullReport($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        if (!$idEmpresa) return [];

        // Tablas reales:
        //   process_sheet      (idFicha, idEmpresa, code, ...)
        //   process_activity   (idActivity, idFicha, name, area, routine, highRisk)
        //   activity_dangers   (id, idActivity, danger_id)
        //   activity_danger_consequences (id, activity_danger_id, consequence_id, ...)
        $rows = parent::getData(
            "SELECT
                pa.idActivity     AS idActivity,
                pa.name           AS activity_name,
                pa.area           AS area,
                pa.routine        AS routine,
                pa.highRisk       AS high_risk,
                d.id              AS danger_id,
                d.name            AS danger_name,
                dt.name           AS danger_type,
                c.name            AS consequence_name,
                adc.id            AS adc_id,
                adc.existing_controls,
                adc.deficiency_level,
                adc.exposure_level,
                adc.consequence_level,
                adc.exposed_count,
                adc.worst_consequence,
                adc.legal_requirements
             FROM process_sheet ps
             INNER JOIN process_activity pa          ON pa.idFicha          = ps.idFicha
             INNER JOIN activity_dangers ad           ON ad.idActivity        = pa.idActivity
             INNER JOIN dangers d                     ON d.id                 = ad.danger_id
             INNER JOIN danger_types dt               ON dt.id                = d.danger_type_id
             INNER JOIN activity_danger_consequences adc
                                                      ON adc.activity_danger_id = ad.id
             INNER JOIN consequences c                ON c.id                 = adc.consequence_id
             WHERE ps.idEmpresa = $idEmpresa
             ORDER BY pa.name, d.name, c.name"
        );

        // Para cada fila agregar medidas agrupadas y flags de tipo de control
        foreach ($rows as &$row) {
            $adcId = intval($row['adc_id']);
            $measures = parent::getData(
                "SELECT pm.name               AS measure_name,
                        adcm.elimination,
                        adcm.substitution,
                        adcm.engineering_control,
                        adcm.administrative_control,
                        adcm.ppe
                 FROM activity_danger_consequence_measures adcm
                 JOIN preventive_measures pm ON pm.id = adcm.preventive_measure_id
                 WHERE adcm.activity_danger_consequence_id = $adcId"
            );

            $names          = [];
            $elimination    = 0;
            $substitution   = 0;
            $engineering    = 0;
            $administrative = 0;
            $ppe            = 0;

            foreach ($measures as $m) {
                $names[] = $m['measure_name'];
                if (!empty($m['elimination']))            $elimination    = 1;
                if (!empty($m['substitution']))           $substitution   = 1;
                if (!empty($m['engineering_control']))    $engineering    = 1;
                if (!empty($m['administrative_control'])) $administrative = 1;
                if (!empty($m['ppe']))                    $ppe            = 1;
            }

            $row['measures']           = implode(' / ', $names);
            $row['has_elimination']    = $elimination;
            $row['has_substitution']   = $substitution;
            $row['has_engineering']    = $engineering;
            $row['has_administrative'] = $administrative;
            $row['has_ppe']            = $ppe;
        }

        return $rows;
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
        
        $existing_controls = $this->sanitize($data['existing_controls'] ?? '');
        $def_lvl = isset($data['deficiency_level']) && $data['deficiency_level'] !== '' ? intval($data['deficiency_level']) : 'NULL';
        $exp_lvl = isset($data['exposure_level']) && $data['exposure_level'] !== '' ? intval($data['exposure_level']) : 'NULL';
        $cons_lvl = isset($data['consequence_level']) && $data['consequence_level'] !== '' ? intval($data['consequence_level']) : 'NULL';
        $exp_count = isset($data['exposed_count']) && $data['exposed_count'] !== '' ? intval($data['exposed_count']) : 'NULL';
        $worst_cons = $this->sanitize($data['worst_consequence'] ?? '');
        $legal_req = $this->sanitize($data['legal_requirements'] ?? '');

        // Se quita la verificación de "ya existe" para permitir varias evaluaciones de la misma consecuencia si se desea,
        // o se puede mantener. A pedido del usuario no cambia esa regla, pero la consecuencia puede ser única por peligro.
        $exists = parent::getData("SELECT id FROM activity_danger_consequences WHERE activity_danger_id = $adId AND consequence_id = $consId");
        if (!empty($exists)) {
            return $_answers->error_400("Esta consecuencia ya está asignada a este peligro.");
        }

        $query = "INSERT INTO activity_danger_consequences 
            (activity_danger_id, consequence_id, existing_controls, deficiency_level, exposure_level, consequence_level, exposed_count, worst_consequence, legal_requirements) 
            VALUES ($adId, $consId, '$existing_controls', $def_lvl, $exp_lvl, $cons_lvl, $exp_count, '$worst_cons', '$legal_req')";
            
        $id = parent::nonQueryId($query);
        $resp = $_answers->response;
        $resp['result'] = ["id" => $id];
        return $resp;
    }

    public function addMeasure($data) {
        $_answers = new answers;
        if(!$this->verifyToken($data, $_answers)) return $_answers->response;

        $adcId = intval($data['activity_danger_consequence_id']);
        $dangerId = isset($data['danger_id']) ? intval($data['danger_id']) : 0;
        
        $measureId = isset($data['preventive_measure_id']) && $data['preventive_measure_id'] !== '' 
            ? intval($data['preventive_measure_id']) : null;
        $new_measure = isset($data['new_measure_name']) ? $this->sanitize($data['new_measure_name']) : '';

        // Toggles
        $elimination = !empty($data['elimination']) ? 1 : 0;
        $substitution = !empty($data['substitution']) ? 1 : 0;
        $eng_ctrl = !empty($data['engineering_control']) ? 1 : 0;
        $admin_ctrl = !empty($data['administrative_control']) ? 1 : 0;
        $ppe = !empty($data['ppe']) ? 1 : 0;

        if (!$measureId && $new_measure) {
            // Ver si ya existe
            $existingMeasure = parent::getData("SELECT id FROM preventive_measures WHERE name = '$new_measure'");
            if (empty($existingMeasure)) {
                $measureId = parent::nonQueryId("INSERT INTO preventive_measures (name) VALUES ('$new_measure')");
            } else {
                $measureId = $existingMeasure[0]['id'];
            }
        }

        if ($measureId && $dangerId > 0) {
            // Siempre asociar la medida con el peligro en la tabla maestra (si no lo está ya)
            $linkExists = parent::getData("SELECT id FROM danger_preventive_measures WHERE danger_id = $dangerId AND preventive_measure_id = $measureId");
            if (empty($linkExists)) {
                parent::nonQueryId("INSERT INTO danger_preventive_measures (danger_id, preventive_measure_id) VALUES ($dangerId, $measureId)");
            }
        }

        if (!$measureId) {
            return $_answers->error_400("Falta el ID de la medida o el nombre de la nueva medida.");
        }

        $exists = parent::getData("SELECT id FROM activity_danger_consequence_measures WHERE activity_danger_consequence_id = $adcId AND preventive_measure_id = $measureId");
        if (!empty($exists)) {
            return $_answers->error_400("Esta medida ya está asignada a esta consecuencia.");
        }

        $query = "INSERT INTO activity_danger_consequence_measures 
            (activity_danger_consequence_id, preventive_measure_id, elimination, substitution, engineering_control, administrative_control, ppe) 
            VALUES ($adcId, $measureId, $elimination, $substitution, $eng_ctrl, $admin_ctrl, $ppe)";
            
        $id = parent::nonQueryId($query);
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
