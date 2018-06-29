const _ = require( 'lodash' );
const VariationIndexMap = require( './VariationIndexMap.js' );

module.exports = class MultiVariationMapper {

	mapVariations( definition ) {

		let valueType;
		const indexes = {};
		const variations = [];

		let index = 0;

		_.forIn( definition, ( variation, key ) => {
			indexes[key] = index;

			if( _.isUndefined( valueType ) ) {
				valueType = typeof( variation.value );

			} else if( valueType !== typeof( variation.value ) ) {
				throw new Error( 'Variation values must all be of the same type' );
			}

			const mappedVariation = _.pick( variation, [
				'name',
				'description',
				'value'
			] );

			variations.push( mappedVariation );
			index++;
		} );

		return {
			indexes: new VariationIndexMap( indexes ),
			variations
		};
	}
};
