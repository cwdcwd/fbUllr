'use strict';

var _=require('lodash');
var async = require('async');
var mongoose = require('mongoose');
var redis = require('redis'), redisClient = redis.createClient();
var ServiceUserModel=require('../packages/custom/ullr/server/models/serviceUser');
var flickrProcessor=require('flickrProcessor');
var aServices=['flickr'];
var iRedisPhotoDB=0;

  redisClient.select(iRedisPhotoDB, function() { console.log('selected db',iRedisPhotoDB) });
  redisClient.on('error', function (err) {
      console.log('Error ' + err);
  });


  async.each(aServices,function(serviceName,callbackServices){ //CWD-- loop all services
    if(serviceName==='flickr'){ //CWD-- process flickr. Maybe do these by dependency injection later?
      ServiceUserModel.find({ serviceName: serviceName },'serviceUserId authUserToken authSecretToken', function (err, serviceUsers) { //CWD-- find all the flickr users
        if(err) { console.log('error finding '+serviceName+' service users: ',err); return callbackServices(err)} 

        async.each(serviceUsers,function(serviceUser,callbackUsers){
          flickrProcessor(serviceUser.serviceUserId,serviceUser.authTokenSecret,serviceUser,redisClient,callbackUsers);
        },function(err) {
          console.log('error processing '+serviceName+' service users: ',err);
        });
      });
    }

    callbackServices(null);

  }, function(err){
    console.log('error processing services: ',err);
  });
