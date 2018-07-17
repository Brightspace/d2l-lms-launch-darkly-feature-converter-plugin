const _ = require( 'lodash' );

module.exports = class OrgTargetsMapper {

	constructor( instanceCatalog ) {
		this._instanceCatalog = instanceCatalog;
	}

	mapTarget( definition, variationIndexMap ) {

		const variation = variationIndexMap.getIndex( definition.variation );

		const implicitTenantIds = _.map(
			definition.tenantDomains || [],
			tenantDomain => this._instanceCatalog.mapTenantDomain( tenantDomain )
		);

		const explicitTenantIds = definition.tenantIds || [];

		const mixedExplicitTenantIds = _.map(
			definition.tenants || [],
			tenant => {

				if( _.isString( tenant ) ) {
					return tenant;
				}

				return tenant.tenantId;
			}
		);

		const allTenantIds = _.concat(
			implicitTenantIds,
			explicitTenantIds,
			mixedExplicitTenantIds
		);

		const uniqueTenantIds = _.orderBy(
			_.uniq( allTenantIds )
		);

		if( allTenantIds.length !== uniqueTenantIds.length ) {

			const duplicates = _.orderBy(
				_.uniq(
					_.flatten( [
						_.intersection(
							implicitTenantIds,
							explicitTenantIds
						),
						_.intersection(
							implicitTenantIds,
							mixedExplicitTenantIds
						),
						_.intersection(
							explicitTenantIds,
							mixedExplicitTenantIds
						)
					] )
				)
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Tenants are duplicated: ${duplicatesStr}` );
		}

		return {
			values: uniqueTenantIds,
			variation
		};
	}
};
