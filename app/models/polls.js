'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var Poll = new Schema({
  pollName: String,
  author: String,
  options: [String],
  votes: [Number],
  users_voted: [String],
  date_created: Date
});

module.exports = mongoose.model('Poll', Poll);