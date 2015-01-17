<?php
App::uses('Country', 'Model');

/**
 * Country Test Case
 *
 */
class CountryTest extends CakeTestCase {

/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array(
		'app.country',
		'app.dcase',
		'app.hotline',
		'app.medsite',
		'app.province'
	);

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();
		$this->Country = ClassRegistry::init('Country');
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Country);

		parent::tearDown();
	}

}
