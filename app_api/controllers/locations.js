var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports = {
	locationsReadOne: locationsReadOne,
	locationsListByDistance: locationsListByDistance,
	locationsCreate: locationsCreate,
	locationsUpdateOne: locationsUpdateOne,
	locationsDeleteOne: locationsDeleteOne
};

var theEarth = (function() {
	var earthRadius = 6371; // km, miles is 3959

	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
	};

	var getRadsFromDistance = function(distance) {
		return parseFloat(distance / earthRadius);
	};

	return {
		getDistanceFromRads: getDistanceFromRads,
		getRadsFromDistance: getRadsFromDistance
	};
})();

function locationsListByDistance (req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = parseFloat(req.query.maxDistance);
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var geoOptions = {
		spherical: true,
		maxDistance: theEarth.getRadsFromDistance(maxDistance),
		num: 10
	};
	if ((!lng && lng!==0) || (!lat && lat!==0) || ! maxDistance) {
		console.log('locationsListByDistance missing params');
		sendJsonResponse(res, 404, {
			"message": "lng, lat and maxDistance query parameters are all required"
		});
		return;
	}
	Loc.geoNear(point, geoOptions, function(err, results, stats) {
		var locations;
		console.log('Geo Results', results);
		console.log('Geo stats', stats);
		if (err) {
			console.log('geoNear error:', err);
			sendJsonResponse(res, 404, err);
		} else {
			locations = buildLocationList(req, res, results, stats);
			sendJsonResponse(res, 200, locations);
		}
	});
}

var buildLocationList = function(req, res, results, stats) {
	var locations = [];
	results.forEach(function(doc) {
		locations.push({
			distance: theEarth.getDistanceFromRads(doc.dis),
			name: doc.obj.name,
			address: doc.obj.address,
			rating: doc.obj.rating,
			facilities: doc.obj.facilities,
			_id: doc.obj._id
		});
	});
	return locations;
};

function locationsReadOne (req, res) {
	if (req.params && req.params.locationId) {
		Loc
			.findById(req.params.locationId)
			.exec(function(err, location){
				if (!location) {
					sendJsonResponse(res, 404, {"message":"Location not found, man..."});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}
				sendJsonResponse(res, 200, location);
			});
	} else {
		sendJsonResponse(res, 404, {"message":"No location Id in request, could you check it?"});
	}
}

function locationsCreate (req, res) {
	console.log(req.body);
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening1,
			closing: req.body.closing1,
			closed: req.body.closed1
		}, {
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2
		}]
	}, function(err, location) {
		if (err) {
			console.log(err);
			sendJsonResponse(res, 400, err);
		} else {
			console.log(location);
			sendJsonResponse(res, 201, location);
		}
	});
}

function locationsUpdateOne (req, res) {
	if (!req.params.locationId) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid is required"
		});
		return;
	}
	Loc
		.findById(req.params.locationId)
		.select('-reviews -rating')
		.exec(
			function(err, location) {
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				location.name = req.body.name;
				location.address = req.body.address;
				location.facilities = req.body.facilities.split(",");
				location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
				location.openingTimes = [{
					days: req.body.days1,
					opening: req.body.opening1,
					closing: req.body.closing1,
					closed: req.body.closed1
				}, {
					days: req.body.days2,
					opening: req.body.opening2,
					closing: req.body.closing2,
					closed: req.body.closed2
				}];
				location.save(function(err, location) {
					if (err) {
						sendJsonResponse(res, 404, err);
					} else {
						sendJsonResponse(res, 200, location);
					}
				});
			}
		);
}

function locationsDeleteOne (req, res) {
	var locationid = req.params.locationId;
	if (locationid) {
		Loc
			.findByIdAndRemove(locationid)
			.exec(
				function(err, location) {
					if (err) {
						console.log(err);
						sendJsonResponse(res, 404, err);
						return;
					}
					console.log("Location id " + locationid + " deleted");
					sendJsonResponse(res, 204, null);
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "No locationid"
		});
	}
};

