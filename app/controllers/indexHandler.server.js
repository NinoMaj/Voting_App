'use strict';

var Users = require('../models/users.js');
var Polls = require('../models/polls.js');

function PollHandler() {
	var path = process.cwd();

	// getting all polls from logged in user
	this.getPolls = function (req, res) {
		Polls
			.find({ 'author': req.user.profile.name })
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	// getting all polls
	this.getAllPolls = function (req, res) {
		Polls
			.find({})
			.exec(function (err, result) {
				if (err) { throw err; }
				res.json(result);
			});
	};

	// adding new poll
	this.addPoll = function (req, res) {
		let options = [];
		for (let key in req.body) {
			if (req.body.hasOwnProperty(key) && key != 'pollName') {
				options.push(req.body[key])
			}
		}
		let author = req.user.profile.name;
		let votes = new Array(Object.keys(options).length);
		votes.fill(0, 0, Object.keys(options).length);
		let user_voted = [""];
		let date_created = Date.now;

		// reating new poll 
		let newPoll = new Polls({
			pollName: pollName,
			author: req.user.profile.name,
			options: options,
			votes: votes,
			users_voted: [],
			date_created: Date.now()
		});

		// saving new poll in db
		newPoll.save(function (err, poll) {
			if (err) throw err;
			console.log('Poll saved successfully!');
			res.render('pollSubmitted', {
				welcome: true,
				URLname: pollName,
				URL: process.env.APP_URL + 'polls/' + poll._id
			});
		});

	};

	// adding vote
	this.addVote = function (req, res, callback) {
		Polls.findById(req.params.pollId, function (err, poll) {
			if (err) throw err;

			// save poll
			function save() {
				poll.save(function (err) {
					if (err) throw err;
					console.log('Poll successfully updated in addVote!');
					res.json(poll);
				});
			}

			// updating poll data
			function updatePoll() {
				let newVoteCount = poll.votes[req.params.optionNbr] + 1;
				poll.votes.set(req.params.optionNbr, newVoteCount);
				if (req.user) {
					poll.users_voted.push(req.user.profile.name);
				} else {
					poll.users_voted.push(ip);
				}
				save();
			}

			let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			// check if user is signed in and did he already voted
			if (req.user && !poll.users_voted.includes(req.user.profile.name)) {
				updatePoll();
				// check if guest already voted
			} else if (!req.user && !poll.users_voted.includes(ip)) {
				updatePoll();
			} else {
				res.send(false);
			}

		});
	};

	// find poll that user clicked on
	this.findPoll = function (req, res, reqRoute, callback) {
		Polls
			.findOne({ _id: reqRoute })
			.exec(function (err, result) {
				if (err) { throw err; }
				let resultStr = JSON.stringify(result);
				callback(result);
			});
	};

	// delete poll
	this.deletePoll = function (req, res, reqRoute) {
		Polls
			.findOneAndRemove({ _id: reqRoute }, function (err, result) {
				if (err) { throw err; };
				console.log('Poll removed!');
			})
		res.end();
	};

}
module.exports = PollHandler;
