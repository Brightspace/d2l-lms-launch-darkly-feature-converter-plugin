const assert = require( 'chai' ).assert;
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );

const instanceCatalog = new InstanceCatalog(
	new Map( [
		['instance_a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa']
	] ),
	new Map( [
		['www.tenant_b.org', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb']
	] )
);

describe( 'InstanceCatalog', function() {

	describe( 'mapInstanceName', function() {

		it( 'should map instance name', function() {

			const instanceId = instanceCatalog.mapInstanceName( 'instance_a' );
			assert.equal( instanceId, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' );
		} );

		it( 'should throw when unknown instance name', function() {

			assert.throws(
				() => instanceCatalog.mapInstanceName( 'wacky' ),
				/Unknown instance name: wacky/
			);
		} );

	} );

	describe( 'mapTenantDomain', function() {

		it( 'should map org domain', function() {

			const tenantId = instanceCatalog.mapTenantDomain( 'www.tenant_b.org' );
			assert.equal( tenantId, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' );
		} );

		it( 'should throw when unknown org domain', function() {

			assert.throws(
				() => instanceCatalog.mapTenantDomain( 'wacky.test.org' ),
				/Unknown tenant domain: wacky.test.org/
			);
		} );

	} );

} );