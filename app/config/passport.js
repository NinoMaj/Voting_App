'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	/**
	 * Sign in with Google.
	 */
	passport.use(new GoogleStrategy({
		clientID: process.env.GOOGLE_KEY,
		clientSecret: process.env.GOOGLE_SECRET,
		callbackURL: '/auth/google/callback',
		passReqToCallback: true
	}, (req, accessToken, refreshToken, profile, done) => {
		console.log('profile in Google strategy', profile);
		if (req.user) {
			User.findOne({ google: profile.id }, (err, existingUser) => {
				if (err) { return done(err); }
				if (existingUser) {
					// req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
					console.log('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.1')
					done(err);
				} else {
					User.findById(req.user.id, (err, user) => {
						if (err) { return done(err); }
						user.google = profile.id;
						user.tokens.push({ kind: 'google', accessToken });
						user.profile.name = user.profile.name || profile.displayName;
						user.profile.gender = user.profile.gender || profile._json.gender;
						user.profile.picture = user.profile.picture || profile._json.image.url;
						user.save((err) => {
							req.flash('info', { msg: 'Google account has been linked.' });
							done(err, user);
						});
					});
				}
			});
		} else {
			User.findOne({ google: profile.id }, (err, existingUser) => {
				if (err) { return done(err); }
				if (existingUser) {
					return done(null, existingUser);
				}
				// profile.emails[0].value
				User.findOne({ email: profile.email}, (err, existingEmailUser) => {
					if (err) { return done(err); }
					if (existingEmailUser) {
						// req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
						console.log('There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.')
						done(err);
					} else {
						const user = new User();
						user.email = profile._json.email // i ovdje promijeniti
						user.google = profile.id;
						user.tokens.push({ kind: 'google', accessToken });
						user.profile.name = profile.displayName;
						user.profile.gender = profile._json.gender;
						user.profile.picture = profile._json.image.url;
						user.save((err) => {
							done(err, user);
						});
					}
				});
			});
		}
	}));

	/**
	* Sign in with GitHub.
	 */
	passport.use(new GitHubStrategy({
		clientID: process.env.GITHUB_KEY,
		clientSecret: process.env.GITHUB_SECRET,
		callbackURL: '/auth/github/callback',
		passReqToCallback: true
	}, (req, accessToken, refreshToken, profile, done) => {
		console.log('profile in Github strategy', profile);
		if (req.user) {
			User.findOne({ github: profile.id }, (err, existingUser) => {
				if (existingUser) {
					// req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
					console.log('There is already a Github account that belongs to you. Sign in with that account or delete it, then link it with your current account.')
					done(err);
				} else {
					User.findById(req.user.id, (err, user) => {
						if (err) { return done(err); }
						user.github = profile.id;
						user.tokens.push({ kind: 'github', accessToken });
						user.profile.name = user.profile.name || profile.displayName;
						user.profile.picture = user.profile.picture || profile._json.avatar_url;
						user.profile.location = user.profile.location || profile._json.location;
						user.profile.website = user.profile.website || profile._json.blog;
						user.save((err) => {
							req.flash('info', { msg: 'GitHub account has been linked.' });
							done(err, user);
						});
					});
				}
			});
		} else {
			User.findOne({ github: profile.id }, (err, existingUser) => {
				if (err) { return done(err); }
				if (existingUser) {
					return done(null, existingUser);
				}
				User.findOne({ email: profile._json.email }, (err, existingEmailUser) => {
					if (err) { return done(err); }
					if (existingEmailUser) {
						// req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
						console.log('There is already a Github account that belongs to you. Sign in with that account or delete it, then link it with your current account.')
						done(err);
					} else {
						const user = new User();
						user.email = profile._json.email;
						user.github = profile.id;
						user.tokens.push({ kind: 'github', accessToken });
						user.profile.name = profile.displayName;
						user.profile.picture = profile._json.avatar_url;
						user.profile.location = profile._json.location;
						user.profile.website = profile._json.blog;
						user.save((err) => {
							done(err, user);
						});
					}
				});
			});
		}
	}));

};
