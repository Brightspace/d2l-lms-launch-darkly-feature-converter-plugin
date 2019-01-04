module.exports = function( instanceType ) {

	switch( instanceType ) {

		case 'dev':
			return 'Dev';

		case 'prod':
			return 'Prod';

		case 'sales':
			return 'Sales';

		case 'test':
			return 'Test';

		default:
			throw new Error( `Invalid instance type: ${ instanceType }` );
	}
};
