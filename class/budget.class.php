<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class budget extends connection {

    private $token;

    // ── LIST years ────────────────────────────────────────────────────────────
    public function listBudgets($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData(
            "SELECT idBudget, year
             FROM budget_years
             WHERE idEmpresa = $idEmpresa
             ORDER BY year DESC"
        );
    }

    // ── GET full budget (header + items) ─────────────────────────────────────
    public function getBudget($idBudget) {
        $idBudget = intval($idBudget);

        $rows = parent::getData(
            "SELECT * FROM budget_years WHERE idBudget = $idBudget"
        );
        if (empty($rows)) return null;

        $budget = $rows[0];
        $budget['items'] = parent::getData(
            "SELECT idItem, activity, unitValue, quantity, unit
             FROM budget_items
             WHERE idBudget = $idBudget
             ORDER BY idItem ASC"
        );

        return $budget;
    }

    // ── CREATE header ─────────────────────────────────────────────────────────
    public function createBudget($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        $year      = intval($data['year'] ?? 0);

        if (!$idEmpresa || !$year) {
            return $_answers->error_400('Faltan campos: idEmpresa, year');
        }

        // Check uniqueness
        $exists = parent::getData(
            "SELECT idBudget FROM budget_years WHERE idEmpresa = $idEmpresa AND year = $year"
        );
        if (!empty($exists)) {
            return $_answers->error_200('Ya existe un presupuesto para ese año.');
        }

        $newId = parent::nonQueryId(
            "INSERT INTO budget_years (idEmpresa, year) VALUES ($idEmpresa, $year)"
        );

        $resp = $_answers->response;
        $resp['result'] = ['idBudget' => $newId, 'year' => $year];
        return $resp;
    }

    // ── DELETE header (cascade deletes items) ─────────────────────────────────
    public function deleteBudget($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idBudget = intval($data['idBudget'] ?? 0);
        if (!$idBudget) return $_answers->error_400('Falta el campo: idBudget');

        parent::nonQuery("DELETE FROM budget_years WHERE idBudget = $idBudget");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $idBudget];
        return $resp;
    }

    // ── SAVE item (INSERT or UPDATE) ──────────────────────────────────────────
    public function saveItem($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idBudget  = intval($data['idBudget'] ?? 0);
        $activity  = $this->sanitize($data['activity']  ?? '');
        $unitValue = floatval($data['unitValue'] ?? 0);
        $quantity  = floatval($data['quantity']  ?? 0);
        $unit      = $this->sanitize($data['unit'] ?? '');
        $idItem    = isset($data['idItem']) ? intval($data['idItem']) : null;

        if (!$idBudget) {
            return $_answers->error_400('Falta el campo: idBudget');
        }

        if ($idItem) {
            parent::nonQuery(
                "UPDATE budget_items
                 SET activity='$activity', unitValue=$unitValue, quantity=$quantity, unit='$unit'
                 WHERE idItem=$idItem AND idBudget=$idBudget"
            );
            $id = $idItem;
        } else {
            $id = parent::nonQueryId(
                "INSERT INTO budget_items (idBudget, activity, unitValue, quantity, unit)
                 VALUES ($idBudget, '$activity', $unitValue, $quantity, '$unit')"
            );
        }

        $resp = $_answers->response;
        $resp['result'] = ['idItem' => $id];
        return $resp;
    }

    // ── DELETE item ───────────────────────────────────────────────────────────
    public function deleteItem($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idItem = intval($data['idItem'] ?? 0);
        if (!$idItem) return $_answers->error_400('Falta el campo: idItem');

        parent::nonQuery("DELETE FROM budget_items WHERE idItem=$idItem");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $idItem];
        return $resp;
    }

    // ── BULK SAVE items (replace all items for a budget) ─────────────────────
    public function saveAllItems($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idBudget = intval($data['idBudget'] ?? 0);
        $items    = $data['items'] ?? [];

        if (!$idBudget) {
            return $_answers->error_400('Falta el campo: idBudget');
        }

        // Delete current items and re-insert
        parent::nonQuery("DELETE FROM budget_items WHERE idBudget=$idBudget");

        foreach ($items as $item) {
            $activity  = $this->sanitize($item['activity']  ?? '');
            $unitValue = floatval($item['unitValue'] ?? 0);
            $quantity  = floatval($item['quantity']  ?? 0);
            $unit      = $this->sanitize($item['unit'] ?? '');

            parent::nonQuery(
                "INSERT INTO budget_items (idBudget, activity, unitValue, quantity, unit)
                 VALUES ($idBudget, '$activity', $unitValue, $quantity, '$unit')"
            );
        }

        $resp = $_answers->response;
        $resp['result'] = ['idBudget' => $idBudget, 'count' => count($items)];
        return $resp;
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private function verifyToken($data, &$_answers) {
        $_token = new token;
        if (!isset($data['token'])) {
            $_answers->response = $_answers->error_401();
            return false;
        }
        $this->token = $data['token'];
        if (!$_token->searchToken($this->token)) {
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
