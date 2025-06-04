<?php

class answers
{

    public $response = [
        "status" => "ok",
        "result" => array()
    ];

    public function error_405()
    {
        $this->response["status"] = "error";
        $this->response["result"] = array(
            "error_id" => "405",
            "error_message" => "Method Not Allowed"
        );
        return $this->response;
    }

    public function error_200($valor = "Incorrect data")
    {
        $this->response["status"] = "error";
        $this->response["result"] = array(
            "error_id" => "200",
            "error_message" => $valor
        );
        return $this->response;
    }

    public function error_400()
    {
        $this->response["status"] = "error";
        $this->response["result"] = array(
            "error_id" => "400",
            "error_message" => "Incomplete or incorrectly formatted data sent"
        );
        return $this->response;
    }

    public function error_500($valor = "Interna server error")
    {
        $this->response["status"] = "error";
        $this->response["result"] = array(
            "error_id" => "500",
            "error_message" => $valor
        );
        return $this->response;
    }

    public function error_401($valor = "Token is not valid")
    {
        $this->response["status"] = "error";
        $this->response["result"] = array(
            "error_id" => "401",
            "error_message" => $valor
        );
        return $this->response;
    }
}
