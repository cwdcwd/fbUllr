'use strict';

var _=require('lodash');
var mongoose = require('mongoose');
var redis = require('redis'),
        redisClient = redis.createClient();

var Flickr = require('flickrapi'), flickrOptions = {
    nobrowser: true,
    silent: false,
    force_auth: true,
    api_key: process.env.FlickrKey,
    secret: process.env.FlickrSecret,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
  };

  redisClient.on('error', function (err) {
      console.log('Error ' + err);
  });

  var iRedisPhotoDB=0;
  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB) });

  var resultsPerPage=500;

  var currentPage=1;
  var totalPages=2;

  var searchFlickr=function(flickr,page){
    try {
      flickr.photos.getWithGeoData({ user_id: flickrOptions.user_id, per_page: resultsPerPage, page: page, sort: 'date-taken-desc' }, function(err, results) {
      //flickr.photos.search({ user_id: flickrOptions.user_id, per_page: resultsPerPage, page: page }, function(err, results) { //has_geo: 1
            if(err) { console.log(err); throw new Error(err); }          
            var photos=results.photos.photo;
            totalPages=results.photos.pages;
  console.log('page '+currentPage+' of '+totalPages+' for photo count of '+results.photos.total);
            _(photos).forEach(function(photo){
              console.log('pushing photo to queue for processing');
              redisClient.lpush('photo-'+photo.id,photo)
            });

            ++currentPage;
            
            if(currentPage<=totalPages){
              searchFlickr(flickr,currentPage);
            }
            else{
              redisClient.quit();
            }
        });
    } catch (e) { console.log(e); } 
  }


  //CWD-- kick it off 

  console.log('calling out for data on user: ',flickrOptions.user_id);

  Flickr.authenticate(flickrOptions, function(error, flickr) {
      if(error) { console.log(error); }
      else { searchFlickr(flickr,currentPage); }
  });   


