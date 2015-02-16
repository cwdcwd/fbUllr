'use strict';

var logger = require('logfmt');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var connectionManager=require('./connectionManager');

function PhotoWorker(config) {
  EventEmitter.call(this);

  this.config=config;
}


PhotoWorker.prototype = Object.create(EventEmitter.prototype);