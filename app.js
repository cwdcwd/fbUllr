var _=require('lodash');
var mongoose = require('mongoose');

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

  mongoose.connect('mongodb://localhost/fbUllr');

  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function (callback) {
    console.log('connected to mongo');
  });

  var resultsPerPage=500;

  var currentPage=1;
  var totalPages=2;

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

  var searchFlickr=function(flickr,page){
    //has_geo: 1
    flickr.photos.search({ user_id: flickrOptions.user_id, per_page: resultsPerPage, page: page }, function(err, results) {
          if(err) { console.log(err); throw new Error(err); }          
          var photos=results.photos.photo;
          totalPages=results.photos.pages;
console.log('page '+currentPage+' of '+totalPages+' for photo count of '+results.photos.total);
          //photoProcessor(flickr,photos);

          ++currentPage;

          
          if(currentPage<=totalPages){
            searchFlickr(flickr,currentPage);
          }
      });
 
  }


  //CWD-- kick it off 

  console.log('calling out for data on user: ',flickrOptions.user_id);

  Flickr.authenticate(flickrOptions, function(error, flickr) {
      if(error) { console.log(error); }
      else { searchFlickr(flickr,currentPage); }
  });   


