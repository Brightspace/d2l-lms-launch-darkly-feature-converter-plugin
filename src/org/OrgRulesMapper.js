const _ = require( 'lodash' );
const instanceTypeMapper = require( '../instanceTypeMapper' );
const sortableVersionBuilder = require( '../sortableVersionBuilder.js' );

function* mapClauses( definition ) {

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

	const versions = definition.versions;
	if( versions ) {

		if( versions.start ) {
			yield {
				attribute: 'productVersion',
				op: 'greaterThanOrEqual',
				values: [
					sortableVersionBuilder( versions.start )
				],
				negate: false
			};
		}

		if( versions.end ) {
			yield {
				attribute: 'productVersion',
				op: 'lessThanOrEqual',
				values: [
					sortableVersionBuilder( versions.end )
				],
				negate: false
			};
		}
	}
}

module.exports = class OrgRulesMapper {

	mapRule( definition, variationIndexMap ) {

		const clauses = Array.from( mapClauses( definition ) );
		const variation = variationIndexMap.getIndex( definition.variation );

		return {
			clauses,
			variation
		};
	}
};
