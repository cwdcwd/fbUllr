'use strict';

var config=require('./config');
var _=require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var redisClient = config.getRedisClient();
var ServiceUserModel=require('../packages/custom/ullr/server/models/serviceUser');

var aServices=config.services;
var iRedisPhotoDB=config.redisDBs.flickr;
var mongoDb=config.mongoDb;
var db = mongoose.connection;

  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB) });
  redisClient.on('error', function (err) { console.log('Error ' + err); });


  mongoose.connect(config.getMongoDbURL());
  db.on('error', console.error.bind(console, 'connection error:'));

  db.once('open', function (callback) {
    async.eachSeries(aServices,function(serviceName,callbackServices){ //CWD-- loop all services
      console.log('processing: ',serviceName);

      if(serviceName==='flickr'){ //CWD-- process flickr. Maybe do these by dependency injection later?
        console.log('searching for all users on service:',serviceName);
        ServiceUserModel.find({ serviceName: serviceName },'serviceUserId authUserToken authTokenSecret', function (err, serviceUsers) { //CWD-- find all the flickr users
          if(err) { console.log('error finding '+serviceName+' service users: ',err); return callbackServices(err)} 

          console.log('looping through found users', serviceUsers);

          async.each(serviceUsers,function(serviceUser,callbackUsers){
            console.log('beginning to process account: ',serviceUser.serviceUserId);
            var processor=config.getProcessor(serviceName,serviceUser,redisClient);
            processor.process(callbackUsers);
          },function(err) {
            if(err){ console.log('error processing '+serviceName+' service users: ',err); }

            console.log('Done processing users');
          });
        });
      } else {
        //CWD-- service not supported yet. complete
      }

      callbackServices(null);
    }, function(err){
      if(err){ console.log('error processing services: ',err); }

      console.log('Done processing services');
      //CWD-- shutdown connections here?
    });
  });