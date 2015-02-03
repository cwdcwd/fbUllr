'use strict';

var options= {
      nobrowser: true,
      silent: false,
      force_auth: true,
      api_key: process.env.FlickrKey,
      secret: process.env.FlickrSecret 
  };


module.exports.options = options;