const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const convertersPlugin = require( '../src/index.js' );

function testConverter( converter, definition, expected ) {

	converter.convert( definition, {}, ( err, feature ) => {

		if( err ) {
			throw err;
		}

		assert.deepEqual( feature, expected );
	} );
}

describe( 'EndToEndTests', function() {

	const convertersMap = {};

	this.beforeAll( function( done ) {

		const options = {};
		convertersPlugin( options, ( err, converters ) => {

			if( err ) {
				return done( err );
			}

			_.forEach( converters, converter => {
				_.forEach( converter.schemas, schema => {
					convertersMap[schema] = converter;
				} );
			} );

			return done();
		} );
	} );

	const instanceBooleanSchemaV1_0 = 'http://schemas.dev.brightspace.com/feature-flags/instance-boolean/v1_0.json';
	describe( instanceBooleanSchemaV1_0, function() {

		it( 'should convert', function() {

			const converter = convertersMap[instanceBooleanSchemaV1_0];
			assert( converter, 'converter should be constructed' );

			const definition = {
				$schema: instanceBooleanSchemaV1_0,
				name: 'Switch',
				description: 'Simple on/off switch',
				tags: [
					'mocha',
					'test'
				],
				variations: {
					true: {
						name: 'On',
						description: 'Turns the switch on'
					},
					false: {
						name: 'Off',
						description: 'Turns the switch off'
					}
				},
				environments: {
					production: {
						defaultVariation: 'false',
						targets: [
							{
								instanceIds: [
									'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
								],
								variation: 'true'
							},
							{
								instanceIds: [
									'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
								],
								variation: 'false'
							}
						]
					},
					development: {
						defaultVariation: 'true',
						rules: [
							{
								versions: {
									start: '10.8.4.0'
								},
								variation: 'false'
							}
						]
					}
				}
			};

			const expected = {
				name: 'Switch',
				kind: 'boolean',
				description: 'Simple on/off switch',
				includeInSnippet: false,
				variations: [
					{
						name: 'On',
						description: 'Turns the switch on',
						value: true
					},
					{
						name: 'Off',
						description: 'Turns the switch off',
						value: false
					}
				],
				temporary: true,
				tags: [
					'lms-generated-flag',
					'lms-instance-flag',
					'mocha',
					'test'
				],
				environments: {
					production: {
						on: true,
						targets: [
							{
								values: [
									'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
								],
								variation: 0
							},
							{
								values: [
									'instance:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
								],
								variation: 1
							}
						],
						rules: [],
						fallthrough: {
							variation: 1
						},
						offVariation: 1,
					},
					test: {
						on: true,
						targets: [],
						rules: [
							{
								variation: 1,
								clauses: [
									{
										attribute: 'productVersion',
										op: 'greaterThanOrEqual',
										values: [
											10080400000
										],
										negate: false
									}
								]
							}
						],
						fallthrough: {
							variation: 0
						},
						offVariation: 0,
					}
				}
			};

			testConverter( converter, definition, expected );
		} );
	} );

} );