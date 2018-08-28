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
var util = require('./util');
var minimist = require('minimist');

module.exports = function (options) {

  if (!options) {
    throw new Error('Missing options in nightwatch init');
  }

  util.logFile = options.logFile;

  var log = util.log || console.log;

  log('nightwatch-handler.js:: nightwatch handler');

  var setup = options.start;
  var teardown = options.stop;

  return {
    before: function (done) {
      log('nightwatch-handler.js:: before');

      if (setup) {
        var opts = {
          log: log
        };

        setup(opts, function (err) {

          if (err) {
            return done(err);
          }

          // FOR NO SESSIONS
          if (options.midwayOptions) {
            util.setAppPort(options.midwayOptions.appPort); // Set it in environment , port is needed to make API calls to Midway server
            util.setMidwayPort(options.midwayOptions.port);
            util.setMidwayHttpsPort(options.midwayOptions.httpsPort);
          }

          global.appPort = util.getAppPort(); //Set global appPort

          return done();
        });
      } else {
        return done();
      }
    },

    after: function (done) {
      log('nightwatch-handler.js::  after');
      if (teardown) {
        teardown({log: log}, done);
      } else {
        return done();
      }
    }
  };
};
