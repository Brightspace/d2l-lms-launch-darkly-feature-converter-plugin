const _ = require( 'lodash' );

module.exports = class EnvironmentMapper {

	constructor( targetsMapper, rulesMapper ) {

		this._targetsMapper = targetsMapper;
		this._rulesMapper = rulesMapper;
	}

	mapEnvironment( definition, variationIndexMap ) {

		const fallthroughVariation = variationIndexMap.getIndex( definition.defaultVariation );

		const targets = _.map(
			definition.targets || [],
			t => this._targetsMapper.mapTarget( t, variationIndexMap )
		);

		const rules = _.map(
			definition.rules || [],
			r => this._rulesMapper.mapRule( r, variationIndexMap )
		);

		const on = (
			targets.length > 0
			|| rules.length > 0
		);

		return {
			on,
			targets,
			rules,
			fallthrough: {
				variation: fallthroughVariation
			},
			offVariation: fallthroughVariation
		};
	}
};
