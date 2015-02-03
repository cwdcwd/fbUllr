'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Photo = mongoose.model('Photo');
 // _ = require('lodash');

 /**
 * List of ServiceUsers
 */
exports.all = function(req, res) {
  Photo.find().sort('-created').populate('user', 'name username').exec(function(err, photos) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the photos'
      });
    }
    res.json(photos);

  });
};


exports.allForUser = function(req, res) {
  Photo.find().sort('-created').populate('user', 'name username').exec(function(err, photos) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the photos'
      });
    }
    res.json(photos);

  });
};
