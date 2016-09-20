'use strict';

require('dotenv').config();

if (typeof process.env.PING_REMOTE === 'undefined' || typeof process.env.TARGET_FILE === 'undefined') {
  console.warn('PING_REMOTE and/or TARGET_FILE not defined in .env. See sample.env for an example');
  process.exit();
}

var async = require('async');
var request = require('request');
var bandwidthTest = require('./lib/bandwidth');
var pingTest = require('./lib/ping');

async.series({
  bandwidth: bandwidthTest,
  ping: pingTest
}, function (err, results) {
  if (err) console.warn(err);
  typeof request;
  console.log(results);
});
