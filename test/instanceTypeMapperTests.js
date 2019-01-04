const _ = require( 'lodash' );
const assert = require( 'chai' ).assert;
const instanceTypeMapper = require( '../src/instanceTypeMapper.js' );

describe( 'instanceTypeMapper', function() {

	_.forEach( [
		[ 'dev', 'Dev' ],
		[ 'prod', 'Prod' ],
		[ 'sales', 'Sales' ],
		[ 'test', 'Test' ],
	], pair => {

		const [ key, expectedInstanceType ] = pair;

		it( `should map instance type: ${key}`, function() {

			const instanceType = instanceTypeMapper( key );
			assert.equal( instanceType, expectedInstanceType );
		} );
	} );

	it( 'should throw if unkonwn instance type', function() {

		assert.throws(
			() => instanceTypeMapper( 'wacky' ),
			/Invalid instance type: wacky/
		);
	} );
} );