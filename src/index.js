const _ = require( 'lodash' );
const Converter = require( './Converter.js' );
const EnvironmentMapper = require( './EnvironmentMapper.js' );
const JsonSchemaValidator = require( './JsonSchemaValidator.js' );

const loadInstanceCatalog = require( './instanceCatalog/instanceCatalogLoader.js' );

const FarmRulesMapper = require( './farm/FarmRulesMapper.js' );
const FarmTargetsMapper = require( './farm/FarmTargetsMapper.js' );

const InstanceRulesMapper = require( './instance/InstanceRulesMapper.js' );
const InstanceTargetsMapper = require( './instance/InstanceTargetsMapper.js' );

const OrgRulesMapper = require( './org/OrgRulesMapper.js' );
const OrgTargetsMapper = require( './org/OrgTargetsMapper.js' );

const BooleanVariationMapper = require( './variations/BooleanVariationMapper.js' );
const MultiVariationMapper = require( './variations/MultiVariationMapper.js' );

const farmBooleanSchemaV3_5 = require( '../schemas/farm-boolean/v3_5.json' );
const farmBooleanSchemaV4_0 = require( '../schemas/farm-boolean/v4_0.json' );
const farmBooleanSchemaV4_1 = require( '../schemas/farm-boolean/v4_1.json' );
const farmBooleanSchemaV4_2 = require( '../schemas/farm-boolean/v4_2.json' );

const farmMultivariateSchemaV3_5 = require( '../schemas/farm-multivariate/v3_5.json' );
const farmMultivariateSchemaV4_0 = require( '../schemas/farm-multivariate/v4_0.json' );
const farmMultivariateSchemaV4_1 = require( '../schemas/farm-multivariate/v4_1.json' );
const farmMultivariateSchemaV4_2 = require( '../schemas/farm-multivariate/v4_2.json' );

const instanceBooleanSchemaV3_5 = require( '../schemas/instance-boolean/v3_5.json' );
const instanceBooleanSchemaV4_0 = require( '../schemas/instance-boolean/v4_0.json' );
const instanceBooleanSchemaV4_1 = require( '../schemas/instance-boolean/v4_1.json' );
const instanceBooleanSchemaV4_2 = require( '../schemas/instance-boolean/v4_2.json' );

const instanceMultivariateSchemaV3_5 = require( '../schemas/instance-multivariate/v3_5.json' );
const instanceMultivariateSchemaV4_0 = require( '../schemas/instance-multivariate/v4_0.json' );
const instanceMultivariateSchemaV4_1 = require( '../schemas/instance-multivariate/v4_1.json' );
const instanceMultivariateSchemaV4_2 = require( '../schemas/instance-multivariate/v4_2.json' );

const orgBooleanSchemaV3_5 = require( '../schemas/org-boolean/v3_5.json' );
const orgBooleanSchemaV4_0 = require( '../schemas/org-boolean/v4_0.json' );
const orgBooleanSchemaV4_1 = require( '../schemas/org-boolean/v4_1.json' );
const orgBooleanSchemaV4_2 = require( '../schemas/org-boolean/v4_2.json' );

const orgMultivariateSchemaV3_5 = require( '../schemas/org-multivariate/v3_5.json' );
const orgMultivariateSchemaV4_0 = require( '../schemas/org-multivariate/v4_0.json' );
const orgMultivariateSchemaV4_1 = require( '../schemas/org-multivariate/v4_1.json' );
const orgMultivariateSchemaV4_2 = require( '../schemas/org-multivariate/v4_2.json' );

const booleanFeatureKind = 'boolean';
const multivariateFeatureKind = 'multivariate';

const generateFlagTag = 'lms-generated-flag';
const farmFlagTag = 'lms-farm-flag';
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

	const farmTargetsMapper = new FarmTargetsMapper();
	const farmRulesMapper = new FarmRulesMapper();
	const farmEnvironmentMapper = new EnvironmentMapper( farmTargetsMapper, farmRulesMapper );

	const instanceTargetsMapper = new InstanceTargetsMapper( instanceCatalog );
	const instanceRulesMapper = new InstanceRulesMapper( instanceCatalog );
	const instanceEnvironmentMapper = new EnvironmentMapper( instanceTargetsMapper, instanceRulesMapper );

	const orgTargetsMapper = new OrgTargetsMapper( instanceCatalog );
	const orgRulesMapper = new OrgRulesMapper( instanceCatalog );
	const orgEnvironmentMapper = new EnvironmentMapper( orgTargetsMapper, orgRulesMapper );

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			farmBooleanSchemaV3_5,
			farmBooleanSchemaV4_0,
			farmBooleanSchemaV4_1,
			farmBooleanSchemaV4_2
		] ),
		booleanVariationMapper,
		farmEnvironmentMapper,
		[ generateFlagTag, farmFlagTag ]
	);
	
	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			farmMultivariateSchemaV3_5,
			farmMultivariateSchemaV4_0,
			farmMultivariateSchemaV4_1,
			farmMultivariateSchemaV4_2
		] ),
		multiVariationMapper,
		farmEnvironmentMapper,
		[ generateFlagTag, farmFlagTag ]
	);

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			instanceBooleanSchemaV3_5,
			instanceBooleanSchemaV4_0,
			instanceBooleanSchemaV4_1,
			instanceBooleanSchemaV4_2
		] ),
		booleanVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			instanceMultivariateSchemaV3_5,
			instanceMultivariateSchemaV4_0,
			instanceMultivariateSchemaV4_1,
			instanceMultivariateSchemaV4_2
		] ),
		multiVariationMapper,
		instanceEnvironmentMapper,
		[ generateFlagTag, instanceFlagTag ]
	);

	yield new Converter(
		booleanFeatureKind,
		createSchemaValiators( [
			orgBooleanSchemaV3_5,
			orgBooleanSchemaV4_0,
			orgBooleanSchemaV4_1,
			orgBooleanSchemaV4_2
		] ),
		booleanVariationMapper,
		orgEnvironmentMapper,
		[ generateFlagTag, orgFlagTag ]
	);

	yield new Converter(
		multivariateFeatureKind,
		createSchemaValiators( [
			orgMultivariateSchemaV3_5,
			orgMultivariateSchemaV4_0,
			orgMultivariateSchemaV4_1,
			orgMultivariateSchemaV4_2
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
