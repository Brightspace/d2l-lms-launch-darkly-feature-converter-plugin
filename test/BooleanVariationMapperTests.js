const assert = require( 'chai' ).assert;
const BooleanVariationMapper = require( '../src/variations/BooleanVariationMapper.js' );

const mapper = new BooleanVariationMapper();

describe( 'BooleanVariationMapper', function() {
	describe( 'mapVariations', function() {
		it( 'should map true & false', function() {

			const result = mapper.mapVariations( {
				false: {
					name: 'Disabled',
					description: 'Disables the feature'
				},
				true: {
					name: 'Enabled',
					description: 'Enables the feature'
				}
			} );

			assert.equal(
				result.indexes.getIndex( 'true' ),
				0,
				'true should map to index 0'
			);

			assert.equal(
				result.indexes.getIndex( 'false' ),
				1,
				'false should map to index 1'
			);

			assert.deepEqual( result.variations, [
				{
					name: 'Enabled',
					description: 'Enables the feature',
					value: true
				},
				{
					name: 'Disabled',
					description: 'Disables the feature',
					value: false
				}
			] );
		} );
	} );
} );