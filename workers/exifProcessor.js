'use strict';

var _=require('lodash');
var async = require('async');

var mongoose = require('mongoose');
var redis = require('redis'),
        redisClient = redis.createClient();

var PhotoModel=require('../packages/custom/ullr/server/models/photoSchema.js');

var Flickr = require('flickrapi'), flickrOptions = {
    nobrowser: true,
    silent: true,
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
  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB)});

  var mongoDb='fbUllr';
  mongoose.connect('mongodb://localhost/'+mongoDb);

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));

  var shutItDownMike=function(){
    mongoose.disconnect();
    redisClient.quit();
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

        //PhotoModel.findByPhotoId({ id: photo.id }, function (findErr, doc) {
        PhotoModel.findOneAndUpdate({id: photo.id},{exif: exifResults.photo.exif},{},function(findErr,doc){
          if (findErr) { console.log('error updating exif for photo:',photo.id,findErr);  return callbackPhotos(findErr); }
          console.log('updated exif for photo:',doc.id); 
        });
      });

      flickr.photos.geo.getLocation({ photo_id: photo.id }, function(findErr, geoResults){
        console.log(geoResults);

        PhotoModel.findOneAndUpdate({id: photo.id},{geo: geoResults.photo} ,{},function(findErr,doc){
          if (findErr) { console.log('error updating geo for photo:',photo.id,findErr);  return callbackPhotos(findErr); }
          console.log('updated geo for photo:',doc.id); 
        });        
      });

    }, function(errPhotos) { 
      if(errPhotos) { console.log('error while processing exifs:',errPhotos); }
      shutItDownMike(); 
    });
  };

 //CWD-- kick it off 

  console.log('calling out for exif data on photos: ',flickrOptions.user_id);

  var exec=function(flickr){
    console.log('fetching photos to process');

    redisClient.keys('photo-*', function (err, replies){
      if(err) { console.log('error fetching redis keys', err); }

      if(replies.length<1){ console.log('no photos to process'); shutItDownMike(); return; }

      var photos=new Array();

      async.each(replies, function(hash,callbackReplies){
          redisClient.hgetall(hash,function (err, obj) {

          if(err) { console.log('error getting data from redis',err); }
          else{
            console.log('popping photo:',obj);
            photos.push(obj);
            var p=new PhotoModel(obj);
            var handleError=function(err) { console.log('error saving to mongodb:',err); return callbackReplies(err); };
//console.log(p);
            console.log('saving photo to mongodb: ',p.id);
            PhotoModel.findOneAndUpdate({id: p.id},obj,{upsert:true},function(err,doc){
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
        else{ photoProcessor(flickr,photos); }

        redisClient.quit();
      });
    });
  };


  db.once('open', function (callback) {

    Flickr.authenticate(flickrOptions, function(error, flickr) {
        if(error) { console.log('error connecting to flickr',error); }
        else { 
          exec(flickr); 
        }
    });

    console.log('connected to mongo '+mongoDb+' for data loading');
  });


