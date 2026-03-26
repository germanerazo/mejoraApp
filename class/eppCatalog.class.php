<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class eppCatalog extends connection {

    private $token;

    // ── LIST ───────────────────────────────────────────────────────────────────
    public function list($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData(
            "SELECT id, name, standard
             FROM epp_catalog
             WHERE idEmpresa = $idEmpresa
             ORDER BY name ASC"
        );
    }

    // ── CREATE ─────────────────────────────────────────────────────────────────
    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        $name      = $this->sanitize($data['name'] ?? '');
        $standard  = $this->sanitize($data['standard'] ?? '');

        if (!$idEmpresa || !$name) {
            return $_answers->error_400('Faltan campos requeridos: idEmpresa, name');
        }

        $newId = parent::nonQueryId(
            "INSERT INTO epp_catalog (idEmpresa, name, standard)
             VALUES ($idEmpresa, '$name', '$standard')"
        );

        $resp = $_answers->response;
        $resp['result'] = ['id' => $newId, 'name' => $name, 'standard' => $standard];
        return $resp;
    }

    // ── UPDATE ─────────────────────────────────────────────────────────────────
    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id       = intval($data['id'] ?? 0);
        $name     = $this->sanitize($data['name'] ?? '');
        $standard = $this->sanitize($data['standard'] ?? '');

        if (!$id || !$name) {
            return $_answers->error_400('Faltan campos requeridos: id, name');
        }

        parent::nonQuery(
            "UPDATE epp_catalog SET name='$name', standard='$standard' WHERE id=$id"
        );

        $resp = $_answers->response;
        $resp['result'] = ['id' => $id, 'name' => $name, 'standard' => $standard];
        return $resp;
    }

    // ── DELETE ─────────────────────────────────────────────────────────────────
    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['id'] ?? 0);
        if (!$id) return $_answers->error_400('Falta el campo: id');

        parent::nonQuery("DELETE FROM epp_catalog WHERE id=$id");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $id];
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
