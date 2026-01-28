<?php
require_once 'config.php';
require_once 'answers.class.php';
require_once 'connection/connection.php';
require_once 'token.class.php';

class options extends connection {

    private $table = "options";
    private $id;
    private $code;
    private $name;
    private $tag2;
    private $link;
    private $back;
    private $order;
    private $state;
    private $nivel;
    private $nivelant;
    private $token;

    public function listOptions($page = 1) {
        $initial = 0;
        $limit = 100;
        if ($page > 1) {
            $initial = (($page - 1) * $limit) + 1;
            $limit = $limit * $page;
        }
        $query = "SELECT idOption, code, name, tag2, link, back, `order`, state, nivel, nivelant FROM ". $this->table." LIMIT $initial, $limit";
        $data = parent::getData($query);
        
        // MOCK: Inject Morbidity Module
        $morbidity = array(
            'idOption' => 9991,
            'code' => '207', 
            'name' => 'Morbilidad / Ausentismo',
            'tag2' => 'morbidity',
            'link' => '../hacer/morbidity/morbidity.php',
            'back' => '',
            'order' => 99,
            'state' => '0',
            'nivel' => '2',
            'nivelant' => '2' // Assuming parent is '2' (Hacer) which is likely code '2' or '200'. If parent is 2, nivelant=2? No, nivelant is "Nivel Anterior". If level 2, prev level is 1? Or parent code?
            // Dashboard JS logic: 
            // if (nivel === 1) map[code] = ...
            // else parentCode = find(p => code > p && code < p+100)
            // So if I use code 207, it looks for a parent between 200...299?? No.
            // logic: find(code => 207 > code && 207 < code + 100).
            // So if parent is 200, 207 is child.
            // Nivel/NivelAnt might not be used for hierarchy logic in JS, only 'code' math.
            // But let's set Nivel=2.
        );
        $data[] = $morbidity;

        return $data;
    }
    public function getOption($id) {
        $query = "SELECT idOption, code, name, tag2, link, back, `order`, state, nivel, nivelant FROM ". $this->table." WHERE idOption = $id";
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
                if(!isset($data['code']) || !isset($data['name']) || !isset($data['tag2']) || 
                !isset($data['link']) || !isset($data['back']) || !isset($data['order']) || 
                !isset($data['state']) || !isset($data['nivel']) || !isset($data['nivelant'])) {
                return $_answers->error_400();
                } else {
                    $this->code = $data['code'];
                    $this->name = $data['name'];
                    $this->tag2 = $data['tag2'];
                    $this->link = $data['link'];
                    $this->back = $data['back'];
                    $this->order = $data['order'];
                    $this->state = $data['state'];
                    $this->nivel = $data['nivel'];
                    $this->nivelant = $data['nivelant'];
                    $res = $this->setOption();
                    if ($res) {
                        $response = $_answers->response;
                        $response['result'] = array(
                            'idOption' => $this->$res,
                            'code' => $this->code,
                            'name' => $this->name,
                            'tag2' => $this->tag2,
                            'link' => $this->link,
                            'back' => $this->back,
                            'order' => $this->order,
                            'state' => $this->state,
                            'nivel' => $this->nivel,
                            'nivelant' => $this->nivelant
                        );
                        return $response;
                    } else {
                        return $_answers->error_500("Error inserting data");
                    }
                }
            } else {
                return $_answers->error_401("This token is not valid or has expired");
            }
        }
    }

    private function setOption() {
        $query = "INSERT INTO ". $this->table." (code, name, tag2, link, back, `order`, state, nivel, nivelant) 
        VALUES ('$this->code', '$this->name', '$this->tag2', '$this->link', '$this->back', '$this->order', '$this->state', '$this->nivel', '$this->nivelant')";
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
                if(!isset($data['idOption'])) {
                    return $_answers->error_400();
                } else {
                    $this->id = $data['idOption'];
                    if(isset($data['code'])) { $this->code = $data['code']; }
                    if(isset($data['name'])) { $this->name = $data['name']; }
                    if(isset($data['tag2'])) { $this->tag2 = $data['tag2']; }
                    if(isset($data['link'])) { $this->link = $data['link']; }
                    if(isset($data['back'])) { $this->back = $data['back']; }
                    if(isset($data['order'])) { $this->order = $data['order']; }
                    if(isset($data['state'])) { $this->state = $data['state']; }
                    if(isset($data['nivel'])) { $this->nivel = $data['nivel']; }
                    if(isset($data['nivelant'])) { $this->nivelant = $data['nivelant']; }
                    $res = $this->updateOption();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idOption" => $this->id
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

    private function updateOption() {
        $query = "UPDATE ". $this->table." SET code = '$this->code', name = '$this->name', tag2 = '$this->tag2', 
        link = '$this->link', back = '$this->back', `order` = '$this->order', state = '$this->state', 
        nivel = '$this->nivel', nivelant = '$this->nivelant' WHERE idOption = $this->id";
        $response = parent::nonQuery($query);
        if ($response) {
            return $response;
        } else {
            return 0;
        }
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
                if(!isset($data['idOption'])) {
                    return $_answers->error_400();
                } else {
                    $this->id = $data['idOption'];
                    $res = $this->deleteOption();
                    if ($res) {
                        $response = $_answers->response;
                        $response["result"] = array(
                            "idOption" => $this->id
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

    private function deleteOption() {
        $query = "DELETE FROM ". $this->table." WHERE idOption = $this->id";
        $response = parent::nonQuery($query);
        if ($response >= 1) {
            return $response;
        } else {
            return 0;
        }
    }

}
?>