const InstanceCatalog = require( './InstanceCatalog.js' );
const parseInstanceCatalog = require( './instanceCatalogParser.js' );
const formatFileUrl = require( 'file-url' );
const fsUtil = require( 'fs' );
const URL = require( 'url' ).URL;

function loadInstanceCatalogFile( fileUrl, callback ) {

	fsUtil.readFile( fileUrl, ( err, content ) => {

		if( err ) {
			return callback( err );
		}

		try {
			const json = JSON.parse( content );
			const catalog = parseInstanceCatalog( json );
			return callback( null, catalog );

		} catch( err ) {
			return callback( err );
		}
	} );
}

module.exports = function loadInstanceCatalog( callback ) {

	const src = process.env.D2L_LMS_INSTANCE_CATALOG_SOURCE;
	if( !src ) {

		const catalog = new InstanceCatalog( new Map(), new Map() );
		return callback( null, catalog );
	}

	let url;
	try {
		url = new URL( src );
	} catch( err ) {
		return callback( err );
	}

	switch( url.protocol ) {

		case 'file:':
			const workingDir = formatFileUrl( process.cwd() ) + '/';
			const fileUrl = new URL( src, workingDir );
			return loadInstanceCatalogFile( fileUrl, callback );
	}

	const error = new Error( `Only file instance catalog sources are currently supported: ${src}` );
	return callback( error );
};
