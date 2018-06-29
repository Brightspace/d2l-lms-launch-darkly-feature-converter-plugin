const Ajv = require( 'ajv' );

const ajv = new Ajv();
ajv.addMetaSchema( require( 'ajv/lib/refs/json-schema-draft-06.json' ) );

module.exports = class JsonSchemaValidator {

	constructor( schema ) {
		this._schemaValidator = ajv.compile( schema );
	}

	validate( json ) {

		const valid = this._schemaValidator( json );
		if( valid ) {
			return;
		}

		const errors = this._schemaValidator.errors;
		const errorsJson = JSON.stringify( errors, null, '\t' );
		throw new Error( `Invalid feature definition: ${errorsJson}` );
	}
};
