const assert = require( 'chai' ).assert;
const InstanceCatalog = require( 'd2l-lms-instance-catalog' ).InstanceCatalog;
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

	it( 'should map instances (strings)', function() {

		const definition = {
			instances: [
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

	it( 'should map instances (objects)', function() {

		const definition = {
			instances: [
				{
					instanceId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
					comments: 'bbb'
				},
				{
					instanceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
					comments: 'aaa'
				}
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

	it( 'should map instances (mixed)', function() {

		const definition = {
			instances: [
				{
					instanceId: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
					comments: 'bbb'
				},
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

	it( 'should throw if multiple instances defined both by instance and name', function() {

		const definition = {
			instances: [
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

	it( 'should throw if multiple instances defined both by instance and id', function() {

		const definition = {
			instanceIds: [
				'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
				'cccccccc-cccc-cccc-cccc-cccccccccccc'
			],
			instances: [
				{
					instanceId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
					comments: 'ccc'
				},
				{
					instanceId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
					comments: 'aaa'
				}
			],
			variation: 'abc'
		};

		assert.throws(
			() => mapper.mapTarget( definition, variationIndexMap ),
			/Instances are duplicated: aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa, cccccccc-cccc-cccc-cccc-cccccccccccc/
		);
	} );
} );