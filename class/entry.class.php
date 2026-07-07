<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class entry extends connection {

    private $table = 'entry';
    private $token;

    public function list($idEmpresa) {
        $idEmpresa = intval($idEmpresa);
        return parent::getData("SELECT * FROM {$this->table} WHERE idEmpresa = $idEmpresa ORDER BY fechaCreacion DESC");
    }

    public function post($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEmpresa       = intval($data['idEmpresa'] ?? 0);
        $fechaIngreso    = $this->sanitize($data['fechaIngreso'] ?? '');
        $fechaNacimiento = $this->sanitize($data['fechaNacimiento'] ?? '');
        $lugarNacimiento = $this->sanitize($data['lugarNacimiento'] ?? '');
        $identificacion  = $this->sanitize($data['identificacion'] ?? '');
        $sexo            = $this->sanitize($data['sexo'] ?? '');
        $nombre          = $this->sanitize($data['nombre'] ?? '');
        $estadoCivil     = $this->sanitize($data['estadoCivil'] ?? '');
        $rh              = $this->sanitize($data['rh'] ?? '');
        $escolaridad     = $this->sanitize($data['escolaridad'] ?? '');
        $telefono        = $this->sanitize($data['telefono'] ?? '');
        $salario         = floatval($data['salario'] ?? 0);
        $estrato         = intval($data['estrato'] ?? 0);
        $personasCargo   = intval($data['personasCargo'] ?? 0);
        $cabezaFamilia   = $this->sanitize($data['cabezaFamilia'] ?? '');
        $numeroHijos     = intval($data['numeroHijos'] ?? 0);
        $grupoEtnico     = $this->sanitize($data['grupoEtnico'] ?? '');
        $cargo           = $this->sanitize($data['cargo'] ?? '');
        $horario         = $this->sanitize($data['horario'] ?? '');
        $eps             = $this->sanitize($data['eps'] ?? '');
        $arl             = $this->sanitize($data['arl'] ?? '');
        $afp             = $this->sanitize($data['afp'] ?? '');
        $estado          = $this->sanitize($data['estado'] ?? 'Activo');
        $fechaRetiro     = $this->sanitize($data['fechaRetiro'] ?? '');
        $emergNombre     = $this->sanitize($data['emergNombre'] ?? '');
        $emergTelefono   = $this->sanitize($data['emergTelefono'] ?? '');
        $alergias        = $this->sanitize($data['alergias'] ?? '');

        if (!$idEmpresa || !$nombre || !$identificacion) return $_answers->error_400();

        $query = "INSERT INTO {$this->table} (
                    idEmpresa, fechaIngreso, fechaNacimiento, lugarNacimiento, identificacion,
                    sexo, nombre, estadoCivil, rh, escolaridad, telefono, salario, estrato,
                    personasCargo, cabezaFamilia, numeroHijos, grupoEtnico, cargo, horario,
                    eps, arl, afp, estado, fechaRetiro, emergNombre, emergTelefono, alergias
                  ) VALUES (
                    $idEmpresa, '$fechaIngreso', '$fechaNacimiento', '$lugarNacimiento', '$identificacion',
                    '$sexo', '$nombre', '$estadoCivil', '$rh', '$escolaridad', '$telefono', $salario, $estrato,
                    $personasCargo, '$cabezaFamilia', $numeroHijos, '$grupoEtnico', '$cargo', '$horario',
                    '$eps', '$arl', '$afp', '$estado', '$fechaRetiro', '$emergNombre', '$emergTelefono', '$alergias'
                  )";

        $idEntry = parent::nonQueryId($query);

        if ($idEntry) {
            $resp = $_answers->response;
            $resp['result'] = ['idEntry' => $idEntry];
            return $resp;
        }
        return $_answers->error_500("Error al guardar el empleado.");
    }

    public function put($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEntry   = intval($data['idEntry'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);
        
        if (!$idEntry || !$idEmpresa) return $_answers->error_400();

        $updates = [];
        if (isset($data['fechaIngreso']))    $updates[] = "fechaIngreso='" . $this->sanitize($data['fechaIngreso']) . "'";
        if (isset($data['fechaNacimiento'])) $updates[] = "fechaNacimiento='" . $this->sanitize($data['fechaNacimiento']) . "'";
        if (isset($data['lugarNacimiento'])) $updates[] = "lugarNacimiento='" . $this->sanitize($data['lugarNacimiento']) . "'";
        if (isset($data['identificacion']))  $updates[] = "identificacion='" . $this->sanitize($data['identificacion']) . "'";
        if (isset($data['sexo']))            $updates[] = "sexo='" . $this->sanitize($data['sexo']) . "'";
        if (isset($data['nombre']))          $updates[] = "nombre='" . $this->sanitize($data['nombre']) . "'";
        if (isset($data['estadoCivil']))     $updates[] = "estadoCivil='" . $this->sanitize($data['estadoCivil']) . "'";
        if (isset($data['rh']))              $updates[] = "rh='" . $this->sanitize($data['rh']) . "'";
        if (isset($data['escolaridad']))     $updates[] = "escolaridad='" . $this->sanitize($data['escolaridad']) . "'";
        if (isset($data['telefono']))        $updates[] = "telefono='" . $this->sanitize($data['telefono']) . "'";
        if (isset($data['salario']))         $updates[] = "salario=" . floatval($data['salario']);
        if (isset($data['estrato']))         $updates[] = "estrato=" . intval($data['estrato']);
        if (isset($data['personasCargo']))   $updates[] = "personasCargo=" . intval($data['personasCargo']);
        if (isset($data['cabezaFamilia']))   $updates[] = "cabezaFamilia='" . $this->sanitize($data['cabezaFamilia']) . "'";
        if (isset($data['numeroHijos']))     $updates[] = "numeroHijos=" . intval($data['numeroHijos']);
        if (isset($data['grupoEtnico']))     $updates[] = "grupoEtnico='" . $this->sanitize($data['grupoEtnico']) . "'";
        if (isset($data['cargo']))           $updates[] = "cargo='" . $this->sanitize($data['cargo']) . "'";
        if (isset($data['horario']))         $updates[] = "horario='" . $this->sanitize($data['horario']) . "'";
        if (isset($data['eps']))             $updates[] = "eps='" . $this->sanitize($data['eps']) . "'";
        if (isset($data['arl']))             $updates[] = "arl='" . $this->sanitize($data['arl']) . "'";
        if (isset($data['afp']))             $updates[] = "afp='" . $this->sanitize($data['afp']) . "'";
        if (isset($data['estado']))          $updates[] = "estado='" . $this->sanitize($data['estado']) . "'";
        if (isset($data['fechaRetiro']))     $updates[] = "fechaRetiro='" . $this->sanitize($data['fechaRetiro']) . "'";
        if (isset($data['emergNombre']))     $updates[] = "emergNombre='" . $this->sanitize($data['emergNombre']) . "'";
        if (isset($data['emergTelefono']))   $updates[] = "emergTelefono='" . $this->sanitize($data['emergTelefono']) . "'";
        if (isset($data['alergias']))        $updates[] = "alergias='" . $this->sanitize($data['alergias']) . "'";

        if ($updates) {
            parent::nonQuery("UPDATE {$this->table} SET " . implode(', ', $updates) . " WHERE idEntry=$idEntry AND idEmpresa=$idEmpresa");
        }

        $resp = $_answers->response;
        $resp['result'] = ['idEntry' => $idEntry];
        return $resp;
    }

    public function delete($data) {
        $_answers = new answers;
        if (!$this->verifyToken($data, $_answers)) return $_answers->response;

        $idEntry   = intval($data['idEntry'] ?? 0);
        $idEmpresa = intval($data['idEmpresa'] ?? 0);

        if (!$idEntry || !$idEmpresa) return $_answers->error_400();

        parent::nonQuery("DELETE FROM {$this->table} WHERE idEntry=$idEntry AND idEmpresa=$idEmpresa");

        $resp = $_answers->response;
        $resp['result'] = ['idEntry' => $idEntry];
        return $resp;
    }

    private function verifyToken($data, &$_answers) {
        $_token = new token;
        if (!isset($data['token'])) { $_answers->response = $_answers->error_401(); return false; }
        $this->token = $data['token'];
        if (!$_token->searchToken($this->token)) { $_answers->response = $_answers->error_401(); return false; }
        return true;
    }

    private function sanitize($v) {
        return addslashes(trim(strip_tags($v)));
    }
}
?>
