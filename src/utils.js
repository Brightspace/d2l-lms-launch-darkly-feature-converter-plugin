const _ = require( 'lodash' );

function anyIntersections( items1, items2, items3 ) {

	const intersections = _.uniq(
		_.flatten( [
			_.intersection(
				items1,
				items2
			),
			_.intersection(
				items1,
				items3
			),
			_.intersection(
				items2,
				items3
			)
		] )
	);

	return intersections;
}

module.exports = {
	anyIntersections
};
