const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const instanceCatalogParser = require( '../src/instanceCatalog/instanceCatalogParser.js' );

const instanceCatalog = instanceCatalogParser( [
	{
		InstanceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
		ClientName: 'instance_a',
		Orgs: {
			6606: {
				TenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
				HostNames: {
					'www.tenant_c.org': {}
				}
			}
		}
	},
	{
		InstanceId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
		ClientName: 'instance_b',
		Orgs: {
			6606: {
				TenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
				HostNames: {
					'www.tenant_d.org': {},
					'alt.tenant_d.org': {}
				}
			}
		}
	}
] );

describe( 'instanceCatalogParser', function() {

	describe( 'mapInstanceName', function() {

		_.forEach( [
			{
				name: 'instance_a',
				instanceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			},
			{
				name: 'instance_b',
				instanceId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			}
		], pair => {

			it( `should map instance name: ${pair.name}`, function() {

				const instanceId = instanceCatalog.mapInstanceName( pair.name );
				assert.equal( instanceId, pair.instanceId );
			} );
		} );
	} );

	describe( 'mapTenantDomain', function() {

		_.forEach( [
			{
				domain: 'www.tenant_c.org',
				tenantId: 'cccccccc-cccc-cccc-cccc-cccccccccccc'
			},
			{
				domain: 'www.tenant_d.org',
				tenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd'
			},
			{
				domain: 'alt.tenant_d.org',
				tenantId: 'dddddddd-dddd-dddd-dddd-dddddddddddd'
			}
		], pair => {

			it( `should map org domain: ${pair.domain}`, function() {

				const tenantId = instanceCatalog.mapTenantDomain( pair.domain );
				assert.equal( tenantId, pair.tenantId );
			} );
		} );
	} );

} );