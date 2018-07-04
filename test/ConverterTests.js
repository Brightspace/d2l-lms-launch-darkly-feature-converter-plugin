const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
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
	} );

} );