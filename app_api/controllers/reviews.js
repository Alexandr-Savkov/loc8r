var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports = {
	reviewsReadOne: reviewsReadOne
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
};

