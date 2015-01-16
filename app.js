var _ = require('lodash');
var Flickr = require("flickrapi"), flickrOptions = {
    nobrowser: true,
    silent: false,
    api_key: process.env.FlickrKey,
    secret: process.env.FlickrSecret,
    user_id: process.env.FLICKR_USER_ID,
    access_token: process.env.FLICKR_ACCESS_TOKEN,
    access_token_secret: process.env.FLICKR_ACCESS_TOKEN_SECRET
  };

console.log(flickrOptions);

  Flickr.authenticate(flickrOptions, function(error, flickr) {
    //console.log(flickr);

    flickr.photos.search({ user_id: flickrOptions.user_id }, function(err, results) {
          if(err) { throw new Error(err); }

          photos=results.photo;

          _(photos).forEach(function(photo){
            console.log('Fetching EXIF for: ',photo.title);

            flickr.photos.getExif({ photo_id: photo.id, secret: photo.secret}, function(err, exif) {
              console.log(exif);
            });
          });
      });

    });
