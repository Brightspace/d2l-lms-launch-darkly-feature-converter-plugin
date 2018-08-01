const _ = require( 'lodash' );
const sortableVersionBuilder = require( '../sortableVersionBuilder.js' );

function* mapClauses( definition ) {

	if( definition.dataCenters ) {

		const dataCenters = _.orderBy( definition.dataCenters );

		yield {
			attribute: 'datacenter',
			op: 'in',
			values: dataCenters,
			negate: false
		};
	}

	const versions = definition.versions;
	if( versions ) {

		if( versions.start ) {
			yield {
				attribute: 'bundleVersion',
				op: 'greaterThanOrEqual',
				values: [
					sortableVersionBuilder( versions.start )
				],
				negate: false
			};
		}

		if( versions.end ) {
			yield {
				attribute: 'bundleVersion',
				op: 'lessThanOrEqual',
				values: [
					sortableVersionBuilder( versions.end )
				],
				negate: false
			};
		}
	}
}

module.exports = class InstanceRulesMapper {

	mapRule( definition, variationIndexMap ) {

		const clauses = Array.from( mapClauses( definition ) );
		const variation = variationIndexMap.getIndex( definition.variation );

		return {
			clauses,
			variation
		};
	}
};
