const assert = require( 'chai' ).assert;
const BooleanVariationMapper = require( '../src/variations/BooleanVariationMapper.js' ); 
const EnvironmentMapper = require( '../src/EnvironmentMapper.js' );
const InstanceRulesMapper = require( '../src/instance/InstanceRulesMapper.js' );
const InstanceTargetsMapper = require( '../src/instance/InstanceTargetsMapper.js' );
const Converter = require( '../src/Converter.js' );

const mocckSchema = 'http://test.org/mock';
const mockSchemaValidators = {};
mockSchemaValidators[ mocckSchema ] = {
	validate: () => { }
};

describe( 'Converter', function() {

	describe( 'validate', function() {

		it( 'should throw if variation targetted multiple times in production', function() {

			const definition = {
				$schema: mocckSchema,
				environments: {
					production: {
						targets: [
							{
								variation: 'true'
							},
							{
								variation: 'true'
							}
						]
					},
					development: {
					}
				}
			};

			const converter = new Converter(
				'test',
				mockSchemaValidators,
				null,
				null,
				[]
			);

			assert.throws(
				() => converter.validate( definition ),
				/^Duplciate target variations in production environment: true$/
			);
		} );

		it( 'should throw if variation targetted multiple times in development', function() {

			const definition = {
				$schema: mocckSchema,
				environments: {
					production: {
					},
					development: {
						targets: [
							{
								variation: 'false'
							},
							{
								variation: 'false'
							}
						]
					}
				}
			};

			const converter = new Converter(
				'test',
				mockSchemaValidators,
				null,
				null,
				[]
			);

			assert.throws(
				() => converter.validate( definition ),
				/^Duplciate target variations in development environment: false$/
			);
		} );

		it( 'should throw if unsupported schema', function() {

			const definition = {
				$schema: 'http://test.org/wacky'
			};

			const converter = new Converter(
				'test',
				mockSchemaValidators,
				null,
				null,
				[]
			);

			assert.throws(
				() => converter.validate( definition ),
				/^Unsupported feature definition schema: http:\/\/test.org\/wacky$/
			);
		} );

		it( 'should default description to empty string', function( done ) {

			const definition = {
				$schema: mocckSchema,
				name: 'test',
				environments: {
					production: {
						defaultVariation: 'false'
					},
					development: {
						defaultVariation: 'true'
					}
				}
			};

			const converter = new Converter(
				'test',
				mockSchemaValidators,
				new BooleanVariationMapper(),
				new EnvironmentMapper(
					new InstanceTargetsMapper(),
					new InstanceRulesMapper()
				),
				[]
			);

			converter.convert( definition, {}, ( err, result ) => {

				if( err ) {
					return done( err );
				}

				assert.equal(
					result.description,
					'',
					'default description should be set'
				);
			} );
		} );

	} );

} );