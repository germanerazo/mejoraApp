<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';

class departments extends connection
{
    private $table = "departments";

    /**
     * Lista todos los departamentos ordenados por nombre.
     * GET ?page=1
     */
    public function listDepartments($page = 1)
    {
        $initial = 0;
        $limit   = 100;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit   = $limit * $page;
        }
        $query = "SELECT idDepto, codDepto, nomDepto, abreviatura
                  FROM " . $this->table . "
                  ORDER BY nomDepto
                  LIMIT $initial, $limit";
        return parent::getData($query);
    }

    /**
     * Busca departamentos por nombre (búsqueda parcial).
     * GET ?search=antioquia
     */
    public function searchDepartments($term)
    {
        $term  = $this->sanitize($term);
        $query = "SELECT idDepto, codDepto, nomDepto, abreviatura
                  FROM " . $this->table . "
                  WHERE nomDepto LIKE '%$term%'
                  ORDER BY nomDepto
                  LIMIT 50";
        return parent::getData($query);
    }

    /**
     * Obtiene un departamento por su ID.
     * GET ?id=1
     */
    public function getDepartment($id)
    {
        $id    = intval($id);
        $query = "SELECT idDepto, codDepto, nomDepto, abreviatura
                  FROM " . $this->table . "
                  WHERE idDepto = $id
                  LIMIT 1";
        $data  = parent::getData($query);
        return $data ? $data[0] : null;
    }

    /**
     * Obtiene un departamento por su código.
     * GET ?code=05
     */
    public function getDepartmentByCode($codDepto)
    {
        $codDepto = intval($codDepto);
        $query = "SELECT idDepto, codDepto, nomDepto, abreviatura
                  FROM " . $this->table . "
                  WHERE codDepto = $codDepto
                  LIMIT 1";
        $data  = parent::getData($query);
        return $data ? $data[0] : null;
    }

    /**
     * Sanitiza un string para uso en queries.
     */
    private function sanitize($value)
    {
        return addslashes(trim(strip_tags($value)));
    }
}
?>
