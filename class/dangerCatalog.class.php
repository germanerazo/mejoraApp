<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class dangerCatalog extends connection {

    private $token;

    // ── LISTAR ─────────────────────────────────────────────────

    public function listDangers() {
        return parent::getData(
            "SELECT d.id, d.danger_type_id, d.name, d.description, dt.name as type_name
             FROM dangers d
             JOIN danger_types dt ON d.danger_type_id = dt.id
             ORDER BY dt.name ASC, d.name ASC"
        );
    }

    public function listTypes() {
        return parent::getData("SELECT * FROM danger_types ORDER BY name ASC");
    }

    // ── CREAR ──────────────────────────────────────────────────

    public function createType($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $name = $this->sanitize($data['name'] ?? '');
        if ($name === '') return $_answers->error_400("El nombre del tipo de peligro es obligatorio.");

        // Verificar duplicado
        $exists = parent::getData("SELECT id FROM danger_types WHERE name = '$name'");
        if (!empty($exists)) {
            return $_answers->error_400("Ya existe un tipo de peligro con ese nombre.");
        }

        $id = parent::nonQueryId("INSERT INTO danger_types (name) VALUES ('$name')");
        $resp = $_answers->response;
        $resp['result'] = ['id' => $id];
        return $resp;
    }

    public function createDanger($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $typeId = intval($data['danger_type_id'] ?? 0);
        $name   = $this->sanitize($data['name'] ?? '');
        $desc   = $this->sanitize($data['description'] ?? '');

        if (!$typeId) return $_answers->error_400("Debe seleccionar un tipo de peligro.");
        if ($name === '') return $_answers->error_400("El nombre del peligro es obligatorio.");

        // Verificar que el tipo exista
        $typeExists = parent::getData("SELECT id FROM danger_types WHERE id = $typeId");
        if (empty($typeExists)) {
            return $_answers->error_400("El tipo de peligro seleccionado no existe.");
        }

        // Verificar duplicado
        $exists = parent::getData("SELECT id FROM dangers WHERE name = '$name' AND danger_type_id = $typeId");
        if (!empty($exists)) {
            return $_answers->error_400("Ya existe un peligro con ese nombre en este tipo.");
        }

        $id = parent::nonQueryId(
            "INSERT INTO dangers (danger_type_id, name, description) VALUES ($typeId, '$name', '$desc')"
        );
        $resp = $_answers->response;
        $resp['result'] = ['id' => $id];
        return $resp;
    }

    // ── ACTUALIZAR ─────────────────────────────────────────────

    public function updateType($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id   = intval($data['id'] ?? 0);
        $name = $this->sanitize($data['name'] ?? '');

        if (!$id) return $_answers->error_400("ID del tipo de peligro es obligatorio.");
        if ($name === '') return $_answers->error_400("El nombre del tipo de peligro es obligatorio.");

        // Verificar duplicado (excluyendo el actual)
        $exists = parent::getData("SELECT id FROM danger_types WHERE name = '$name' AND id != $id");
        if (!empty($exists)) {
            return $_answers->error_400("Ya existe otro tipo de peligro con ese nombre.");
        }

        parent::nonQuery("UPDATE danger_types SET name = '$name' WHERE id = $id");
        $resp = $_answers->response;
        $resp['result'] = ['id' => $id];
        return $resp;
    }

    public function updateDanger($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id     = intval($data['id'] ?? 0);
        $typeId = intval($data['danger_type_id'] ?? 0);
        $name   = $this->sanitize($data['name'] ?? '');
        $desc   = $this->sanitize($data['description'] ?? '');

        if (!$id) return $_answers->error_400("ID del peligro es obligatorio.");
        if (!$typeId) return $_answers->error_400("Debe seleccionar un tipo de peligro.");
        if ($name === '') return $_answers->error_400("El nombre del peligro es obligatorio.");

        // Verificar duplicado (excluyendo el actual)
        $exists = parent::getData("SELECT id FROM dangers WHERE name = '$name' AND danger_type_id = $typeId AND id != $id");
        if (!empty($exists)) {
            return $_answers->error_400("Ya existe otro peligro con ese nombre en este tipo.");
        }

        parent::nonQuery(
            "UPDATE dangers SET danger_type_id = $typeId, name = '$name', description = '$desc' WHERE id = $id"
        );
        $resp = $_answers->response;
        $resp['result'] = ['id' => $id];
        return $resp;
    }

    // ── ELIMINAR ───────────────────────────────────────────────

    public function deleteType($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['id'] ?? 0);
        if (!$id) return $_answers->error_400("ID del tipo de peligro es obligatorio.");

        // Verificar integridad: no eliminar si tiene peligros asociados
        $dangers = parent::getData("SELECT id FROM dangers WHERE danger_type_id = $id LIMIT 1");
        if (!empty($dangers)) {
            return $_answers->error_400("No se puede eliminar este tipo porque tiene peligros asociados. Elimine primero los peligros.");
        }

        parent::nonQuery("DELETE FROM danger_types WHERE id = $id");
        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $id];
        return $resp;
    }

    public function deleteDanger($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $id = intval($data['id'] ?? 0);
        if (!$id) return $_answers->error_400("ID del peligro es obligatorio.");

        // Verificar integridad: no eliminar si está en uso en activity_dangers
        $used = parent::getData("SELECT id FROM activity_dangers WHERE danger_id = $id LIMIT 1");
        if (!empty($used)) {
            return $_answers->error_400("No se puede eliminar este peligro porque está asignado a una o más actividades. Desasócielo primero.");
        }

        // Limpiar relaciones del catálogo
        parent::nonQuery("DELETE FROM danger_consequences WHERE danger_id = $id");
        parent::nonQuery("DELETE FROM danger_preventive_measures WHERE danger_id = $id");
        parent::nonQuery("DELETE FROM dangers WHERE id = $id");

        $resp = $_answers->response;
        $resp['result'] = ['deleted' => $id];
        return $resp;
    }

    // ── Helpers ───────────────────────────────────────────────

    private function verifyToken($data, &$_answers) {
        $_token = new token;
        if (!isset($data['token'])) {
            $_answers->response = $_answers->error_401();
            return false;
        }
        $this->token = $data['token'];
        $arrayToken = $_token->searchToken($this->token);
        if (!$arrayToken) {
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
