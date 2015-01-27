'use strict';

var mongoose = require('mongoose'),	Schema = mongoose.Schema;

var ServiceUserSchema = mongoose.Schema({
	created: {
		type: Date,
		default: Date.now
	},
    user: {
	    type: Schema.ObjectId,
	    ref: 'User'
	},
	serviceName: {
		type: String,
	    required: true,
	    trim: true
	},
	serviceUserId: {
		type: String,
	    required: true,
	    trim: true
	},
	authUserToken: {
		type: String,
	    required: true,
	    trim: true
	},
	authTokenSecret: {
		type: String,
	    required: true,
	    trim: true
	}
});

module.exports = mongoose.model('ServiceUser', ServiceUserSchema);