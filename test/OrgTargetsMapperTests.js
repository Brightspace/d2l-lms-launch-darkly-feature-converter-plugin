const assert = require( 'chai' ).assert;
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );
const OrgTargetsMapper = require( '../src/org/OrgTargetsMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const instanceCatalog = new InstanceCatalog(
	new Map(),
	new Map( [
		[ 'www.tenant_a.org', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
		[ 'www.tenant_c.org', 'cccccccc-cccc-cccc-cccc-cccccccccccc' ]
	] )
);

const mapper = new OrgTargetsMapper( instanceCatalog );
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'OrgTargetsMapper', function() {

	it( 'should map tenant ids', function() {

		const definition = {
			tenantIds: [
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			],
			variation: 2
		} );
	} );

	it( 'should map tenant domains', function() {

		const definition = {
			tenantDomains: [
				'www.tenant_c.org',
				'www.tenant_a.org'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			variation: 2
		} );
	} );

	it( 'should merge tenant ids & tenant domains', function() {

		const definition = {
			tenantIds: [
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			],
			tenantDomains: [
				'www.tenant_c.org',
				'www.tenant_a.org'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			variation: 2
		} );
	} );

	it( 'should throw if tenant defined both by id and name', function() {

		const definition = {
			tenantIds: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			tenantDomains: [
				'www.tenant_a.org'
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Tenants are duplicated: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/
		);
	} );

	it( 'should throw if multiple instances defined both by id and name', function() {

		const definition = {
			tenantIds: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			tenantDomains: [
				'www.tenant_a.org',
				'www.tenant_c.org'
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Tenants are duplicated: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, cccccccc-cccc-cccc-cccc-cccccccccccc/
		);
	} );
} );