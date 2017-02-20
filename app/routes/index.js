'use strict';

var path = process.cwd();
// var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');
var PollHandler = require(path + '/app/controllers/indexHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	// var clickHandler = new ClickHandler();
	var pollHandler = new PollHandler();

	// bodyparser
	var bodyParser = require('body-parser');
	// app.use(require('body-parser')()); // to process form post request in request body <-- deprecated

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render('index', {
				welcome: true
			});
		});

	app.route('/login')
		.get(function (req, res) {
			res.render('login', {
				welcome: false
			});
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render('profile');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/myPolls')
		.get(isLoggedIn, function (req, res) {
			res.render('myPolls', {
				welcome: true
			});
		})

	app.route('/allPolls')
		.get(isLoggedIn, function (req, res) {
			res.render('myPolls', {
				welcome: true
			});
		})

	// app.route('/' + url + '/' + ':name', function (req, res) {
	// 	var name = req.params.name;
	// 	res.render(url + '/' + name);
	// });


	app.route('/myPollsData')
		.get(isLoggedIn, pollHandler.getPolls);

	app.route('/delteData/:id')
		.delete(isLoggedIn, function (req, res) {
			pollHandler.deletePoll(req, res, req.params.id)
		});

	app.route('/pollSubmitted')
		.post(isLoggedIn, pollHandler.addPoll);

	app.route('/polls/:id')
		.get(isLoggedIn, function (req, res) {
			console.log('req.params.id', req.params.id);
			pollHandler.findPoll(req, res, req.params.id);
		});

/*
	app.get('/polls/*', function (req, res) {
		var page = pagesfromdb[key];
		if (page != null) {
			res.render(page.render, page.language)
		}
		else {
			res.send(404);
		}
	});
*/

	// custom 404 page
	app.use(function (req, res) {
		console.log(res);
		res.status(404);
		res.render('404');
	})

	// custom 500 page
	app.use(function (err, req, res, next) {
		console.error(err.stack);
		res.status(500);
		res.render('500');
	})

};