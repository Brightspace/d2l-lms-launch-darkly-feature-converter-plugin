const assert = require( 'chai' ).assert;
const EnvironmentMapper = require( '../src/EnvironmentMapper.js' );
const InstanceCatalog = require( 'd2l-lms-instance-catalog' ).InstanceCatalog;
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

		it( 'should set environment off when no targets and rules', function() {

			const definition = {
				defaultVariation: 'on'
			};

			const expected = {
				on: false,
				targets: [],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment on when only one target', function() {

			const definition = {
				defaultVariation: 'on',
				targets: [
					{
						instances: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					}
				]
			};

			const expected = {
				on: true,
				targets: [
					{
						values: [ 'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
						variation: 0
					}
				],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment on when one rule', function() {

			const definition = {
				defaultVariation: 'on',
				rules: [
					{
						versions: {
							start: '10.8.4.0'
						},
						variation: 'on'
					}
				]
			};

			const expected = {
				on: true,
				targets: [],
				rules: [
					{
						clauses: [
							{
								attribute: 'productVersion',
								negate: false,
								op: 'greaterThanOrEqual',
								values: [
									10080400000
								]
							}
						],
						variation: 0
					}
				],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );

		it( 'should set environment off when disabled', function() {

			const definition = {
				disabled: true,
				defaultVariation: 'on',
				targets: [
					{
						instances: [
							'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
						],
						variation: 'on'
					}
				]
			};

			const expected = {
				on: false,
				targets: [
					{
						values: [ 'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
						variation: 0
					}
				],
				rules: [],
				fallthrough: {
					variation: 0
				},
				offVariation: 0
			};

			assert.deepEqual(
				mapper.mapEnvironment( definition, variationIndexMap ),
				expected
			);
		} );
	} );
} );