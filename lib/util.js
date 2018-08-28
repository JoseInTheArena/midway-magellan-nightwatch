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
var fs = require('fs');
var Wreck = require('wreck');
var minimist = require('minimist');

var MIDWAY_API_PATH = '/midway/api';

var DEFAULT_SESSION_FACTOR = 20.0;

var UTIL = module.exports = {
  executeMockAPI: function (options, callback) {
    var wreckOptions = {
      baseUrl: 'http://localhost:' + this.getMidwayPort(),
      headers: {
        referer: 'http://localhost:' + this.getAppPort() + '/'
      },
      payload: options.payload && JSON.stringify(options.payload)
    };
    var url = MIDWAY_API_PATH + options.path;

    if (options.appendMidwaySessionId === undefined) {
      options.appendMidwaySessionId = true;
    }

    if (options.midwaySessionId && options.appendMidwaySessionId) {
      url += '-' + options.midwaySessionId;
    }
    UTIL.log('Executing API:' + url);
    var httpMethod = options.httpMethod || 'post';

    Wreck.request(httpMethod, url, wreckOptions, function (err, res) {
      if (err) {
        UTIL.log('Error in wreck request' , err.message);
      }
      Wreck.read(res, null, callback);
    });
  },

  initProxyApi: function (proxyApi) {
    this.proxyApi = proxyApi;
  },

  getAppPort: function () {
    return process.env.APP_SERVER_PORT;
  },

  getMidwayPort: function () {
    return process.env.MOCK_SERVER_PORT;
  },

  getMidwayHttpsPort: function (midwayHttpsPort) {
    return process.env.MOCK_SERVER_HTTPSPORT;
  },

  setAppPort: function (port) {
    process.env.APP_SERVER_PORT = port;
  },

  setMidwayPort: function (midwayPort) {
    process.env.MOCK_SERVER_PORT = midwayPort;
  },

  setMidwayHttpsPort: function (midwayHttpsPort) {
    process.env.MOCK_SERVER_HTTPSPORT = midwayHttpsPort;
  },

  calculateSessions: function (workerCount, factor) {
    workerCount = parseInt(workerCount, 10);
    if (!isNaN(workerCount) && workerCount > 0) {
      factor = (parseFloat(factor) || DEFAULT_SESSION_FACTOR)/ 100;
      return Math.round(workerCount + (workerCount * factor));
    }
  },

  log: function (message) {
    if (module.exports.logFile) {
      try {
        fs.appendFileSync(module.exports.logFile, decorateLogMessage(message), { encoding: 'utf8' });
      } catch (e) {
        console.log(e.message);
      }
    }
  },

  proxyApi: this.proxyApi
};

function decorateLogMessage(message) {
  var testNameMsg = '';
  var testName = minimist(process.argv).test;
  if (testName) {
    testNameMsg = '[ Test: ' + testName + '] ';
  }

  return new Date().toUTCString()  + ' ' + testNameMsg + message + '\n';
}
