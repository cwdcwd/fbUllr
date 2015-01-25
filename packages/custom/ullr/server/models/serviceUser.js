'use strict';

var mongoose = require('mongoose')

var ServiceUserSchema = mongoose.Schema({
    name: String
});

module.exports = mongoose.model('ServiceUser', ServiceUserSchema);