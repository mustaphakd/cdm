<?php
App::uses('Hotline', 'Model');

/**
 * Hotline Test Case
 *
 */
class HotlineTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.hotline',
		'app.province',
		'app.country',
		'app.dcase',
		'app.casesstatus',
		'app.disease',
		'app.note',
		'app.medsite'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Hotline = ClassRegistry::init('Hotline');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Hotline);

		parent::tearDown();
	}

}
