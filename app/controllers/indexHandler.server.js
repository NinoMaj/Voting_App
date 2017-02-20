'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler() {
// 	let author = Users
// 		.find({ 'username': "Dummy string" }, { '_id': false })
// 		.exec(function (err, result) {
// 			if (err) { throw err; }
// 			console.log('in this.getPolls result:', result);
// 			res.json(result);
// 		});
// };
	var path = process.cwd();
	this.getPolls = function (req, res) {
		Polls
			.find({ 'author': req.user.github.displayName }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				console.log('in this.getPolls result:', result);
				res.json(result);
			});
	};

	this.addPoll = function (req, res) {
		console.log('req.user.github.displayName', req.user.github.displayName);
		console.log('req.body:', typeof req.body, req.body);
		let options = [];
		for (let key in req.body) {
			if (req.body.hasOwnProperty(key) && key != 'pollName') {
				options.push(req.body[key])
			}
		}
		console.log('options', options);
		let author = req.user.github.displayName;
		let votes = new Array(Object.keys(options).length);
		votes.fill(0, 0, Object.keys(options).length);
		let user_voted = [""];
		let date_created = Date.now;
		// newPoll[req.body.pollName].URL = req.user.github.username + "/" + req.body.pollName;
		let newPoll = new Polls({
			pollName: req.body.pollName,
			author: req.user.github.displayName,
			options: options,
			votes: votes,
			users_voted: [""],
			date_created: Date.now()
		});

		newPoll.save(function (err) {
			if (err) throw err;
			console.log('Poll saved successfully!');
		});

		res.render('pollSubmitted', {
			welcome: true
		});
	};

	this.findPoll = function (req, res, reqRoute) {
		// console.log('in this.findPoll reqRoute:', reqRoute);
		Polls
			.findOne({ pollName: reqRoute }, { '_id': false })
			.exec(function (err, result) {
				if (err) { throw err; }
				console.log('in this.findPoll result:', result);
				let jsonData = JSON.stringify(result);
				if (result != null) {
					res.render('polls/poll', {
						result,
						reqRoute,
						// encodedJson: encodeURIComponent(JSON.stringify(jsonData)),
						welcome: true
					})
				}
				else {
					res.status(404);
					res.render('404');
				}
			});
	};

	this.deletePoll = function (req, res, reqRoute) {
		console.log('in deletePoll handler req', reqRoute);
		Polls
			.findOneAndRemove({ pollName: reqRoute }, function (err, result) {
				if (err) { throw err; };
				console.log('Removed! Result after removal:', result)
			})
		res.end();
	};

	// this.addOption = function (req, res) {
	// 	Users
	// 		.findOneAndUpdate({ 'github.id': req.user.github.id }, { $inc: { 'nbrClicks.clicks': 1 } })
	// 		.exec(function (err, result) {
	// 				if (err) { throw err; }

	// 				res.json(result.nbrClicks);
	// 			}
	// 		);
	// };

	// this.resetClicks = function (req, res) {
	// 	Users
	// 		.findOneAndUpdate({ 'github.id': req.user.github.id }, { 'nbrClicks.clicks': 0 })
	// 		.exec(function (err, result) {
	// 				if (err) { throw err; }

	// 				res.json(result.nbrClicks);
	// 			}
	// 		);
	// };

}

module.exports = PollHandler;
