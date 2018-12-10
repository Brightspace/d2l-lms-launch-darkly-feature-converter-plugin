const assert = require( 'chai' ).assert;
const sortableVersionBuilder = require( '../src/sortableVersionBuilder.js' );

describe( 'sortableVersionBuilder', function() {

	describe( 'range start', function() {
		const rangeStart = true;
		commonTests( rangeStart );

		it( 'should treat missing revision as minimum', function() {
			const value = sortableVersionBuilder( '10.8.8', rangeStart );
			assert.equal( value,  10080800000 );
		} );
	} );

	describe( 'range end', function() {
		const rangeEnd = false;

		commonTests( rangeEnd );

		it( 'should treat missing revision as maximum', function() {
			const value = sortableVersionBuilder( '10.8.8', rangeEnd );
			assert.equal( value,  10080899999 );
		} );
	} );

	function commonTests(start) {
		it( 'should convert minimum', function() {

			const value = sortableVersionBuilder( '10.0.0.0', start );
			assert.equal( value, 10000000000 );
		} );

		it( 'should convert single digits', function() {

			const value = sortableVersionBuilder( '10.1.2.3', start );
			assert.equal( value, 10010200003 );
		} );

		it( 'should convert full digits', function() {

			const value = sortableVersionBuilder( '99.88.77.66666', start );
			assert.equal( value, 99887766666 );
		} );
	}
} );