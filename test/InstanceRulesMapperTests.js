const assert = require( 'chai' ).assert;
const InstanceRulesMapper = require( '../src/instance/InstanceRulesMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const mapper = new InstanceRulesMapper();
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

} );