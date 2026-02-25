<?php

require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';

class cities extends connection
{
    private $table = "cities";

    /**
     * Lista todas las ciudades con paginación.
     * GET ?page=1
     */
    public function listCities($page = 1)
    {
        $initial = 0;
        $limit   = 200;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit   = $limit * $page;
        }
        $query = "SELECT idCiudad, codCiudad, nomCiudad, codDepto
                  FROM " . $this->table . "
                  ORDER BY nomCiudad
                  LIMIT $initial, $limit";
        return parent::getData($query);
    }

    /**
     * Filtra ciudades por departamento.
     * GET ?depto=05
     */
    public function getCitiesByDepto($codDepto)
    {
        $codDepto = intval($codDepto);
        $query = "SELECT idCiudad, codCiudad, nomCiudad, codDepto
                  FROM " . $this->table . "
                  WHERE codDepto = $codDepto
                  ORDER BY nomCiudad";
        return parent::getData($query);
    }

    /**
     * Busca ciudades por nombre (búsqueda parcial).
     * GET ?search=bogota
     */
    public function searchCities($term)
    {
        $term  = $this->sanitize($term);
        $query = "SELECT idCiudad, codCiudad, nomCiudad, codDepto
                  FROM " . $this->table . "
                  WHERE nomCiudad LIKE '%$term%'
                  ORDER BY nomCiudad
                  LIMIT 50";
        return parent::getData($query);
    }

    /**
     * Obtiene una ciudad por su ID.
     * GET ?id=1
     */
    public function getCity($id)
    {
        $id    = intval($id);
        $query = "SELECT idCiudad, codCiudad, nomCiudad, codDepto
                  FROM " . $this->table . "
                  WHERE idCiudad = $id
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
