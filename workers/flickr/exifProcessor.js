'use strict';

var _=require('lodash');
var async = require('async');
var serviceUser=null;
var redisClient=null;
var mongoClient=null;

var Photo=require('../../packages/custom/ullr/server/models/photo');

var Flickr = require('flickrapi'), flickrOptions = {
		nobrowser: true,
		silent: true,
		force_auth: true,
		api_key: process.env.FlickrKey,
		secret: process.env.FlickrSecret
	};



  var photoProcessor=function(flickr,photos){
    console.log('processing found photos');

    if(photos.length<1) { return; }

    async.each(photos, function(photo,callbackPhotos){
      // flickr.photos.getInfo({ photo_id: photo.id, secret: photo.secret}
      console.log('Fetching EXIF for: ',photo.title, photo.id, photo.secret);

      flickr.photos.getExif({ photo_id: photo.id, secret: photo.secret}, function(errExif, exifResults) {
        if(errExif) { console.log('exif call failed:',errExif); return callbackPhotos(errExif); }
        var camera=exifResults.photo.camera;
        var exifs=exifResults.photo.exif;

        //Photo.findByPhotoId({ id: photo.id }, function (findErr, doc) {
        Photo.findOneAndUpdate({id: photo.id},{exif: exifResults.photo.exif},{},function(findErr,doc){
          if (findErr) { console.log('error updating exif for photo:',photo.id,findErr);  return callbackPhotos(findErr); }
          console.log('updated exif for photo:',doc.id); 
        });
      });

      flickr.photos.geo.getLocation({ photo_id: photo.id }, function(findErr, geoResults){
        console.log(geoResults);

        Photo.findOneAndUpdate({id: photo.id},{geo: geoResults.photo} ,{},function(findErr,doc){
          if (findErr) { console.log('error updating geo for photo:',photo.id,findErr);  return callbackPhotos(findErr); }
          console.log('updated geo for photo:',doc.id); 
        });        
      });

    }, function(errPhotos) { 
      if(errPhotos) { console.log('error while processing exifs:',errPhotos); }
      console.log('done processing photo set for: ',flickrOptions.user_id);
    });
  };   




module.exports.process=function(callback){
	redisClient.keys(serviceUser.serviceUserId+'-*', function (err, replies){
		if(err) { console.log('error fetching redis keys', err); return callback(err); }

		if(replies.length<1){ console.log('no photos to process'); return callback(); }
		var photos=new Array();

		async.each(replies, function(hash,callbackReplies){
			redisClient.hgetall(hash,function (err, obj) {
				if(err) { console.log('error getting data from redis',err); }
				else{
					delete obj.serviceUser;
		console.log('popping photo:',obj);
		            photos.push(obj);
		            var p=new Photo(obj);
		            var handleError=function(err) { console.log('error saving to mongodb:',err); return callbackReplies(err); };
		//console.log(p);
		            console.log('saving photo to mongodb: ',p.id);
		            Photo.findOneAndUpdate({id: p.id},obj,{upsert:true},function(err,doc){
		            //p.save(function (err) {
		              if (err) return handleError(err);
		              
		              redisClient.del(hash); //CWD-- pop off the queue
		              console.log('saved photo to mongodb: ',doc.id,'/',doc._id);
		              return callbackReplies(null);
		            });
				}
			});
		},
		function(err){ 
			if(err) { console.log('error iterating over found photos',err); }
			else{ 
			  	flickrOptions.user_id=serviceUser.serviceUserId;
			  	flickrOptions.access_token=serviceUser.authUserToken;
			  	flickrOptions.access_token_secret=serviceUser.authTokenSecret;

				Flickr.authenticate(flickrOptions, function(error, flickr) {
        			if(error) { console.log('error connecting to flickr',error); }
			        else { 
			          photoProcessor(flickr,photos); 
			        }
    			});
			}
		});

	});
};

module.exports.init=function(ServiceUser,RedisClient){
	serviceUser=ServiceUser
	redisClient=RedisClient;
}