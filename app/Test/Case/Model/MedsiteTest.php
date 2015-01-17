<?php
App::uses('Medsite', 'Model');

/**
 * Medsite Test Case
 *
 */
class MedsiteTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.medsite',
		'app.province',
		'app.country',
		'app.dcase',
		'app.casesstatus',
		'app.disease',
		'app.note',
		'app.hotline'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Medsite = ClassRegistry::init('Medsite');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Medsite);

		parent::tearDown();
	}

}
