'use strict';

var path = process.cwd();
var PollHandler = require(path + '/app/controllers/indexHandler.server.js');

module.exports = function (app, passport) {

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	var pollHandler = new PollHandler();

	// bodyparser
	var bodyParser = require('body-parser');

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render('index', {
				welcome: req.user
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
			res.json(req.user);
		});

	// github auth
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	// google auth
	app.get('/auth/google',
		passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

	app.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/login' }),
		function (req, res) {
			res.redirect('/');
		});

	app.route('/myPolls')
		.get(isLoggedIn, function (req, res) {
			res.render('myPolls', {
				welcome: req.user
			});
		})

	app.route('/allPolls')
		.get(function (req, res) {
			res.render('allPolls', {
				welcome: req.user
			});
		})

	app.route('/AllPollsData')
		.get(pollHandler.getAllPolls);

	app.route('/myPollsData')
		.get(isLoggedIn, pollHandler.getPolls);

	app.route('/deleteData/:id')
		.delete(isLoggedIn, function (req, res) {
			pollHandler.deletePoll(req, res, req.params.id);
		});

	app.route('/pollSubmitted')
		.post(isLoggedIn, function (req, res) {
			pollHandler.addPoll(req, res);
		});

	app.route('/:id')
		.get(function (req, res) {
			pollHandler.findPoll(req, res, req.params.id, function (result) {
				if (result != null) {
					res.render('poll', {
						result,
						reqRoute: req.params.id,
						resultStr: JSON.stringify(result),
						welcome: req.user
					})
				}
				else {
					res.status(404);
					res.render('404');
				}
			});
		});

	app.route('/voteAdded/:pollId/:optionNbr')
		.get(function (req, res) {
			pollHandler.addVote(req, res, function (result) {
				return result
			});
		});

	// custom 404 page
	app.use(function (req, res) {
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