'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('cookie-session');

var app = express();
require('dotenv').load();
require('./app/config/passport')(passport);

/*
 * Use Handlebars for templating
 */
let exphbs = require('express-handlebars');
let hbs;

/*
 * Config for Production and Development
 */
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'production') {
	// Set the default layout and locate layouts and partials
	app.engine('handlebars', exphbs({
		defaultLayout: 'main',
		layoutsDir: 'dist/views/layouts/',
		partialsDir: 'dist/views/partials/'
	}));

	// Locate the views
	app.set('views', __dirname + '/dist/views');

	// Locate the assets
	app.use(express.static(__dirname + '/dist/assets'));

} else {
	app.engine('handlebars', exphbs({
		// Default Layout and locate layouts and partials
		defaultLayout: 'main',
		layoutsDir: 'views/layouts/',
		partialsDir: 'views/partials/'
	}));
	// Locate the views
	app.set('views', __dirname + '/views');

	// Locate the assets
	app.use('assets', express.static(process.cwd() + '/assets'));
}

// Set Handlebars
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
// app.use('assets', express.static(process.cwd() + '/assets'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretVoteApp',
	resave: false,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
