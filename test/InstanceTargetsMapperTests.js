const assert = require( 'chai' ).assert;
const InstanceCatalog = require( '../src/instanceCatalog/InstanceCatalog.js' );
const InstanceTargetsMapper = require( '../src/instance/InstanceTargetsMapper.js' );
const VariationIndexMap = require( '../src/variations/VariationIndexMap.js' );

const instanceCatalog = new InstanceCatalog(
	new Map( [
		[ 'instance_a', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' ],
		[ 'instance_c', 'cccccccc-cccc-cccc-cccc-cccccccccccc' ]
	] ),
	new Map()
);

const mapper = new InstanceTargetsMapper( instanceCatalog );
const variationIndexMap = new VariationIndexMap( { abc: 2 } );

describe( 'InstanceTargetsMapper', function() {

	it( 'should map instance ids', function() {

		const definition = {
			instanceIds: [
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'instance:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			],
			variation: 2
		} );
	} );

	it( 'should map instance names', function() {

		const definition = {
			instanceNames: [
				'instance_c',
				'instance_a'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'instance:cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			variation: 2
		} );
	} );

	it( 'should merge instance ids & instance names', function() {

		const definition = {
			instanceIds: [
				'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
			],
			instanceNames: [
				'instance_c',
				'instance_a'
			],
			variation: 'abc'
		};

		const target = mapper.mapTarget( definition, variationIndexMap );

		assert.deepEqual( target, {
			values: [
				'instance:aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'instance:bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
				'instance:cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			variation: 2
		} );
	} );

	it( 'should throw if instance defined both by id and name', function() {

		const definition = {
			instanceIds: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
			],
			instanceNames: [
				'instance_a'
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Instances are duplicated: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/
		);
	} );

	it( 'should throw if multiple instances defined both by id and name', function() {

		const definition = {
			instanceIds: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			instanceNames: [
				'instance_c',
				'instance_a'
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Instances are duplicated: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, cccccccc-cccc-cccc-cccc-cccccccccccc/
		);
	} );
} );