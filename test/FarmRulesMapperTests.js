const assert = require( 'chai' ).assert;
const FarmRulesMapper = require( '../src/farm/FarmRulesMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const mapper = new FarmRulesMapper();
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'FarmRulesMapper', function() {

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
					attribute: 'bundleVersion',
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
					attribute: 'bundleVersion',
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
} );