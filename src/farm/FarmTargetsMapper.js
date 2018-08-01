const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;

module.exports = class InstanceTargetsMapper {

	mapTarget( definition, variationIndexMap ) {

		const variation = variationIndexMap.getIndex( definition.variation );

		const mixedExplicitFarmIds = _.map(
			definition.farms || [],
			farm => {

				if( _.isString( farm ) ) {
					return farm;
				}

				return farm.farmId;
			}
		);

		const allFarmIds = mixedExplicitFarmIds;

		const uniqueFarmIds = _.orderBy(
			_.uniq( allFarmIds )
		);

		if( allFarmIds.length !== uniqueFarmIds.length ) {

			const duplicates = _.orderBy(
				duplicatesDeep( [
					mixedExplicitFarmIds
				] )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Farms are duplicated: ${duplicatesStr}` );
		}

		const values = _.map(
			uniqueFarmIds,
			farmId => `farm:${ farmId }`
		);

		return {
			values,
			variation
		};
	}
};
