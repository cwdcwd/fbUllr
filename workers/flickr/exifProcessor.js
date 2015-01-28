'use strict';

var _=require('lodash');
var async = require('async');

var mongoose = require('mongoose');
var redis = require('redis'),
        redisClient = redis.createClient();

var PhotoModel=require('../packages/custom/ullr/server/models/photoSchema');