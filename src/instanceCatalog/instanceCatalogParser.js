const _ = require( 'lodash' );
const InstanceCatalog = require( './InstanceCatalog.js' );

module.exports = function parseInstanceCatalog( instances ) {
	
	const instanceIdsByName = new Map();
	const tenantIdsByDomain = new Map();

	_.forEach( instances, instance => {
		instanceIdsByName.set( instance.name, instance.instanceId );

		_.forEach( instance.tenants, tenant => {
			_.forEach( tenant.domains, domain => {
				tenantIdsByDomain.set( domain, tenant.tenantId );
			} );
		} );
	} );

	return new InstanceCatalog( instanceIdsByName, tenantIdsByDomain );
};
