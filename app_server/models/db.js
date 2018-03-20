var mongoose = require('mongoose');

var gracefulShutdown;

// var dbURI = 'mongodb://localhost/loc8r';
var dbURI = 'mongodb://localhost/loc8r';


if(process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGOLAB_URI;
}


mongoose.connect(dbURI);

// for log into logFile
mongoose.connection.on('connected', function(){
	console.log(process.platform);
	console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(){
	console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected to ' + dbURI);
});


// for check SIGINT process in windows 32bit
var readLine = require('readline');
if (process.platform === 'win32') {
	var rl = readLine.createInterface ({
		input: process.stdin,
		output: process.stdout
	});
	rl.on('SIGINT', function() {
		process.emit ('SIGINT');
	})
}

// function for closing connection with DB
gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected through ' + msg );
		callback();
	});
};

// for check restart-process in nodemoon
process.once('SIGUSR2', function(){
	gracefulShutdown('nodemon restart', function(){
		process.kill(process.pid, 'SIGUSR2');
	});
});
// for check shutdown app
process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});
// for check when Heroku shutdown app
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});






