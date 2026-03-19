<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

/**
 * Clase legalMatrix
 * CRUD para la tabla `legal_matrix` (Matriz Legal).
 */
class legalMatrix extends connection {

    private $table = 'legal_matrix';
    private $token;

    // ─────────────────────────────────────────────────────────────────────────
    // READ – Listar registros de una empresa
    // ─────────────────────────────────────────────────────────────────────────
    public function list($idEmpresa, $clasificacion = '', $norma = '') {
        $idEmpresa = intval($idEmpresa);
        if (!$idEmpresa) return [];

        $where = "idEmpresa = $idEmpresa";

        if ($clasificacion !== '') {
            $clasificacion = $this->sanitize($clasificacion);
            $where .= " AND clasificacion = '$clasificacion'";
        }

        if ($norma !== '') {
            $norma = $this->sanitize($norma);
            $where .= " AND norma LIKE '%$norma%'";
        }

        $query = "SELECT * FROM {$this->table} WHERE $where ORDER BY idLegal ASC";
        return parent::getData($query);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CREATE – Insertar un nuevo registro
    // ─────────────────────────────────────────────────────────────────────────
    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        $norma     = $this->sanitize($data['norma'] ?? '');

        if (!$idEmpresa || !$norma) return $_answers->error_400();

        $clasificacion = $this->sanitize($data['clasificacion'] ?? 'S');
        $anioEmision   = intval($data['anioEmision']  ?? 0);
        $disposicion   = $this->sanitize($data['disposicion']  ?? '');
        $articulos     = $this->sanitize($data['articulos']    ?? '');
        $descripcion   = $this->sanitize($data['descripcion']  ?? '');
        $evidencia     = $this->sanitize($data['evidencia']    ?? '');
        $responsable   = $this->sanitize($data['responsable']  ?? '');
        $existeAct     = in_array($data['existeAct'] ?? 'NO', ['SI','NO']) ? $data['existeAct'] : 'NO';
        $observacion   = $this->sanitize($data['observacion']  ?? '');
        $fecha         = $this->sanitize($data['fecha']        ?? date('Y-m-d'));

        $anioSql = $anioEmision ? $anioEmision : 'NULL';

        $idLegal = parent::nonQueryId(
            "INSERT INTO {$this->table}
             (idEmpresa, clasificacion, norma, anioEmision, disposicion, articulos,
              descripcion, evidencia, responsable, existeAct, observacion, fecha)
             VALUES
             ($idEmpresa, '$clasificacion', '$norma', $anioSql, '$disposicion', '$articulos',
              '$descripcion', '$evidencia', '$responsable', '$existeAct', '$observacion', '$fecha')"
        );

        if ($idLegal) {
            $resp = $_answers->response;
            $resp['result'] = ['idLegal' => $idLegal];
            return $resp;
        }
        return $_answers->error_500("Error al insertar el registro legal.");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UPDATE – Actualizar un registro existente
    // ─────────────────────────────────────────────────────────────────────────
    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idLegal   = intval($data['idLegal']   ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idLegal || !$idEmpresa) return $_answers->error_400();

        $updates = [];

        if (isset($data['clasificacion'])) $updates[] = "clasificacion='"   . $this->sanitize($data['clasificacion']) . "'";
        if (isset($data['norma']))         $updates[] = "norma='"           . $this->sanitize($data['norma'])         . "'";
        if (isset($data['anioEmision'])) {
            $anio = intval($data['anioEmision']);
            $updates[] = $anio ? "anioEmision=$anio" : "anioEmision=NULL";
        }
        if (isset($data['disposicion']))   $updates[] = "disposicion='"     . $this->sanitize($data['disposicion'])   . "'";
        if (isset($data['articulos']))     $updates[] = "articulos='"       . $this->sanitize($data['articulos'])     . "'";
        if (isset($data['descripcion']))   $updates[] = "descripcion='"     . $this->sanitize($data['descripcion'])   . "'";
        if (isset($data['evidencia']))     $updates[] = "evidencia='"       . $this->sanitize($data['evidencia'])     . "'";
        if (isset($data['responsable']))   $updates[] = "responsable='"     . $this->sanitize($data['responsable'])   . "'";
        if (isset($data['existeAct']) && in_array($data['existeAct'], ['SI','NO'])) {
            $updates[] = "existeAct='" . $data['existeAct'] . "'";
        }
        if (isset($data['observacion']))   $updates[] = "observacion='"     . $this->sanitize($data['observacion'])   . "'";
        if (isset($data['fecha']))         $updates[] = "fecha='"           . $this->sanitize($data['fecha'])         . "'";

        if (!empty($updates)) {
            parent::nonQuery(
                "UPDATE {$this->table} SET " . implode(', ', $updates) .
                " WHERE idLegal=$idLegal AND idEmpresa=$idEmpresa"
            );
        }

        $resp = $_answers->response;
        $resp['result'] = ['idLegal' => $idLegal];
        return $resp;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE – Eliminar un registro
    // ─────────────────────────────────────────────────────────────────────────
    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idLegal   = intval($data['idLegal']   ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idLegal || !$idEmpresa) return $_answers->error_400();

        parent::nonQuery(
            "DELETE FROM {$this->table} WHERE idLegal=$idLegal AND idEmpresa=$idEmpresa"
        );

        $resp = $_answers->response;
        $resp['result'] = ['idLegal' => $idLegal];
        return $resp;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DELETE ALL – Eliminar TODOS los registros de una empresa
    // ─────────────────────────────────────────────────────────────────────────
    public function deleteAll($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idEmpresa) return $_answers->error_400();

        $deleted = parent::nonQuery(
            "DELETE FROM {$this->table} WHERE idEmpresa=$idEmpresa"
        );

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $deleted];
        return $resp;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers privados
    // ─────────────────────────────────────────────────────────────────────────
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

    private function sanitize($v) {
        return addslashes(trim(strip_tags($v)));
    }
}
?>
