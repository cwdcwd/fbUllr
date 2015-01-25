'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  ServiceUser = mongoose.model('ServiceUser');
 // _ = require('lodash');




exports.create = function(req, res) {
  var serviceUser = new ServiceUser(req.body);
  serviceUser.user = req.user;

  serviceUser.save(function(err) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot save the serviceUser'
      });
    }
    res.json(serviceUser);

  });
};


/**
 * List of ServiceUsers
 */
exports.all = function(req, res) {
  ServiceUser.find().sort('-created').populate('user', 'name username').exec(function(err, serviceUsers) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the serviceUsers'
      });
    }
    res.json(serviceUsers);

  });
};
