'use strict';

var http = require('http');
var url = require('url');
var speedLogInterval = 1000;

var targetFile = process.env.TARGET_FILE + '?cacheBuster=' + Date.now();

var options = {
  hostname: url.parse(targetFile).hostname,
  path: url.parse(targetFile).pathname
};

module.exports = function (callback) {
  console.log('Beginning download of file');
  var speedLog = [];
  var results = {
    start: Date.now()
  };
  http.request(options, function (res) {
    var size = 0;
    var lastIntervalSize = 0;
    var measureSpeed = setInterval(function () {
      if (lastIntervalSize === size) return;
      speedLog.push(Math.round((size - lastIntervalSize) / (speedLogInterval) * 100) / 100);
      lastIntervalSize = size;
    }, speedLogInterval);

    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      if (size === 0) {
        results.firstByte = results.firstByte || Date.now();
      }
      size += chunk.length;
      // process.stdout.write(Math.round(size / 1024) + 'kb ');
    });

    res.on('end', function () {
      clearInterval(measureSpeed);
      results.data = {
        latency: (results.firstByte - results.start),
        dataSizeKB: size / 1024,
        avgThroughput: Math.round(size / (Date.now() - results.firstByte) * 100) / 100,
        maxThroughput: Math.max.apply(null, speedLog),
        minThroughput: Math.min.apply(null, speedLog)
      };
      console.log('Finished download of file');
      return callback(null, results.data);
    });
  }).end();
};
