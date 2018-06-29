const _ = require( 'lodash' );

module.exports = class InstanceTargetsMapper {

	constructor( instanceCatalog ) {
		this._instanceCatalog = instanceCatalog;
	}

	mapTarget( definition, variationIndexMap ) {

		const variation = variationIndexMap.getIndex( definition.variation );

		const implicitInstanceIds = _.map(
			definition.instanceNames || [],
			instanceName => this._instanceCatalog.mapInstanceName( instanceName )
		);

		const explicitInstanceIds = definition.instanceIds || [];

		const allInstanceIds = _.concat( implicitInstanceIds, explicitInstanceIds );

		const uniqueInstanceIds = _.orderBy(
			_.uniq( allInstanceIds )
		);

		if( allInstanceIds.length !== uniqueInstanceIds.length ) {

			const duplicates = _.orderBy(
				_.intersection( implicitInstanceIds, explicitInstanceIds )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Instances are duplicated: ${duplicatesStr}` );
		}

		const values = _.map(
			uniqueInstanceIds,
			instanceId => `instance:${ instanceId }`
		)

		return {
			values,
			variation
		};
	}
};
