'use strict';


var _=require('lodash');

var resultsPerPage=500;
var currentPage=1;
var totalPages=2;
var serviceUser=null;
var redisClient=null;

var Flickr = require('flickrapi'), flickrOptions = {
    nobrowser: true,
    silent: false,
    force_auth: true,
    api_key: process.env.FlickrKey,
    secret: process.env.FlickrSecret /*,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET */
  };



  var searchFlickr=function(flickr,page){
    try {
      flickr.photos.getWithGeoData({ user_id: flickrOptions.user_id, per_page: resultsPerPage, page: page, sort: 'date-taken-desc' }, function(err, results) {
      //flickr.photos.search({ user_id: flickrOptions.user_id, per_page: resultsPerPage, page: page }, function(err, results) { //has_geo: 1
            if(err) { 
            	console.log(err); 
            	//throw new Error(err); 
            	return err;
            }

            var photos=results.photos.photo;
            totalPages=results.photos.pages;
  console.log('page '+currentPage+' of '+totalPages+' for photo count of '+results.photos.total);
            _(photos).forEach(function(photo){
              console.log('pushing photo to queue for processing');
              photo.serviceUser=serviceUser;
              redisClient.hmset('photo-'+photo.id,photo);
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


  module.exports = function(ServiceUser,RedisClient){
  	flickrOptions.user_id=ServiceUser.serviceUserId;
  	flickrOptions.access_token=ServiceUser.authUserToken;
  	flickrOptions.access_token_secret=ServiceUser.authTokenSecret;
  	serviceUser=ServiceUser;
  	redisClient=RedisClient;
  };

  module.exports.process=function(callback){
  	console.log('calling out for data on user: ',flickrOptions.user_id);
console.log(flickrOptions);
	Flickr.authenticate(flickrOptions, function(error, flickr) {
	    if(error) { console.log(error); callback(error); }
	    else { searchFlickr(flickr,currentPage); callback(); }
	  });
	};

