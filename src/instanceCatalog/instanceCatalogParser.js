const _ = require( 'lodash' );
const InstanceCatalog = require( './InstanceCatalog.js' );

module.exports = function parseInstanceCatalog( instances ) {
	
	const instanceIdsByName = new Map();
	const tenantIdsByDomainName = new Map();

	_.forEach( instances, instance => {
		instanceIdsByName.set( instance.ClientName, instance.InstanceId );

		_.forIn( instance.Orgs, org => {
			_.forIn( org.HostNames, ( domain, domainName ) => {
				tenantIdsByDomainName.set( domainName, org.TenantId );
			} );
		} );
	} );

	return new InstanceCatalog( instanceIdsByName, tenantIdsByDomainName );
};
