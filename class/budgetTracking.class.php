<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class budgetTracking extends connection {

    private $token;

    // ── LIST budget years for a company (reuses budget_years) ─────────────────
    public function listYears($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData(
            "SELECT idBudget, year
             FROM budget_years
             WHERE idEmpresa = $idEmpresa
             ORDER BY year DESC"
        );
    }

    // ── GET tracking data for a budget (12 months) ────────────────────────────
    // Returns array indexed by month (1-12) with budget and executed values.
    public function getTracking($idBudget) {
        $idBudget = intval($idBudget);

        // Verify budget exists and get year
        $budgetRows = parent::getData(
            "SELECT idBudget, year, idEmpresa FROM budget_years WHERE idBudget = $idBudget"
        );
        if (empty($budgetRows)) return null;

        $result = $budgetRows[0];

        // Fetch all months for this budget
        $rows = parent::getData(
            "SELECT month, budget, executed
             FROM budget_tracking
             WHERE idBudget = $idBudget
             ORDER BY month ASC"
        );

        // Build a 12-slot array (month 1-12)
        $months = [];
        for ($m = 1; $m <= 12; $m++) {
            $months[$m] = ['month' => $m, 'budget' => 0, 'executed' => 0];
        }
        foreach ($rows as $row) {
            $m = intval($row['month']);
            if ($m >= 1 && $m <= 12) {
                $months[$m] = [
                    'month'    => $m,
                    'budget'   => floatval($row['budget']),
                    'executed' => floatval($row['executed']),
                ];
            }
        }

        $result['months'] = array_values($months); // 0-indexed array for JS
        return $result;
    }

    // ── SAVE tracking months (upsert all 12 months at once) ──────────────────
    public function saveTracking($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idBudget = intval($data['idBudget'] ?? 0);
        $months   = $data['months'] ?? [];

        if (!$idBudget || !is_array($months)) {
            return $_answers->error_400('Faltan campos: idBudget, months');
        }

        foreach ($months as $item) {
            $month    = intval($item['month']   ?? 0);
            $budget   = floatval($item['budget']   ?? 0);
            $executed = floatval($item['executed'] ?? 0);

            if ($month < 1 || $month > 12) continue;

            // Check if row exists
            $exists = parent::getData(
                "SELECT idTracking FROM budget_tracking
                 WHERE idBudget=$idBudget AND month=$month"
            );

            if (!empty($exists)) {
                parent::nonQuery(
                    "UPDATE budget_tracking
                     SET budget=$budget, executed=$executed
                     WHERE idBudget=$idBudget AND month=$month"
                );
            } else {
                parent::nonQuery(
                    "INSERT INTO budget_tracking (idBudget, month, budget, executed)
                     VALUES ($idBudget, $month, $budget, $executed)"
                );
            }
        }

        $resp = $_answers->response;
        $resp['result'] = ['idBudget' => $idBudget, 'saved' => count($months)];
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
}
?>
