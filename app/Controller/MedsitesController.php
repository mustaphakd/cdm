<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 1/17/2015
 * Time: 3:54 PM
 */
/*
 *
 *
 * @property Country $Country
 * @property Province $Province
 * * @property Medsite $Medsite
 */

App::uses('AppController', 'Controller');

class MedsitesController extends AppController {

    public $uses = array('Country', 'Province', 'Medsite');
    public $components = array('RequestHandler' => array('checkHttpCache' => false));

    public function index(){

        $foundMedSites = $this->Medsite->find('all');

        $this->set(array(
            "message" => "success",
            "medsites" => $foundMedSites,
            "_serialize" => array("message", "medsites")
        ));

    }

    public function add(){

        if($this->request->is("post"))
        {
            $foundCountry = $this->Country->findById($this->data["country_id"]);
            $foundProvince = $this->Province->findById($this->data["province_id"]);

            if(!empty($foundCountry) && !empty($foundProvince))
            {
                $this->Medsite->create();
                $this->Medsite->set($this->data);
                $this->Medsite->save();

                $this->set(array(
                    "message" => "success",
                    "_serialize" => array("message")
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