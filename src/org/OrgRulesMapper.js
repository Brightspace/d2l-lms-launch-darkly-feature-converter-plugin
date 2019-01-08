const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;
const instanceTypeMapper = require( '../instanceTypeMapper' );
const sortableVersionRangeParser = require( '../sortableVersionRangeParser.js' );

function* mapClauses( definition, instanceCatalog ) {

	if( definition.awsRegions ) {

		const awsRegions = _.orderBy( definition.awsRegions );

		yield {
			attribute: 'awsRegion',
			op: 'in',
			values: awsRegions,
			negate: false
		};
	}

	if( definition.dataCenters ) {

		const dataCenters = _.orderBy( definition.dataCenters );

		yield {
			attribute: 'datacenter',
			op: 'in',
			values: dataCenters,
			negate: false
		};
	}

	if( definition.instanceTypes ) {

		const instanceTypes = _.orderBy(
			_.map( definition.instanceTypes, instanceTypeMapper )
		);

		yield {
			attribute: 'instanceType',
			op: 'in',
			values: instanceTypes,
			negate: false
		};
	}

	const versions = sortableVersionRangeParser( definition.versions );
	if( versions ) {

		if( versions.start ) {
			yield {
				attribute: 'productVersion',
				op: 'greaterThanOrEqual',
				values: [ versions.start ],
				negate: false
			};
		}

		if( versions.end ) {
			yield {
				attribute: 'productVersion',
				op: 'lessThanOrEqual',
				values: [ versions.end ],
				negate: false
			};
		}
	}

	const tenantDomains = definition.tenantDomains;
	const tenants = definition.tenants;

	if( tenantDomains || tenants ) {

		if( !versions ) {
			throw new Error( 'Tenants can only be targetted in rules for specific versions' );
		}

		const implicitTenantIds = _.map(
			tenantDomains || [],
			tenantDomain => instanceCatalog.mapTenantDomain( tenantDomain )
		);

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
			mixedExplicitTenantIds
		);

		const uniqueTenantIds = _.orderBy(
			_.uniq( allTenantIds )
		);

		if( allTenantIds.length !== uniqueTenantIds.length ) {

			const duplicates = _.orderBy(
				duplicatesDeep( [
					allTenantIds
				] )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Tenant ids are duplicated in rule: ${duplicatesStr}` );
		}

		yield {
			attribute: 'key',
			op: 'in',
			values: uniqueTenantIds,
			negate: false
		};
	}
}

module.exports = class OrgRulesMapper {

	constructor( instanceCatalog ) {
		this._instanceCatalog = instanceCatalog;
	}

	mapRule( definition, variationIndexMap ) {

		const clauses = Array.from( mapClauses( definition, this._instanceCatalog ) );
		const variation = variationIndexMap.getIndex( definition.variation );

		return {
			clauses,
			variation
		};
	}
};
