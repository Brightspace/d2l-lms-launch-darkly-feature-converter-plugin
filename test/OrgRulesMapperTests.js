const assert = require( 'chai' ).assert;
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );
const OrgRulesMapper = require( '../src/org/OrgRulesMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const instanceCatalog = new InstanceCatalog(
	new Map(),
	new Map( [
		[ 'www.tenant_a.org', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
		[ 'www.tenant_c.org', 'cccccccc-cccc-cccc-cccc-cccccccccccc' ]
	] )
);

const mapper = new OrgRulesMapper( instanceCatalog );
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'OrgRulesMapperTests', function() {

	it( 'should map aws regions', function() {

		const definition = {
			awsRegions: [
				'us-east-1',
				'ca-central-1'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'awsRegion',
					op: 'in',
					values: [
						'ca-central-1',
						'us-east-1'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map data centers', function() {

		const definition = {
			dataCenters: [
				'us04',
				'ca05'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'datacenter',
					op: 'in',
					values: [
						'ca05',
						'us04'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map instance types', function() {

		const definition = {
			instanceTypes: [
				'test',
				'prod'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'instanceType',
					op: 'in',
					values: [
						'Prod',
						'Test'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map version end', function() {

		const definition = {
			versions: {
				end: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map version start and end', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345',
				end: '10.8.5.99999'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080599999
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should map specific version', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345',
				end: '10.8.4.12345'
			},
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'productVersion',
					op: 'lessThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should throw if start version is greater than end version', function() {

		const definition = {
			versions: {
				start: '10.8.5.0',
				end: '10.8.4.0'
			},
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Version start is greater than version end: 10.8.5.0 > 10.8.4.0$/
		);
	} );

	it( 'should map tenant domains for specific version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenantDomains: [
				'www.tenant_a.org',
				'www.tenant_c.org'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'key',
					op: 'in',
					values: [
						'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
						'cccccccc-cccc-cccc-cccc-cccccccccccc'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );
	
	it( 'should map tenant ids for specific version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenants: [
				'cccccccc-cccc-cccc-cccc-cccccccccccc',
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'key',
					op: 'in',
					values: [
						'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
						'cccccccc-cccc-cccc-cccc-cccccccccccc'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );
	
	it( 'should map tenants with comments for specific version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenants: [
				{
					tenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
					comments: 'The cookies tenant'
				},
				{
					tenantId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
					comments: 'The apples tenant'
				}
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'key',
					op: 'in',
					values: [
						'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
						'cccccccc-cccc-cccc-cccc-cccccccccccc'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );
	
	it( 'should map mixed tenants for specific version start', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenantDomains: [
				'www.tenant_a.org'
			],
			tenants: [
				{
					tenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
					comments: 'The cookies tenant'
				},
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			],
			variation: 'abc'
		};

		const rule = mapper.mapRule( definition, variationIndexMap );

		assert.deepEqual( rule, {
			clauses: [
				{
					attribute: 'productVersion',
					op: 'greaterThanOrEqual',
					values: [
						10080412345
					],
					negate: false
				},
				{
					attribute: 'key',
					op: 'in',
					values: [
						'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
						'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
						'cccccccc-cccc-cccc-cccc-cccccccccccc'
					],
					negate: false
				}
			],
			variation: 2 
		} );
	} );

	it( 'should throw if unknown tenant domain', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenantDomains: [
				'www.tenant_b.org'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Unknown tenant domain: www.tenant_b.org$/
		);
	} );

	it( 'should throw if tenant domains duplicated', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenantDomains: [
				'www.tenant_a.org',
				'www.tenant_a.org'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Tenant ids are duplicated in rule: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa$/
		);
	} );
	
	it( 'should throw if mixed tenants duplicated', function() {

		const definition = {
			versions: {
				start: '10.8.4.12345'
			},
			tenantDomains: [
				'www.tenant_a.org'
			],
			tenants: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Tenant ids are duplicated in rule: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa$/
		);
	} );

	it( 'should throw if tenant domains defined without versions', function() {

		const definition = {
			tenantDomains: [
				'www.tenant_a.org'
			],
			variation: 'abc'
		};

		assert.throws(
			() => {
				mapper.mapRule( definition, variationIndexMap );
			},
			/^Tenants can only be targetted in rules for specific versions$/
		);
	} );

} );