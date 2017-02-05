'use strict';

var Users = require('../models/users.js');

function PollHandler() {
	var path = process.cwd();
	// this.getClicks = function (req, res) {
	// 	Users
	// 		.findOne({ 'github.id': req.user.github.id }, { '_id': false })
	// 		.exec(function (err, result) {
	// 			if (err) { throw err; }

	// 			res.json(result.nbrClicks);
	// 		});
	// };

	this.addPollName = function (req, res) {
		console.log('req.body:', typeof req.body, req.body);
		Users
			.findOneAndUpdate(
			{ 'github.id': req.user.github.id },
			{ $push: { "polls": req.body } }
			//{ safe: true, upsert: true, new: true }
			)
			.exec(function (err, result) {
				if (err) { throw err; }
				// console.log("DB updated with: " + result.polls);
				// res.json(result.polls);
				res.sendFile(path + '/public/pollSubmitted.html');
			}
			);
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
