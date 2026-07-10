<?php
require_once 'answers.class.php';
require_once 'connection/connection.php';

class eppDelivery extends connection {
    public function getDeliveryData($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        
        // 1. Get Employees
        $queryEmp = "SELECT id, id_num as id_number, employee_name as name, position, 'Activo' as status FROM personnel WHERE id_empresa = $idEmpresa ORDER BY employee_name ASC";
        $employees = parent::obtenerDatos($queryEmp);
        
        // 2. Get EPP Catalog (distinct epp_names from matrix)
        $queryCatalog = "SELECT DISTINCT epp_name as name FROM epp_matrix WHERE id_empresa = $idEmpresa";
        $catalogRaw = parent::obtenerDatos($queryCatalog);
        $catalog = [];
        $i = 1;
        foreach ($catalogRaw as $cat) {
            $catalog[] = ["id" => $i++, "name" => $cat['name']];
        }
        if (empty($catalog)) {
            // fallback mock catalog
            $catalog = [
                ["id" => 1, "name" => "Casco de Seguridad"],
                ["id" => 2, "name" => "Gafas de Seguridad"],
                ["id" => 3, "name" => "Guantes de Cuero"],
                ["id" => 4, "name" => "Botas de Seguridad"]
            ];
        }

        // 3. Get Deliveries
        $queryDel = "SELECT id, id_employee as empId, delivery_date as date, items FROM epp_delivery WHERE id_empresa = $idEmpresa ORDER BY delivery_date DESC";
        $deliveriesRaw = parent::obtenerDatos($queryDel);
        $deliveries = [];
        foreach ($deliveriesRaw as $del) {
            $deliveries[] = [
                "id" => $del['id'],
                "empId" => $del['empId'],
                "date" => $del['date'],
                "items" => json_decode($del['items'], true) ?: []
            ];
        }

        return [
            "status" => "ok",
            "result" => [
                "employees" => $employees,
                "eppCatalog" => $catalog,
                "deliveryHistory" => $deliveries
            ]
        ];
    }
    
    public function saveDelivery($data) {
        $idEmpresa = intval($data['idEmpresa']);
        $id = isset($data['id']) ? intval($data['id']) : 0;
        
        $empId = intval($data['empId'] ?? 0);
        $date = $data['date'] ?? '';
        $items = isset($data['items']) ? json_encode($data['items']) : '[]';
        
        if ($id > 0) {
            // Update
            $query = "UPDATE epp_delivery SET delivery_date = '$date', items = '$items' WHERE id = $id AND id_empresa = $idEmpresa";
            parent::nonQuery($query);
            return ["status" => "ok", "result" => ["updatedId" => $id]];
        } else {
            // Insert
            $query = "INSERT INTO epp_delivery (id_empresa, id_employee, delivery_date, items) VALUES ($idEmpresa, $empId, '$date', '$items')";
            $newId = parent::nonQueryId($query);
            return ["status" => "ok", "result" => ["insertedId" => $newId]];
        }
    }
    
    public function deleteDelivery($id) {
        $id = intval($id);
        $query = "DELETE FROM epp_delivery WHERE id = $id";
        $resp = parent::nonQuery($query);
        if ($resp >= 1) {
            return ["status" => "ok", "result" => "Eliminado correctamente"];
        } else {
            $_answers = new answers;
            return $_answers->error_500("No se pudo eliminar el registro");
        }
    }
}
?>
