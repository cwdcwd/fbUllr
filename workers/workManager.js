'use strict';

var config=require('./config');
var _=require('lodash');
var async = require('async');
var mongoose = require('mongoose');

var logger = require('logfmt');
var throng = require('throng');
var worker=require('./worker.js');




function start() {
  logger.log({
    type: 'info',
    msg: 'starting worker',
    concurrency: int(process.env.CONCURRENCY) || 1
  });

  var instance = worker(config);

  function beginWork() {
    instance.on('lost', shutdown);
    logger({ type: 'info', msg: 'starting work' } );
    instance.startProcessing();
  }

  function shutdown() {
    logger.log({ type: 'info', msg: 'shutting down' });
    process.exit();
  }


  instance.on('ready', beginWork);
  process.on('SIGTERM', shutdown);

};

throng(start, { workers: int(process.env.WORKER_CONCURRENCY) || 1 });


function int(str) {
  if (!str) return 0;
  return parseInt(str, 10);
}