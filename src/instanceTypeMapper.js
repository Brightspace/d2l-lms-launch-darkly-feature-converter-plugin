module.exports = function( instanceType ) {

	switch( instanceType ) {

		case 'prod':
			return 'Prod';

		case 'test':
			return 'Test';

		case 'dev':
			return 'Dev';

		default:
			throw new Error( `Invalid instance type: ${ instanceType }` );
	}
};
