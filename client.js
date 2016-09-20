'use strict';

require('dotenv').config();

if (typeof process.env.PING_REMOTE === 'undefined' || typeof process.env.TARGET_FILE === 'undefined') {
  console.warn('PING_REMOTE and/or TARGET_FILE not defined in .env. See sample.env for an example');
  process.exit();
}

var async = require('async');
var request = require('request');
var Datastore = require('nedb');
var bandwidthTest = require('./lib/bandwidth');
var pingTest = require('./lib/ping');

async.series({
  bandwidth: bandwidthTest,
  ping: pingTest
}, function (err, results) {
  if (err) console.warn(err);
  typeof request;
  console.log(results);
  var doc = {
    machine: process.env.MACHINE_NAME,
    date: (new Date()).toISOString(),
    data: results
  };
  if (typeof process.env.LOCAL_HISTORY !== 'undefined') {
    var db = new Datastore({ filename: process.env.LOCAL_HISTORY, autoload: true });
    db.insert(doc, function (err) {
      if (err) console.warn(err);
      else console.log('Wrote to local datastore');
    });
  }
});
