const _ = require( 'lodash' );
const duplicatesDeep = require( '../utils.js' ).duplicatesDeep;
const instanceTypeMapper = require( '../instanceTypeMapper' );
const sortableVersionRangeParser = require( '../sortableVersionRangeParser.js' );

function* mapClauses( definition, instanceCatalog ) {

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

	const instanceNames = definition.instanceNames;
	if( instanceNames ) {

		if( !versions ) {
			throw new Error( 'Instances can only be targetted in rules for specific versions' );
		}

		const implicitInstanceIds = _.map(
			instanceNames || [],
			instanceName => instanceCatalog.mapInstanceName( instanceName )
		);

		const uniqueInstanceIds = _.orderBy(
			_.uniq( implicitInstanceIds )
		);

		if( implicitInstanceIds.length !== uniqueInstanceIds.length ) {

			const duplicates = _.orderBy(
				duplicatesDeep( [
					implicitInstanceIds
				] )
			);

			const duplicatesStr = _.join( duplicates, ', ' );
			throw new Error( `Instances are duplicated in rule: ${duplicatesStr}` );
		}

		const instanceIdKeys = _.map(
			uniqueInstanceIds,
			instanceId => `instance:${ instanceId }`
		);

		yield {
			attribute: 'key',
			op: 'in',
			values: instanceIdKeys,
			negate: false
		};
	}
}

module.exports = class InstanceRulesMapper {

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
