<?php
App::uses('Casestatus', 'Model');

/**
 * Casestatus Test Case
 *
 */
class CasestatusTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.casestatus',
		'app.dcase'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Casestatus = ClassRegistry::init('Casestatus');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Casestatus);

		parent::tearDown();
	}

}
