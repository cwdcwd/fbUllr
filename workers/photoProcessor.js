'use strict';

var _=require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var redis = require('redis'), redisClient = redis.createClient();
var ServiceUserModel=require('../packages/custom/ullr/server/models/serviceUser');
var flickrProcessor=require('./flickrProcessor');
var aServices=['flickr'];
var iRedisPhotoDB=0;
var mongoDb='fbUllr';
var db = mongoose.connection;

  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB) });
  redisClient.on('error', function (err) { console.log('Error ' + err); });


  mongoose.connect('mongodb://localhost/'+mongoDb);
  db.on('error', console.error.bind(console, 'connection error:'));

  async.each(aServices,function(serviceName,callbackServices){ //CWD-- loop all services
    console.log('processing: ',serviceName);

    if(serviceName==='flickr'){ //CWD-- process flickr. Maybe do these by dependency injection later?
      console.log('searching for all users on service:',serviceName);
      ServiceUserModel.find({ serviceName: serviceName },'serviceUserId authUserToken authSecretToken', function (err, serviceUsers) { //CWD-- find all the flickr users
        if(err) { console.log('error finding '+serviceName+' service users: ',err); return callbackServices(err)} 

        console.log('looping through found users', serviceUsers);

        async.each(serviceUsers,function(serviceUser,callbackUsers){
          console.log('beginning to process account: ',serviceUser.serviceUserId);
          flickrProcessor(serviceUser.serviceUserId,serviceUser.authTokenSecret,serviceUser,redisClient);
          flickrProcessor.process(callbackUsers);
        },function(err) {
          console.log('error processing '+serviceName+' service users: ',err);
        });
      });
    }

    callbackServices();

  }, function(err){
    console.log('error processing services: ',err);
  });
