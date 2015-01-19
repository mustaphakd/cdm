<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 1/17/2015
 * Time: 3:18 PM
 */

/*
 *
 *
 * @property Country $Country
 * @property Province $Province
 */

App::uses('AppController', 'Controller');

class RegionsController  extends AppController{

    public $uses = array('Country', 'Province');
    public $components = array('RequestHandler' => array('checkHttpCache' => false));

    public function add_new_country(){
        //ni_set('memory_limit', '2048M');
        if($this->request->is('post'))
        {
            $this->Country->create();
            $this->Country->set($this->data);
            if($this->Country->save(array('validate' => false)))
            {
                $newId = $this->Country->id;
                //$this->Country->read(array('Country.name', 'Country.geometry'), $newId);
                $message = "Success";
                $this->set(array(
                    'message' => $message,
                    //'country' => $this->Country,
                    'id' => $newId,
                    '_serialize' => array('message', 'country', 'id')
                ));
            }
            else
            {
                $message = "Error";
                $this->set(array(
                    'message' => $message,
                    '_serialize' => array('message', 'country')
                ));
            }
        }
    }

    public function get_countries(){
        $countries = $this->Country->find('all', array('fields' => array('Country.id', 'Country.name', 'Country.geometry')));

        $this->set(array(
            'countries' => $countries,
            '_serialize' => array('countries')
        ));

    }

    public function get_country($id){

        $foundCountry = $this->Country->findById($id);

        $this->set(array(
            'country' => $foundCountry,
            '_serialize' => array('country')
        ));

    }

    public function get_provinces($id){
        //$foundCountry = $this->Country->findById($id);

        $provinces = $this->Province->find('all',
            array('conditions' => array('Province.country_id' => $id)
            ));

        $this->set(array(
            'provinces' => $provinces,
            '_serialize' => array('provinces')
        ));
    }

    public function add_new_province($id){

        if($this->request->is('post'))
        {
            $foundCountry = $this->Country->findById($id);

            if(!empty($foundCountry))
            {
                $this->Province->create();
                $this->Province->set($this->data);
                $this->Province->set('country_id', $foundCountry["Country"]["id"]);
                $this->Province->save();

                $this->set(array(
                    'message' => 'success',
                    'id' => $this->Province->id,
                    '_serialize' => array('message', 'id')
                ));

                return;

            }

        }

        $this->set(array(
                'message' => "Error",
                '_serialize' => array('message')
            ));


    }

    public function get_all_provinces(){

        $provinces = $this->Province->find('all');

        $this->set(array(
            "message" => "success",
            'provinces' => $provinces,
            '_serialize' => array("message",'provinces')
        ));

    }

} 