module.exports = class InstanceCatalog {

	constructor( instanceIdsByNameMap, tenantIdsByDomainMap ) {

		this._instanceIdsByNameMap = instanceIdsByNameMap;
		this._tenantIdsByDomainMap = tenantIdsByDomainMap;
	}

	get isEmpty() {
		return (
			this._instanceIdsByNameMap.size === 0
			&& this._tenantIdsByDomainMap.size === 0
		);
	}

	mapInstanceName( instanceName ) {

		const instanceId = this._instanceIdsByNameMap.get( instanceName );
		if( !instanceId ) {
			throw new Error( `Unknown instance name: ${ instanceName }` );
		}

		return instanceId;
	}

	mapTenantDomain( domainName ) {

		const tenantId = this._tenantIdsByDomainMap.get( domainName );
		if( !tenantId ) {
			throw new Error( `Unknown tenant domain: ${ domainName }` );
		}

		return tenantId;
	}
};
