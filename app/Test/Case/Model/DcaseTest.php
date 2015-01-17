<?php
App::uses('Dcase', 'Model');

/**
 * Dcase Test Case
 *
 */
class DcaseTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.dcase',
		'app.casesstatus',
		'app.province',
		'app.country',
		'app.hotline',
		'app.medsite',
		'app.disease',
		'app.note'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Dcase = ClassRegistry::init('Dcase');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Dcase);

		parent::tearDown();
	}

}
