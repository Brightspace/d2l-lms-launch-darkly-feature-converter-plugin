const _ = require( 'lodash' );
const Converter = require( './Converter.js' );
const EnvironmentMapper = require( './EnvironmentMapper.js' );
const JsonSchemaValidator = require( './JsonSchemaValidator.js' );

const loadInstanceCatalog = require( './instanceCatalog/instanceCatalogLoader.js' );

const InstanceRulesMapper = require( './instance/InstanceRulesMapper.js' );
const InstanceTargetsMapper = require( './instance/InstanceTargetsMapper.js' );

const OrgRulesMapper = require( './org/OrgRulesMapper.js' );
const OrgTargetsMapper = require( './org/OrgTargetsMapper.js' );

const BooleanVariationMapper = require( './variations/BooleanVariationMapper.js' );
const MultiVariationMapper = require( './variations/MultiVariationMapper.js' );

const instanceBooleanSchemaV1_0 = require( '../schemas/instance-boolean/v1_0.json' );
const instanceBooleanSchemaV1_1 = require( '../schemas/instance-boolean/v1_1.json' );

const instanceMultivariateSchemaV1_0 = require( '../schemas/instance-multivariate/v1_0.json' );
const instanceMultivariateSchemaV1_1 = require( '../schemas/instance-multivariate/v1_1.json' );

const orgBooleanSchemaV1_0 = require( '../schemas/org-boolean/v1_0.json' );
const orgBooleanSchemaV1_1 = require( '../schemas/org-boolean/v1_1.json' );

const orgMultivariateSchemaV1_0 = require( '../schemas/org-multivariate/v1_0.json' );
const orgMultivariateSchemaV1_1 = require( '../schemas/org-multivariate/v1_1.json' );

const booleanFeatureKind = 'boolean';
const multivariateFeatureKind = 'multivariate';

const generateFlagTag = 'lms-generated-flag';
const instanceFlagTag = 'lms-instance-flag';
const orgFlagTag = 'lms-org-flag';

function createSchemaValiators( schemas ) {

	const validators = {};

	_.forEach( schemas, schema => {
		validators[ schema.$id ] = new JsonSchemaValidator( schema );
	} );

	return validators;
}

function* createConverters( instanceCatalog ) {

	const booleanVariationMapper = new BooleanVariationMapper();
	const multiVariationMapper = new MultiVariationMapper();

	const instanceTargetsMapper = new InstanceTargetsMapper( instanceCatalog );
	const instanceRulesMapper = new InstanceRulesMapper();
	const instanceEnvironmentMapper = new EnvironmentMapper( instanceTargetsMapper, instanceRulesMapper );

	const orgTargetsMapper = new OrgTargetsMapper( instanceCatalog );
	const orgRulesMapper = new OrgRulesMapper();
	const orgEnvironmentMapper = new EnvironmentMapper( orgTargetsMapper, orgRulesMapper );

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			instanceBooleanSchemaV1_0,
			instanceBooleanSchemaV1_1
		] ),
		booleanVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			instanceMultivariateSchemaV1_0,
			instanceMultivariateSchemaV1_1
		] ),
		multiVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			orgBooleanSchemaV1_0,
			orgBooleanSchemaV1_1
		] ),
		booleanVariationMapper,
		orgEnvironmentMapper,
		[ generateFlagTag, orgFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			orgMultivariateSchemaV1_0,
			orgMultivariateSchemaV1_1
		] ),
		multiVariationMapper,
		orgEnvironmentMapper,
		[ generateFlagTag, orgFlagTag ]
	);
}

module.exports = function( options, callback ) {

	loadInstanceCatalog( ( err, instanceCatalog ) => {

		if( err ) {
			return callback( err );
		}

		const converters = Array.from( createConverters( instanceCatalog ) );
		return callback( null, converters );
	} );
};
