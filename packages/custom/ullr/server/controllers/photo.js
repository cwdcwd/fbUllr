'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Photo = mongoose.model('Photo');
var pageLimit=100;

 // _ = require('lodash');

 /**
 * List of ServiceUsers
 */
exports.all = function(req, res) {
  var startingRecord=(req.query.page?req.query.page:0)*pageLimit;

  Photo.find().sort('-created').populate('user', 'name username').skip(startingRecord).limit(pageLimit).exec(function(err, photos) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the photos: '+err
      });
    }
    //CWD-- need to add in collection meta, ie: { metadata: { per_page: '250', page: '1' },
    res.json(photos);

  });
};


exports.allForUser = function(req, res) {
  var startingRecord=(req.query.page?req.query.page:0)*pageLimit;

  Photo.find().sort('-created').populate('user', 'name username').skip(startingRecord).limit(pageLimit).exec(function(err, photos) {
    if (err) {
      return res.status(500).json({
        error: 'Cannot list the photos: '+err
      });
    }
    //CWD-- need to add in collection meta, ie: { metadata: { per_page: '250', page: '1' },
    res.json(photos);

  });
};

exports.photo = function(req, res, next, id) {
  Photo.findByPhotoId(id, function(err, photo) {
    if (err) return next(err);
    if (!photo) return next(new Error('Failed to load photo ' + id));
    req.photo = photo;
    next();
  });
};

exports.show = function(req, res) {
  res.json(req.photo);
};

exports.near=function(req, res) {
  var distanceMultiplier=6371; //CWD-- radians to kms
  var maxDistance=(req.maxDistance?req.maxDistance:1)/distanceMultiplier; //CWD-- take a km input and divide it by arc length of 1 earth radian
  var longitude=parseFloat(req.longitude); //CWD-- checking needed around here
  var latitude=parseFloat(req.latitude); //CWD-- checking needed around here
console.log('longitude:',longitude);
console.log('latitude:',latitude);
console.log('maxDistance:',maxDistance);

  //var point = { type : 'Point', coordinates : [longitude,latitude] }; //CWD-- geonear has an issue with geoJSON I think
  Photo.geoNear([longitude,latitude], { 
      num: pageLimit,
      maxDistance : maxDistance, 
      distanceMultiplier: distanceMultiplier, 
      query: '{loc:  {$ne : null }}',
      spherical : true 
    }, function(err, results, stats) {
     console.log(results);
     console.log(stats);
     res.json(results);
  });

};