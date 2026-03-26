<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class profileCargo extends connection {

    private $token;

    // Mapeo tipo → tabla DB
    private $subTables = [
        'responsabilidades'     => 'profile_responsibilidades',
        'educacion'             => 'profile_educacion',
        'formacion'             => 'profile_formacion',
        'experiencia'           => 'profile_experiencia',
        'profesiograma'         => 'profile_profesiograma',
        'competencias'          => 'profile_competencias',
        'sst_riesgos'           => 'profile_sst_riesgos',
        'sst_responsabilidades' => 'profile_sst_responsabilidades',
        'epp'                   => 'profile_epp',
    ];

    // ── CATÁLOGO: Personal registrado en processSheet por empresa ─────────────
    public function getPersonnelByEmpresa($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        // Trae roles únicos de process_personnel para la empresa
        return parent::getData(
            "SELECT pp.idPersonnel, pp.role, pp.reportsTo
             FROM process_personnel pp
             INNER JOIN process_sheet ps ON pp.idFicha = ps.idFicha
             WHERE ps.idEmpresa = $idEmpresa
             ORDER BY pp.role ASC"
        );
    }

    // ── LIST: perfiles de cargo de una empresa ────────────────────────────────
    public function list($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData(
            "SELECT pc.id, pc.idPersonnel, pc.reportsTo,
                    pp.role AS cargo
             FROM profile_cargo pc
             INNER JOIN process_personnel pp ON pp.idPersonnel = pc.idPersonnel
             WHERE pc.idEmpresa = $idEmpresa
             ORDER BY pp.role ASC"
        );
    }

    // ── GET ONE: perfil + todas las subtablas ─────────────────────────────────
    public function get($id) {
        $id = intval($id);
        $rows = parent::getData(
            "SELECT pc.id, pc.idPersonnel, pc.reportsTo,
                    pp.role AS cargo
             FROM profile_cargo pc
             INNER JOIN process_personnel pp ON pp.idPersonnel = pc.idPersonnel
             WHERE pc.id = $id LIMIT 1"
        );

        if (empty($rows)) return null;
        $profile = $rows[0];

        foreach ($this->subTables as $key => $table) {
            if ($key === 'epp') {
                // Para EPP traemos también el idEppCatalog para referencia
                $profile[$key] = parent::getData(
                    "SELECT id, idEppCatalog, descripcion FROM $table WHERE idProfile = $id ORDER BY id ASC"
                );
            } else {
                $profile[$key] = parent::getData(
                    "SELECT id, descripcion FROM $table WHERE idProfile = $id ORDER BY id ASC"
                );
            }
        }

        return $profile;
    }

    // ── POST: crear perfil base ───────────────────────────────────────────────
    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa   = intval($data['idEmpresa'] ?? 0);
        $idPersonnel = intval($data['idPersonnel'] ?? 0);
        $reportsTo   = $this->sanitize($data['reportsTo'] ?? '');

        if (!$idEmpresa || !$idPersonnel) {
            return $_answers->error_400('Faltan campos requeridos: idEmpresa, idPersonnel');
        }

        // Verificar duplicado
        $exists = parent::getData(
            "SELECT id FROM profile_cargo WHERE idEmpresa = $idEmpresa AND idPersonnel = $idPersonnel LIMIT 1"
        );
        if (!empty($exists)) {
            return $_answers->error_400('Ya existe un perfil de cargo para este puesto en la empresa.');
        }

        $newId = parent::nonQueryId(
            "INSERT INTO profile_cargo (idEmpresa, idPersonnel, reportsTo)
             VALUES ($idEmpresa, $idPersonnel, '$reportsTo')"
        );

        $resp = $_answers->response;
        $resp['result'] = ['id' => $newId];
        return $resp;
    }

    // ── PUT: actualizar reportsTo del perfil ──────────────────────────────────
    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id        = intval($data['id'] ?? 0);
        $reportsTo = $this->sanitize($data['reportsTo'] ?? '');

        parent::nonQuery("UPDATE profile_cargo SET reportsTo='$reportsTo' WHERE id=$id");

        $resp = $_answers->response;
        $resp['result'] = ['id' => $id];
        return $resp;
    }

    // ── DELETE perfil completo (cascade manual) ───────────────────────────────
    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['id'] ?? 0);

        foreach ($this->subTables as $table) {
            parent::nonQuery("DELETE FROM $table WHERE idProfile = $id");
        }
        parent::nonQuery("DELETE FROM profile_cargo WHERE id = $id");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $id];
        return $resp;
    }

    // ── SUBTABLA: agregar ítem ────────────────────────────────────────────────
    public function addItem($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idProfile    = intval($data['idProfile'] ?? 0);
        $type         = $this->sanitize($data['type'] ?? '');
        $descripcion  = $this->sanitize($data['descripcion'] ?? '');
        $idEppCatalog = intval($data['idEppCatalog'] ?? 0);

        if (!$idProfile || !isset($this->subTables[$type]) || !$descripcion) {
            return $_answers->error_400('Faltan parámetros: idProfile, type, descripcion');
        }

        $table = $this->subTables[$type];

        // Para EPP: guardar también la FK al catálogo
        if ($type === 'epp' && $idEppCatalog > 0) {
            $newId = parent::nonQueryId(
                "INSERT INTO $table (idProfile, idEppCatalog, descripcion)
                 VALUES ($idProfile, $idEppCatalog, '$descripcion')"
            );
        } else {
            $newId = parent::nonQueryId(
                "INSERT INTO $table (idProfile, descripcion) VALUES ($idProfile, '$descripcion')"
            );
        }

        $resp = $_answers->response;
        $resp['result'] = ['id' => $newId];
        return $resp;
    }

    // ── SUBTABLA: eliminar ítem ───────────────────────────────────────────────
    public function deleteItem($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $itemId = intval($data['itemId'] ?? 0);
        $type   = $this->sanitize($data['type'] ?? '');

        if (!$itemId || !isset($this->subTables[$type])) {
            return $_answers->error_400('Faltan parámetros: itemId, type');
        }

        $table = $this->subTables[$type];
        parent::nonQuery("DELETE FROM $table WHERE id = $itemId");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $itemId];
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
