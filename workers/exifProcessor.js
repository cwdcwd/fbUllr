'use strict';

var config=require('./config');
var _=require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var redis = require('redis'), redisClient = redis.createClient();

var aServices=config.services;
var iRedisPhotoDB=config.redisDBs.flickr;
var mongoDb=config.mongoDb;

  redisClient.on('error', function (err) {
      console.log('Error ' + err);
  });

  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB)});
  mongoose.connect('mongodb://'+config.mongoDbHost+'/'+mongoDb);
  var db = mongoose.connection;

  db.on('error', console.error.bind(console, 'connection error:'));

  var shutItDownMike=function(){
    mongoose.disconnect();
    redisClient.quit();
  };


 //CWD-- kick it off


  db.once('open', function (callback) {
    console.log('connected to mongo '+mongoDb+' for data loading');

    async.each(aServices,function(serviceName,callbackServices){ //CWD-- loop all services
      console.log('processing: ',serviceName);

      if(serviceName==='flickr'){ //CWD-- process flickr. Maybe do these by dependency injection later?
        console.log('searching for all users on service:',serviceName);
        ServiceUserModel.find({ serviceName: serviceName },'serviceUserId authUserToken authTokenSecret', function (err, serviceUsers) { //CWD-- find all the flickr users
          if(err) { console.log('error finding '+serviceName+' service users: ',err); return callbackServices(err)} 

          console.log('looping through found users', serviceUsers);

          async.each(serviceUsers,function(serviceUser,callbackUsers){
            console.log('beginning to process account: ',serviceUser.serviceUserId);
            var processor=config.getExifProcessor(serviceName,serviceUser,redisClient);
            console.log(processor);
            processor.process(callbackUsers);
          },function(err) {
            if(err){ console.log('error processing exifs on '+serviceName+' service users: ',err); }

            console.log('Done processing users');
      }
    }), function(err){
      if(err){ console.log('error processing services: ',err); }

      console.log('Done processing services');
    };

  });


