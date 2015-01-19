var _=require('lodash');
var mongoose = require('mongoose');
var redis = require("redis"),
        redisClient = redis.createClient();

var Flickr = require("flickrapi"), flickrOptions = {
    nobrowser: true,
    silent: false,
    force_auth: true,
    api_key: process.env.FlickrKey,
    secret: process.env.FlickrSecret,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
  };

  redisClient.on("error", function (err) {
      console.log("Error " + err);
  });


  var iRedisPhotoDB=0;
  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB) });


  mongoose.connect('mongodb://localhost/fbUllr');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function (callback) {
    console.log('connected to mongo for data loading');
  });


  var photoProcessor=function(flickr,photos){
    _(photos).forEach(function(photo){
      // flickr.photos.getInfo({ photo_id: photo.id, secret: photo.secret}
      // flickr.photos.getWithGeoData( 

      console.log('Fetching EXIF for: ',photo.title, photo.id, photo.secret);

      flickr.photos.getExif({ photo_id: photo.id, secret: photo.secret}, function(err, exifResults) {
        var camera=exifResults.photo.camera;
        var exifs=exifResults.photo.exif;

        _(exifs).forEach(function(exif){
          console.log(exif);
        });              
      });
    });
  };

 //CWD-- kick it off 

  console.log('calling out for exif data on photos: ',flickrOptions.user_id);


  redisClient.hkeys('photo-*', function (err, replies){
    console.log(replies.length + " replies:");
  });

  redisClient.quit();

  //query redis.
  //process data
/*
  Flickr.authenticate(flickrOptions, function(error, flickr) {
      if(error) { console.log(error); }
      else { searchFlickr(flickr,currentPage); }
  });

*/