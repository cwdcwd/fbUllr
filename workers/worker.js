'use strict';

var logger = require('logfmt');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var connectionManager=require('./connectionManager');

function App(config) {
  EventEmitter.call(this);

  this.config=config;
  this.services=config.services;
  this.connectionManager=connectionManager(config.getMongoDbURL());
  this.connectionManager.once('ready', this.onConnected.bind(this));
  this.connectionManager.once('lost', this.onLost.bind(this));
}


App.prototype = Object.create(EventEmitter.prototype);


App.prototype.onConnected = function() {
	logger.log({ type: 'info', msg: 'connected'});
	this.onReady();
}

App.prototype.onReady = function() {
	logger.log({ type: 'info', msg: 'app.ready' });
	this.emit('ready');
};

App.prototype.onLost = function() {
	logger.log({ type: 'info', msg: 'app.lost db conn' });
	this.emit('lost');
};

App.prototype.onServiceComplete=function(){
	logger.log({ type: 'info', msg: 'app.service.complete' });
	this.emit('service.complete');
}

App.prototype.processService=function(ServiceType){
	if(ServiceType==='flickr'){ //CWD-- process flickr. Maybe do these by dependency injection later?
		logger.log({ type: 'info', msg: 'starting processing: '+ServiceType });

		logger.log({ type: 'info', msg: 'complete processing: '+ServiceType });
		this.onServiceComplete();
	}
}

App.prototype.processNext=function(){
	if(this.config.services.length>0){
		this.processService(this.config.services.pop());
	}
}


App.prototype.startProcessing=function(){
	this.processNext();
}


module.exports = function createApp(config) {
  return new App(config);
};