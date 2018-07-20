const assert = require( 'chai' ).assert;
const EnvironmentMapper = require( '../src/EnvironmentMapper.js' );
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );
const InstanceRulesMapper = require( '../src/instance/InstanceRulesMapper.js' );
const InstanceTargetsMapper = require( '../src/instance/InstanceTargetsMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const variationIndexMap = new VariationIndexMap( {
	on: 0,
	off: 1
} );

const mapper = new EnvironmentMapper(
	new InstanceTargetsMapper(
		new InstanceCatalog( new Map(), new Map() )
	),
	new InstanceRulesMapper()
);

describe( 'EnvironmentMapper', function() {

	describe( 'mapEnvironment', function() {

		it( 'should throw if targets duplicated', function() {

			const definition = {
				defaultVariation: 'on',
				targets: [
					{
						instances: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					},
					{
						instances: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'off'
					}
				]
			};

			assert.throws(
				() => mapper.mapEnvironment( definition, variationIndexMap ),
				/^Duplicate targets: instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa$/
			);
		} );
	} );
} );