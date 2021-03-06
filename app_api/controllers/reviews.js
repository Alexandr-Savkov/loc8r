var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports = {
	reviewsReadOne: reviewsReadOne,
	reviewsCreate: reviewsCreate,
	reviewsUpdateOne: reviewsUpdateOne,
	reviewsDeleteOne: reviewsDeleteOne
};

function reviewsReadOne (req, res) {
	if (req.params && req.params.locationId && req.params.reviewId)  {
		Loc
			.findById(req.params.locationId)
			.select('name reviews')
			.exec(function(err, location){
				var response, review;
				if (!location) {
					sendJsonResponse(res, 404, {"message":"Location not found, man..."});
					return;
				} else if (err) {
					sendJsonResponse(res, 404, err);
					return;
				}

				if (location.reviews && location.reviews.length > 0) {
					review = location.reviews.id(req.params.reviewId);
					if (!review) {
						sendJsonResponse(res, 404, {"message":"review Id not found"});
					} else {
						response = {
							location: {
								name: location.name,
								id: req.params.locationId
							},
							review: review
						};
						sendJsonResponse(res, 200, response);
					}

				} else {
					sendJsonResponse(res, 404, {"message":"No Reviews found, man..."});
				}
			});
	} else {
		sendJsonResponse(res, 404, {"message":"No location Id in request, could you check it?"});
	}
}

function reviewsCreate (req, res) {
	if (req.params.locationId) {
		Loc
			.findById(req.params.locationId)
			.select('reviews')
			.exec(
				function(err, location) {
					if (err) {
						sendJsonResponse(res, 400, err);
					} else {
						doAddReview(req, res, location);
					}
				}
			);
	} else {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid required"
		});
	}
}

function doAddReview (req, res, location) {
	if (!location) {
		sendJsonResponse(res, 404, "locationid not found");
	} else {
		location.reviews.push({
			author: req.body.author,
			rating: req.body.rating,
			reviewText: req.body.reviewText
		});
		location.save(function(err, location) {
			var thisReview;
			if (err) {
				sendJsonResponse(res, 400, err);
			} else {
				updateAverageRating(location._id);
				thisReview = location.reviews[location.reviews.length - 1];
				sendJsonResponse(res, 201, thisReview);
			}
		});
	}
}

function updateAverageRating (locationid) {
	console.log("Update rating average for", locationid);
	Loc
		.findById(locationid)
		.select('reviews')
		.exec(
			function(err, location) {
				if (!err) {
					doSetAverageRating(location);
				}
			}
		);
}

function doSetAverageRating (location) {
	var i, reviewCount, ratingAverage, ratingTotal;
	if (location.reviews && location.reviews.length > 0) {
		reviewCount = location.reviews.length;
		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + location.reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save(function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Average rating updated to", ratingAverage);
			}
		});
	}
}

function reviewsUpdateOne (req, res) {
	if (!req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Loc
		.findById(req.params.locationId)
		.select('reviews')
		.exec(
			function(err, location) {
				var thisReview;
				if (!location) {
					sendJsonResponse(res, 404, {
						"message": "locationid not found"
					});
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (location.reviews && location.reviews.length > 0) {
					thisReview = location.reviews.id(req.params.reviewId);
					if (!thisReview) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						thisReview.author = req.body.author;
						thisReview.rating = req.body.rating;
						thisReview.reviewText = req.body.reviewText;
						location.save(function(err, location) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								updateAverageRating(location._id);
								sendJsonResponse(res, 200, thisReview);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No review to update"
					});
				}
			}
		);
}

function reviewsDeleteOne (req, res) {
	if (!req.params.locationId || !req.params.reviewId) {
		sendJsonResponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
		return;
	}
	Loc
		.findById(req.params.locationId)
		.select('reviews')
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
				if (location.reviews && location.reviews.length > 0) {
					if (!location.reviews.id(req.params.reviewId)) {
						sendJsonResponse(res, 404, {
							"message": "reviewid not found"
						});
					} else {
						location.reviews.id(req.params.reviewId).remove();
						location.save(function(err) {
							if (err) {
								sendJsonResponse(res, 404, err);
							} else {
								updateAverageRating(location._id);
								sendJsonResponse(res, 204, null);
							}
						});
					}
				} else {
					sendJsonResponse(res, 404, {
						"message": "No review to delete"
					});
				}
			}
		);
}