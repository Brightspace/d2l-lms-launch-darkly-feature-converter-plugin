const assert = require( 'chai' ).assert;
const InstanceCatalog = require( 'd2l-lms-instance-catalog' ).InstanceCatalog;
const InstanceRulesMapper = require( '../src/instance/InstanceRulesMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const instanceCatalog = new InstanceCatalog(
	new Map( [
		[ 'instance_a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
		[ 'instance_c', 'cccccccc-cccc-cccc-cccc-cccccccccccc' ]
	] ),
	new Map()
);
const mapper = new InstanceRulesMapper( instanceCatalog );
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'InstanceRulesMapper', function() {

	it( 'should map data centers', function() {

		const definition = {
			dataCenters: [
				'us04',
				'ca05'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'datacenter',
					op: 'in',
					values: [
						'ca05',
						'us04'
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should map instance types', function() {

		const definition = {
			instanceTypes: [
				'test',
				'prod'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'instanceType',
					op: 'in',
					values: [
						'Prod',
						'Test'
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should map version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should map version end', function() {

		const definition = {
			versions: {
				end: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should map version start and end', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345',
				end: '10.8.5.99999'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080599999
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should map specific version', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345',
				end: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2
		} );
	} );

	it( 'should throw if start version is greater than end version', function() {

		const definition = {
			versions: {
				start: '10.8.5.0',
				end: '10.8.4.0'
			},
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Version start is greater than version end: 10.8.5.0 > 10.8.4.0$/
		);
	} );

	it( 'should map instance names for specific version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			instanceNames: [
				'instance_a',
				'instance_c'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'key',
					op: 'in',
					values: [
						'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
						'instance:cccccccc-cccc-cccc-cccc-cccccccccccc'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should throw if unknown instance name', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			instanceNames: [
				'instance_b'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Unknown instance name: instance_b$/
		);
	} );

	it( 'should throw if instance names duplicated', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			instanceNames: [
				'instance_a',
				'instance_a'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Instances are duplicated in rule: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa$/
		);
	} );

	it( 'should throw if instance names defined without versions', function() {

		const definition = {
			instanceNames: [
				'instance_a'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Instances can only be targetted in rules for specific versions$/
		);
	} );

} );