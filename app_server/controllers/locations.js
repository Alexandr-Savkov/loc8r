module.exports.homeList = function(req, res){
    res.render('index', {title: 'Home'})
};

module.exports.locationsInfo = function(req, res){
    res.render('index', {title: 'locationsInfo'})
};

module.exports.addReview = function(req, res){
    res.render('index', {title: 'addReview'})
};