/**
* MIT License
*
* Copyright (c) 2018-present, Walmart Inc.,
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*
*/
var Q = require('q');
var util = require('./util');

// in case the mock server start statically... this global var can be evaluated
global.suppressMockServer = true;

module.exports = function (options) {

  if (!options) {
    throw new Error('Missing options in magellan init');
  }

  util.logFile = options.logFile;
  var log = util.log || console.log;

  log('magellan-handler.js:: creating magellan global setup/teardown class');

  var setup = options.before;
  var teardown = options.after;

  var SetupTeardown = function () {
  };
  SetupTeardown.prototype = {

    initialize: function (magellanGlobal) {
      log('magellan-handler.js:: initialize');
      log('magellan-handler.js:: Got worker amount from Magellan:' + magellanGlobal.workerAmount);
      var deferred = Q.defer();

      var opts = {
        log: log
      };

      // Set workers passed from Magellan
      if (magellanGlobal && magellanGlobal.workerAmount) {
        opts.workers = magellanGlobal.workerAmount;
      }

      log('magellan-handler.js:: starting setup: ');
      setup(opts, function (err) {
        if (err) {
          log('magellan-handler.js:: Error in setup ' , err.message);
          return deferred.reject(err);
        } else {
          // FOR PARALLEL SESSIONS
          if (options.midwayOptions) {
            log('magellan-handler.js:: App server port:' + options.midwayOptions.appPort + ' , Mocks Port:' +
              options.midwayOptions.port + ' , Mocks Https port:' + options.midwayOptions.httpsPort);

            util.setAppPort(options.midwayOptions.appPort);
            util.setMidwayPort(options.midwayOptions.port);
            util.setMidwayHttpsPort(options.midwayOptions.httpsPort);
          }
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

    flush: function () {
      log('magellan-handler.js:: magellan handler: flush');
      var deferred = Q.defer();

      if (teardown) {
        teardown({log: log}, function (err) {
          if (err) {
            log('magellan-handler.js:: teardown error' + err.message);
          }
          deferred.resolve();
        });
      } else {
        log('magellan-handler.js:: no teardown function.  magellan global teardown complete');
        deferred.resolve();
      }

      return deferred.promise;
    }
  };

  return SetupTeardown;
};
