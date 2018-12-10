function parseRevision( revision, defaultRevision ) {
	if( revision !== undefined ) {
		return parseInt( revision );
	}

	return defaultRevision;
}

module.exports = function( version, defaultRevision ) {

	const parts = version.match( /^([1-9][0-9])\.([1-9]?[0-9])\.([1-9]?[0-9])(?:\.([1-9]?[0-9]{0,4}))?$/ );

	const major = parseInt( parts[ 1 ] );
	const minor = parseInt( parts[ 2 ] );
	const build = parseInt( parts[ 3 ] );
	const revision = parseRevision( parts[4], defaultRevision );

	return (
		major * 1e9
		+ minor * 1e7
		+ build * 1e5
		+ revision
	);
};
