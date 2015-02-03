'use strict';

var flickrProcessor=require('./flickr/photoProcessor');
var flickrExifProcessor=require('./flickr/exifProcessor');

var settings={
		services: ['flickr'],
		redisDBs: {
			flickr: 0,
			facebook: 1
		},
		mongoDb: 'mean-dev',
		mongoDbHost: 'localhost'
};


module.exports = settings;

module.exports.getProcessor=function(ServiceName,ServiceUser,RedisClient){
  if(ServiceName==='flickr'){
  	console.log('getting processor for:',ServiceName);
  	flickrProcessor.init(ServiceUser,RedisClient)
  	return flickrProcessor;
  }

  return null;
};

module.exports.getExifProcessor=function(ServiceName,ServiceUser,RedisClient){
  if(ServiceName==='flickr'){
  	console.log('getting exif processor for:',ServiceName);
  	flickrExifProcessor.init(ServiceUser,RedisClient)
  	return flickrExifProcessor;
  }

  return null;
};

module.exports.getMongoDbURL=function(){
  if(process.env.MONGOLAB_URI){
    return process.env.MONGOLAB_URI;
  }

  return 'mongodb://'+settings.mongoDbHost+'/'+settings.mongoDb;
};