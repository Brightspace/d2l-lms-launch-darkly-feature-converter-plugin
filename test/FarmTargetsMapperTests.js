const assert = require( 'chai' ).assert;
const FarmTargetsMapper = require( '../src/farm/FarmTargetsMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const mapper = new FarmTargetsMapper();
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'FarmTargetsMapper', function() {

	it( 'should map farms (strings)', function() {

		const definition = {
			farms: [
				'bbbbbbbb',
				'aaaaaaaa'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'farm:aaaaaaaa',
				'farm:bbbbbbbb'
			],
			variation: 2
		} );
	} );

	it( 'should map farms (objects)', function() {

		const definition = {
			farms: [
				{
					farmId: 'bbbbbbbb',
					comments: 'bbb'
				},
				{
					farmId: 'aaaaaaaa',
					comments: 'aaa'
				}
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'farm:aaaaaaaa',
				'farm:bbbbbbbb'
			],
			variation: 2
		} );
	} );

	it( 'should map farms (mixed)', function() {

		const definition = {
			farms: [
				{
					farmId: 'bbbbbbbb',
					comments: 'bbb'
				},
				'aaaaaaaa'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'farm:aaaaaaaa',
				'farm:bbbbbbbb'
			],
			variation: 2
		} );
	} );

	it( 'should throw if farm ids are duplicated', function() {

		const definition = {
			farms: [
				{
					farmId: 'aaaaaaaa',
					comments: 'cows'
				},
				{
					farmId: 'aaaaaaaa',
					comments: 'horses'
				},
				{
					farmId: 'cccccccc',
					comments: 'horses'
				},
				'cccccccc'
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Farms are duplicated: aaaaaaaa, cccccccc/
		);
	} );
} );