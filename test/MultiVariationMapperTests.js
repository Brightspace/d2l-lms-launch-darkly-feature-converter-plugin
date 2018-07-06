const assert = require( 'chai' ).assert;
const MultiVariationMapper = require( '../src/variations/MultiVariationMapper.js' );

const mapper = new MultiVariationMapper();

describe( 'MultiVariationMapper', function() {
	describe( 'mapVariations', function() {

		it( 'should map variations', function() {

			const result = mapper.mapVariations( {
				red: {
					name: 'Red',
					description: 'Things are on fire',
					value: 0
				},
				green: {
					name: 'Green',
					description: 'Things are all ok',
					value: 1
				},
				blue: {
					name: 'Blue',
					description: 'Things are unknown',
					value: 2
				}
			} );

			assert.equal(
				result.indexes.getIndex( 'red' ),
				0,
				'red should map to index 0'
			);

			assert.equal(
				result.indexes.getIndex( 'green' ),
				1,
				'green should map to index 1'
			);

			assert.equal(
				result.indexes.getIndex( 'blue' ),
				2,
				'blue should map to index 2'
			);

			assert.deepEqual( result.variations, [
				{
					name: 'Red',
					description: 'Things are on fire',
					value: 0
				},
				{
					name: 'Green',
					description: 'Things are all ok',
					value: 1
				},
				{
					name: 'Blue',
					description: 'Things are unknown',
					value: 2
				}
			] );
		} );

		it( 'should throw if value types mismatch', function() {

			assert.throws(
				() => {
					mapper.mapVariations( {
						off: {
							name: 'Off',
							description: 'The switch is off',
							value: false
						},
						on: {
							name: 'On',
							description: 'The switch is on',
							value: 'on'
						}
					} );
				},
				/Variation values must all be of the same type/
			);

		} );

		it( 'should map just values', function() {

			const result = mapper.mapVariations( {
				red: {
					value: 0
				},
				green: {
					value: 1
				},
				blue: {
					value: 2
				}
			} );

			assert.equal(
				result.indexes.getIndex( 'red' ),
				0,
				'red should map to index 0'
			);

			assert.equal(
				result.indexes.getIndex( 'green' ),
				1,
				'green should map to index 1'
			);

			assert.equal(
				result.indexes.getIndex( 'blue' ),
				2,
				'blue should map to index 2'
			);

			assert.deepEqual( result.variations, [
				{
					value: 0
				},
				{
					value: 1
				},
				{
					value: 2
				}
			] );
		} );

	} );
} );