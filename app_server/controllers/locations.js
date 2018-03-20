module.exports.homeList = function(req, res){
    res.render('location-list', {
        title: 'Home',
        pageHeader: {
            title: 'Loc8r',
            strapline: 'Find place to work with WiFi near you!'
        },
				sidebar: 'Looking for Wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps With coffee, cake or a pit? Let Loc8r help you find the place you\'re looking for.',
        locations: [
            {
                name: 'StarCups',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 3,
                facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
                distance: '100 m'
            },
            {
                name: 'Cafe Hero',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 4,
                facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
                distance: '200 m'
            },
            {
                name: 'Burger Queen',
                address: '125 High Street, Reading, RG6 1PS',
                rating: 2,
                facilities: ['Food', 'Premium WiFi'],
                distance: '250 m'
            }
        ]
    })
};

module.exports.locationsInfo = function(req, res){
	res.render('location-info', {
		title: 'StarCups',
		pageHeader: {title: 'StarCups'},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t - please leave a review to help other people just like you.'
		},
		location: {
			name: 'StarCups',
			rating: 3,
			address: '125 High Street, Reading, RG 1PS',
			facilities: ['Hot drinks', 'Food', 'Premium WiFi'],
			coords: {
				lat: 51.455041,
				lng: -0.9690884
			},
			openingTimes: [
				{
					days: 'Monday - Friday',
					opening: '7:00 am',
					closing: '7:00 pm',
					closed: false
				},{
					days: 'Saturday',
					opening: '8:00 am',
					closing: '5:00 pm',
					closed: false
				},{
					days: 'Saturday',
					closed: true
				}
			],
			reviews: [
				{
					rating: 5,
					author: 'Simon Holmes',
					timestamp: '16 July 2013',
					reviewText: 'What a great place. I can\'t say enough good things about it.'
				},{
					rating: 3,
					reviewAuthor: 'Charlie Chaplin',
					reviewTimestamp: '16 March 2018',
					reviewText: 'It was okay. Coffee wasn\'t great, but the wifi was fast.'
				}
			]
		}
	})
};

module.exports.addReview = function(req, res){
    res.render('location-review-form', {
    	title: 'Review StarCups on Loc8r',
			pageHeader: {
    		title: 'Review StarCups'
			}})
};
