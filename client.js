'use strict';

require('dotenv').config();

if (typeof process.env.PING_REMOTE === 'undefined' || typeof process.env.TARGET_FILE === 'undefined' || typeof process.env.MACHINE_NAME === 'undefined') {
  console.warn('PING_REMOTE, TARGET_FILE and MACHINE_NAME must all be environment variables or defined in .env');
  process.exit();
}

if (typeof process.env.ODDS_OF_RUNNING !== 'undefined') {
  var oddsOfRunning = parseFloat(process.env.ODDS_OF_RUNNING);
  if (oddsOfRunning < 0 || oddsOfRunning > 1 || isNaN(oddsOfRunning)) {
    console.warn('ODDS_OF_RUNNING must be >=0 and <= 1');
    process.exit();
  }
  var runScore = process.env.ODDS_OF_RUNNING - Math.random();
  if (runScore < 0) {
    console.log('Did not satisfy required odds of running');
    process.exit();
  }
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
  if (typeof process.env.REMOTE_SERVER !== 'undefined') {
    request.post(
      { url: process.env.REMOTE_SERVER,
        headers: {
          'api-key': process.env.REMOTE_API_KEY
        },
        form: {
          machine: doc.machine,
          datetime: doc.date,
          data: JSON.stringify(doc.data)
        }
      },
      function (err, httpResponse, body) {
        if (err) console.warn(err);
        if (typeof httpResponse !== 'undefined') console.log(body);
      }
    );
  }
});
