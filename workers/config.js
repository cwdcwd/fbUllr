'use strict';

var redis = require('redis');

var isProduction=(process.env.NODE_ENV==='production');
var flickrProcessor=require('./flickr/photoProcessor');
var flickrExifProcessor=require('./flickr/exifProcessor');
//var meanConfig=require('../config/env/'+(isProduction?'production':'development')+'.js');

var settings={
		services: ['flickr'],
		redisDBs: {
			flickr: 0,
			facebook: 1
		}
};


module.exports =settings; 

module.exports.getProcessor=function(ServiceName,ServiceUser,RedisClient){
  if(ServiceName==='flickr'){
  	console.log('getting processor for:',ServiceName);
    return new flickrProcessor(ServiceUser,RedisClient);
  }

  return null;
};

module.exports.getExifProcessor=function(ServiceName,ServiceUser,RedisClient){
  if(ServiceName==='flickr'){
  	console.log('getting exif processor for:',ServiceName);
  	return new flickrExifProcessor(ServiceUser,RedisClient);
  }

  return null;
};

module.exports.getMongoDbURL=function(){
  if(process.env.MONGOLAB_URI){
    return process.env.MONGOLAB_URI;
  }

  return 'mongodb://localhost/mean-dev';
};

module.exports.getRedisClient=function(){
  //redis://redistogo:2d0d685d368fa17bc2e747191f8b62de@cod.redistogo.com:10630/
  var strPass=(process.env.RedisPass?process.env.RedisPass:null);
  return redis.createClient(process.env.RedisPort,process.env.RedisHost,{auth_pass: strPass });
};
