module.exports.homeList = function(req, res){
    res.render('location-list', {title: 'Home'})
};

module.exports.locationsInfo = function(req, res){
    res.render('location-info', {title: 'locations Info'})
};

module.exports.addReview = function(req, res){
    res.render('location-review-form', {title: 'add Review'})
};