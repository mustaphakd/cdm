<?php
/**
 * DcaseFixture
 *
 */
class DcaseFixture extends CakeTestFixture {

/**
 * Fields
 *
 * @var array
 */
	public $fields = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => null, 'unsigned' => false, 'key' => 'primary'),
		'description' => array('type' => 'text', 'null' => false, 'default' => null, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'casesstatus_id' => array('type' => 'integer', 'null' => false, 'default' => null, 'unsigned' => false),
		'province_id' => array('type' => 'integer', 'null' => false, 'default' => null, 'unsigned' => false),
		'country_id' => array('type' => 'integer', 'null' => false, 'default' => null, 'unsigned' => false),
		'dateconfirmed' => array('type' => 'datetime', 'null' => false, 'default' => null),
		'initiallydetected' => array('type' => 'datetime', 'null' => false, 'default' => null),
		'initiallyreported' => array('type' => 'datetime', 'null' => false, 'default' => null),
		'locationlat' => array('type' => 'string', 'null' => false, 'default' => null, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'locationlong' => array('type' => 'string', 'null' => false, 'default' => null, 'collate' => 'utf8_general_ci', 'charset' => 'utf8'),
		'disease_id' => array('type' => 'integer', 'null' => true, 'default' => null, 'unsigned' => false),
		'indexes' => array(
			'PRIMARY' => array('column' => 'id', 'unique' => 1),
			'unique_id' => array('column' => 'id', 'unique' => 1)
		),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);

/**
 * Records
 *
 * @var array
 */
	public $records = array(
		array(
			'id' => 1,
			'description' => 'Lorem ipsum dolor sit amet, aliquet feugiat. Convallis morbi fringilla gravida, phasellus feugiat dapibus velit nunc, pulvinar eget sollicitudin venenatis cum nullam, vivamus ut a sed, mollitia lectus. Nulla vestibulum massa neque ut et, id hendrerit sit, feugiat in taciti enim proin nibh, tempor dignissim, rhoncus duis vestibulum nunc mattis convallis.',
			'casesstatus_id' => 1,
			'province_id' => 1,
			'country_id' => 1,
			'dateconfirmed' => '2015-01-17 12:26:11',
			'initiallydetected' => '2015-01-17 12:26:11',
			'initiallyreported' => '2015-01-17 12:26:11',
			'locationlat' => 'Lorem ipsum dolor sit amet',
			'locationlong' => 'Lorem ipsum dolor sit amet',
			'disease_id' => 1
		),
	);

}
