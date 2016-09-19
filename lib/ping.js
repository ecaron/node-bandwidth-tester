'use strict';

var ping = require('jjg-ping');

module.exports = function(callback) {
	ping.system.ping(process.env.PING_REMOTE, function (latency, status) {
    if (status) {
      // Host is reachable/up. Latency should have a value.
      return callback(null, 'Google is reachable (' + latency + ' ms ping).');
    } else {
      // Host is down. Latency should be 0.
      return callback(null, 'Google is unreachable.');
    }
	});
};
