const sortableVersionBuilder = require( './sortableVersionBuilder.js' );

module.exports = function( versions ) {

	if( !versions ) {
		return null;
	}

	const result = {};

	if( versions.start ) {
		result.start = sortableVersionBuilder( versions.start, 0 );
	}

	if( versions.end ) {
		result.end = sortableVersionBuilder( versions.end, 99999 );
	}
	
	if( result.start && result.end ) {
		if( result.start > result.end ) {
			throw new Error( `Version start is greater than version end: ${ versions.start } > ${ versions.end }` );
		}
	}

	return result;
};
