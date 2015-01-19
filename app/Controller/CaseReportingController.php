<?php
/**
 * Created by PhpStorm.
 * User: Mustapha
 * Date: 1/17/2015
 * Time: 3:47 PM
 */

/*
 *
 *
 * @property Disease $Disease
 * @property Dcase $Dcase
 * @property Note $Note
 * @property Casestatus $Casestatus
 */

App::uses('AppController', 'Controller');

class CaseReportingController  extends AppController {

    public $uses = array('Disease', 'Dcase', 'Note', 'Casestatus');
    public $components = array('RequestHandler' => array('checkHttpCache' => false));


    public  function get_disease_types(){

        $foundDiseases = $this->Disease->find('all');

        $this->set(array(
            "message" => "success",
            'diseases' => $foundDiseases,
            '_serialize' => array('message', 'diseases')
        ));
        

    }

    public  function report_suspicious_case(){

        if($this->request->is('post'))
        {
            if(!empty($this->data))
            {
                $this->Dcase->create();
                $this->Dcase->set($this->data);

                if(!isset($this->Dcase->data['casesstatus_id']))
                {
                    $pendingstatus = $this->Casestatus->find('first', array(
                        'conditions' => array("Casestatus.label" => "Pending")
                    ));

                    if(!empty($pendingstatus))
                    {
                        $this->Dcase->set("casesstatus_id", $pendingstatus["Casestatus"]["id"]);
                    }

                }

                if(null != ($this->Dcase->get("initiallydetected")))
                {
                    $date = new DateTime($this->Dcase->get("initiallydetected"));
                    $this->Dcase->set("initiallydetected",$date->format('Y-m-d H:i:s') );
                }


                    $date = new DateTime();
                    $this->Dcase->set("initiallyreported",$date->format('Y-m-d H:i:s'));


                if(null != ($this->Dcase->get("dateconfirmed")))
                {
                    $date = new DateTime($this->Dcase->get("dateconfirmed"));
                    $this->Dcase->set("dateconfirmed",$date->format('Y-m-d H:i:s'));
                }

                $this->Dcase->save();

                $this->set(array(
                    'message' => 'success',
                    "id" => $this->Dcase->id,
                    '_serialize' => array('message', "id")
                ));
                return;
            }
        }

        $this->set(array(
            'message' => 'error',
            '_serialize' => array('message')
        ));
    }

    public function load_case_status(){
        $foundDCases = $this->Casestatus->find('all');

        $this->set(array(
            "message" => "success",
            'casestatuses' => $foundDCases,
            '_serialize' => array('message', 'casestatuses')
        ));
    }

    public function load_cases(){

        $foundCases = $this->Dcase->find('all');

        $this->set(array(
            "message" => "success",
            "cases" => $foundCases,
            "_serialize" => array("message", "cases")
        ));

    }

    // $id is for caseid
    public function load_notes($id){

        $foundCase = $this->Dcase->findById($id);

        if(!empty($foundCase))
        {
            $foundNotes = $this->Note->find('all', array(
                'conditions' => array("Note.dcase_id" => $id )
            ));

            $this->set(array(
                'message' => 'success',
                'notes' => $foundNotes,
                '_serialize' => array('message', "notes")
            ));
            return;
        }

        $this->set(array(
            "message" => "error",
            "_serialize" => array("message")
        ));
    }

    public function save_note($id){
        if($this->request->is("post"))
        {
            $foundCase = $this->Dcase->find("first", array(
                "conditions" => array("Dcase.id" => $id)
            ));

            if(!empty($foundCase))
            {
                $this->Note->create();
                $this->Note->set($this->data);

                if(null != ($this->Note->get("quand")))
                {
                    $date = new DateTime($this->Note->get("quand"));
                    $this->Note->set("quand",$date->format('Y-m-d H:i:s') );
                }

                $this->Note->save();

                $this->set(array(
                    "message" => "success",
                    "id" => $this->Note->id,
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

    public function update_case_status($id){

        /*
         *           Remove only Single Rule of a field
         *         $this->UserWayToCode->validator()->remove('pancard', 'rule1');
         *          Completely remove all validation rules of  a field
         *         $this->UserWayToCode->validator()->remove('pancard');
         * */

        if($this->request->is('post'))
        {
            $this->Dcase->read(array("description", "casesstatus_id"), $id);
            $this->Dcase->set($this->data);
            unset($this->Dcase->validate["id"]);
            $this->Dcase->save();

            $this->set(array(
                'message' => 'success',
                '_serialize' => array('message')
            ));

            return;
        }

        $this->set(array(
            'message' => 'error',
            '_serialize' => array('message')
        ));
    }

} 