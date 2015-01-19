<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 1/17/2015
 * Time: 4:00 PM
 */

/*
 *
 *
 * @property Country $Country
 * @property Province $Province
 * @property Hotline $Hotline
 */

App::uses('AppController', 'Controller');

class HotlinesController extends AppController {
    public $uses = array('Country', 'Province', 'Hotline');
    public $components = array('RequestHandler' => array('checkHttpCache' => false));

    public function index(){
        $foundinfos = $this->Hotline->find('all');

        $this->set(array(
            "message" => "success",
            "hotlines" => $foundinfos,
            "_serialize" => array("message", "hotlines")
        ));
    }

    public function add(){
        if($this->request->is("post"))
        {
            $foundCountry = $this->Country->findById($this->data["country_id"]);
            $foundProvince = $this->Province->findById($this->data["province_id"]);

            if(!empty($foundCountry) && !empty($foundProvince))
            {
                $this->Hotline->create();
                $this->Hotline->set($this->data);
                $this->Hotline->save();

                $this->set(array(
                    "message" => "success",
                    "id" => $this->Hotline->id,
                    "_serialize" => array("message", "id")
                ));

                return;
            }
        }
        $this->set(array(
            "message" => "error",
            "_serialize" => array("message")
        ));
    }

} 