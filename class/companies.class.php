<?php

require_once 'config.php';
require_once '../class/answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';


class companies extends connection {

    private $table = "companies";
    private $idEmpresa;
    private $tipIdentEmp;
    private $nroIdentEmp;
    private $nomEmpresa;
    private $tipRegimenEmp;
    private $tipIdent;
    private $nroIdent;
    private $apel1;
    private $apel2;
    private $nombre1;
    private $nombre2;
    private $gerente;
    private $profesional;
    private $representante;
    private $fecVincula;
    private $codDepto;
    private $codCiudad;
    private $direccion;
    private $sigla;
    private $telFijo;
    private $email;
    private $fecFin;
    private $estado;
    private $naturaleza;
    private $ruta;
    private $fechaEntrega;
    private $rutaEval;
    private $token;

    public function listCompanies($page = 1) {
        $initial = 0;
        $limit = 100;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit = $limit * $page;
        }
        $query = "SELECT * FROM ". $this->table." LIMIT $initial, $limit";
        $data = parent::getData($query);
        return $data;
    }

    public function getCompany($id) {
        $query = "SELECT * FROM ". $this->table." WHERE idEmpresa = $id";
        $data = parent::getData($query);
        return $data;
    }

    public function post($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                $required = [
                    'tipIdentEmp','nroIdentEmp','nomEmpresa','tipIdent','nroIdent',
                    '1apel','2apel','1nombre','2nombre','gerente','profesional',
                    'fecVincula','codDepto','codCiudad','direccion','sigla','telFijo','fecFin',
                    'estado','naturaleza'
                ];
                foreach($required as $field) {
                    if(!isset($data[$field])) {
                        return $_answers->error_400();
                    }
                }
                $this->tipIdentEmp = $data['tipIdentEmp'];
                $this->nroIdentEmp = $data['nroIdentEmp'];
                $this->nomEmpresa = $data['nomEmpresa'];
                $this->tipRegimenEmp = $data['tipRegimenEmp'];
                $this->tipIdent = $data['tipIdent'];
                $this->nroIdent = $data['nroIdent'];
                $this->apel1 = $data['1apel'];
                $this->apel2 = $data['2apel'];
                $this->nombre1 = $data['1nombre'];
                $this->nombre2 = $data['2nombre'];
                $this->gerente = $data['gerente'];
                $this->profesional = $data['profesional'];
                $this->representante = $data['representante'];
                $this->fecVincula = $data['fecVincula'];
                $this->codDepto = $data['codDepto'];
                $this->codCiudad = $data['codCiudad'];
                $this->direccion = $data['direccion'];
                $this->sigla = $data['sigla'];
                $this->telFijo = $data['telFijo'];
                $this->email = isset($data['email']) ? $data['email'] : null;
                $this->fecFin = $data['fecFin'];
                $this->estado = $data['estado'];
                $this->naturaleza = $data['naturaleza'];
                $this->ruta = isset($data['ruta']) ? $data['ruta'] : null;
                $this->fechaEntrega = isset($data['fechaEntrega']) ? $data['fechaEntrega'] : null;
                $this->rutaEval = isset($data['rutaEval']) ? $data['rutaEval'] : null;
                $res = $this->setCompany();
                if ($res) {
                    $logoPath = $this->processLogo($res);
                    if ($logoPath) {
                        $this->idEmpresa = $res;
                        $this->ruta = $logoPath;
                        $this->updateRuta();
                    }
                    $evalPath = $this->processEvaluacion($res);
                    if ($evalPath) {
                        $this->idEmpresa = $res;
                        $this->rutaEval = $evalPath;
                        $this->updateRutaEval();
                    }
                    $response = $_answers->response;
                    $response['result'] = array(
                        'idEmpresa'  => $res,
                        'nomEmpresa' => $this->nomEmpresa,
                        'ruta'       => $logoPath ?? null,
                        'rutaEval'   => $evalPath ?? null
                    );
                    return $response;
                } else {
                    return $_answers->error_500("Error inserting data");
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function processLogo($idEmpresa) {
        if (isset($_FILES['logoFile']) && $_FILES['logoFile']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['logoFile'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename = "logo_" . time() . "." . $extension;
            
            $rootPath = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/logo/";
            $fullPath = $rootPath . $targetDir;
            
            if (!is_dir($fullPath)) {
                mkdir($fullPath, 0777, true);
            }
            
            if (move_uploaded_file($file['tmp_name'], $fullPath . $filename)) {
                return $targetDir . $filename;
            }
        }
        return null;
    }

    private function updateRuta() {
        $query = "UPDATE " . $this->table . " SET ruta = '$this->ruta' WHERE idEmpresa = $this->idEmpresa";
        return parent::nonQuery($query);
    }

    private function processEvaluacion($idEmpresa) {
        if (isset($_FILES['evaluacionFile']) && $_FILES['evaluacionFile']['error'] === UPLOAD_ERR_OK) {
            $file      = $_FILES['evaluacionFile'];
            $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
            $filename  = "eval_" . time() . "." . strtolower($extension);

            $rootPath  = dirname(__DIR__) . "/";
            $targetDir = "dataClients/" . $idEmpresa . "/evaluacion_inicial/";
            $fullPath  = $rootPath . $targetDir;

            if (!is_dir($fullPath)) {
                mkdir($fullPath, 0777, true);
            }

            if (move_uploaded_file($file['tmp_name'], $fullPath . $filename)) {
                return $targetDir . $filename;
            }
        }
        return null;
    }

    private function updateRutaEval() {
        $query = "UPDATE " . $this->table . " SET rutaEval = '$this->rutaEval' WHERE idEmpresa = $this->idEmpresa";
        return parent::nonQuery($query);
    }

    private function setCompany() {
        $query = "INSERT INTO ". $this->table." (
            tipIdentEmp, nroIdentEmp, nomEmpresa, tipRegimenEmp, tipIdent, nroIdent,
            `1apel`, `2apel`, `1nombre`, `2nombre`, gerente, profesional, representante,
            fecVincula, codDepto, codCiudad, direccion, sigla, telFijo, email, fecFin,
            estado, naturaleza, ruta, fechaEntrega, rutaEval
        ) VALUES (
            '$this->tipIdentEmp', '$this->nroIdentEmp', '$this->nomEmpresa', '$this->tipRegimenEmp', '$this->tipIdent', '$this->nroIdent',
            '$this->apel1', '$this->apel2', '$this->nombre1', '$this->nombre2', '$this->gerente', '$this->profesional', '$this->representante',
            '$this->fecVincula', '$this->codDepto', '$this->codCiudad', '$this->direccion', '$this->sigla', '$this->telFijo', " . 
            ($this->email ? "'$this->email'" : "NULL") . ", '$this->fecFin', '$this->estado', '$this->naturaleza', " . 
            ($this->ruta ? "'$this->ruta'" : "NULL") . ", " . ($this->fechaEntrega ? "'$this->fechaEntrega'" : "NULL") . ", " .
            ($this->rutaEval ? "'$this->rutaEval'" : "NULL") . "
        )";
        $response = parent::nonQueryId($query);
        if ($response) {
            return $response;
        } else {
            return 0;
        }
    }

    public function put($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                if(!isset($data['idEmpresa'])) {
                    return $_answers->error_400();
                } else {
                    $this->idEmpresa = $data['idEmpresa'];
                    if(isset($data['tipIdentEmp'])) { $this->tipIdentEmp = $data['tipIdentEmp']; }
                    if(isset($data['nroIdentEmp'])) { $this->nroIdentEmp = $data['nroIdentEmp']; }
                    if(isset($data['nomEmpresa'])) { $this->nomEmpresa = $data['nomEmpresa']; }
                    if(isset($data['tipRegimenEmp'])) { $this->tipRegimenEmp = $data['tipRegimenEmp']; }
                    if(isset($data['tipIdent'])) { $this->tipIdent = $data['tipIdent']; }
                    if(isset($data['nroIdent'])) { $this->nroIdent = $data['nroIdent']; }
                    if(isset($data['1apel'])) { $this->apel1 = $data['1apel']; }
                    if(isset($data['2apel'])) { $this->apel2 = $data['2apel']; }
                    if(isset($data['1nombre'])) { $this->nombre1 = $data['1nombre']; }
                    if(isset($data['2nombre'])) { $this->nombre2 = $data['2nombre']; }
                    if(isset($data['gerente'])) { $this->gerente = $data['gerente']; }
                    if(isset($data['profesional'])) { $this->profesional = $data['profesional']; }
                    if(isset($data['representante'])) { $this->representante = $data['representante']; }
                    if(isset($data['fecVincula'])) { $this->fecVincula = $data['fecVincula']; }
                    if(isset($data['codDepto'])) { $this->codDepto = $data['codDepto']; }
                    if(isset($data['codCiudad'])) { $this->codCiudad = $data['codCiudad']; }
                    if(isset($data['direccion'])) { $this->direccion = $data['direccion']; }
                    if(isset($data['sigla'])) { $this->sigla = $data['sigla']; }
                    if(isset($data['telFijo'])) { $this->telFijo = $data['telFijo']; }
                    if(array_key_exists('email', $data)) { $this->email = $data['email']; }
                    if(isset($data['fecFin'])) { $this->fecFin = $data['fecFin']; }
                    if(isset($data['estado'])) { $this->estado = $data['estado']; }
                    if(isset($data['naturaleza'])) { $this->naturaleza = $data['naturaleza']; }
                    if(array_key_exists('ruta', $data)) { $this->ruta = $data['ruta']; }
                    if(array_key_exists('fechaEntrega', $data)) { $this->fechaEntrega = $data['fechaEntrega']; }
                    if(array_key_exists('rutaEval', $data)) { $this->rutaEval = $data['rutaEval']; }

                    $logoPath = $this->processLogo($this->idEmpresa);
                    if ($logoPath) {
                        $this->ruta = $logoPath;
                    }

                    $evalPath = $this->processEvaluacion($this->idEmpresa);
                    if ($evalPath) {
                        $this->rutaEval = $evalPath;
                    }

                    $res = $this->updateCompany();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idEmpresa" => $this->idEmpresa
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error updating data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function updateCompany() {
        // Preservar ruta (logo) existente si no se subió nueva imagen
        if (is_null($this->ruta)) {
            $query_ruta = "SELECT ruta, rutaEval FROM " . $this->table . " WHERE idEmpresa = $this->idEmpresa";
            $res_ruta = parent::getData($query_ruta);
            if (isset($res_ruta[0]['ruta'])) {
                $this->ruta = $res_ruta[0]['ruta'];
            }
            // Preservar rutaEval existente si no se subió archivo nuevo
            if (is_null($this->rutaEval) && isset($res_ruta[0]['rutaEval'])) {
                $this->rutaEval = $res_ruta[0]['rutaEval'];
            }
        } else {
            // Si sí hay logo nuevo pero no archivo eval, preservar eval existente
            if (is_null($this->rutaEval)) {
                $q = "SELECT rutaEval FROM " . $this->table . " WHERE idEmpresa = $this->idEmpresa";
                $r = parent::getData($q);
                if (isset($r[0]['rutaEval'])) {
                    $this->rutaEval = $r[0]['rutaEval'];
                }
            }
        }

        $query = "UPDATE ". $this->table." SET 
            tipIdentEmp = '$this->tipIdentEmp',
            nroIdentEmp = '$this->nroIdentEmp',
            nomEmpresa = '$this->nomEmpresa',
            tipRegimenEmp = '$this->tipRegimenEmp',
            tipIdent = '$this->tipIdent',
            nroIdent = '$this->nroIdent',
            `1apel` = '$this->apel1',
            `2apel` = '$this->apel2',
            `1nombre` = '$this->nombre1',
            `2nombre` = '$this->nombre2',
            gerente = '$this->gerente',
            profesional = '$this->profesional',
            representante = '$this->representante',
            fecVincula = '$this->fecVincula',
            codDepto = '$this->codDepto',
            codCiudad = '$this->codCiudad',
            direccion = '$this->direccion',
            sigla = '$this->sigla',
            telFijo = '$this->telFijo',
            email = " . ($this->email ? "'$this->email'" : "NULL") . ",
            fecFin = '$this->fecFin',
            estado = '$this->estado',
            naturaleza = '$this->naturaleza',
            ruta = " . ($this->ruta ? "'$this->ruta'" : "NULL") . ",
            fechaEntrega = " . ($this->fechaEntrega ? "'$this->fechaEntrega'" : "NULL") . ",
            rutaEval = " . ($this->rutaEval ? "'$this->rutaEval'" : "NULL") . "
            WHERE idEmpresa = $this->idEmpresa";
        // nonQuery devuelve affected_rows: -1=error SQL, 0=sin cambios (OK), >0=filas modificadas
        $response = parent::nonQuery($query);
        if ($response < 0) {
            error_log("[companies.class] updateCompany FAILED. Query: " . $query);
        }
        return ($response >= 0); // -1 significa error real de SQL
    }

    public function delete($json) {
        $_answers = new answers;
        $_token = new token;
        $data = json_decode($json, true);
        if(!isset($data['token'])) {
            return $_answers->error_401();
        } else {
            $this->token = $data['token'];
            $arrayToken = $_token->searchToken($this->token);
            if($arrayToken) {
                if(!isset($data['idEmpresa'])) {
                    return $_answers->error_400();
                } else {
                    $this->idEmpresa = $data['idEmpresa'];
                    $res = $this->deleteCompany();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idEmpresa" => $this->idEmpresa
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error deleting data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function deleteCompany() {
        $query = "DELETE FROM ". $this->table." WHERE idEmpresa = $this->idEmpresa";
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }
}
?>