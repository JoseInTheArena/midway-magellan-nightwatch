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
var Util = require('util');
var CommandUtil = require('../lib/util');
var events = require('events');
/**
 * Close session
 * Usage: client.closeSession(midwaySessionId, callback)
 */

function MidwayCommand () {
    events.EventEmitter.call(this);
}

Util.inherits(MidwayCommand, events.EventEmitter);

/**
 *
 * @param midwaySessionId - midway session id to close
 * @param callback
 * @returns {MidwayCommand}
 */
MidwayCommand.prototype.command = function (midwaySessionId, callback) {
    var self = this;
    var log = CommandUtil.log;
    var _callback = function (err, response) {
        callback && callback(err, response);
        self.emit('complete');
    };
    log('closeSession.js:: Closing session ' + midwaySessionId);

    // Send mocksPort information to Midway (NOTE: This is a temporary solution until we refactor midway-magellan-nightwatch to be dependent on Midway
    var closeSessionPath = '/closeSession/' + midwaySessionId + '?mocksPort=' + CommandUtil.getMidwayPort();
    log('closeSession.js:: closeSessionPath::' + closeSessionPath)
    CommandUtil.executeMockAPI({httpMethod: 'get',path: closeSessionPath},
        function (err, response) {
            if (err) {
              log('closeSession.js:: Unable to close session :' + err.message);
              return _callback('Unable to close session :' + err.message);
            }

            try {
              var resJson = JSON.parse(response.toString());
              var sessionState = resJson.session;
              // Dont throw error if session is not closed as it is part of cleanup ?
              if (!sessionState) {
                log('closeSession.js:: Error in closing session. Could not retrieve session string from response');
                return _callback(null, 'Error in closing session. Could not retrieve session string from response');
              } else {
                if (sessionState !== 'AVAILABLE') {
                  log('closeSession.js:: Could not close session ' + midwaySessionId + ' , Current state:' + sessionState);
                  return _callback(null, 'Could not close session ' + midwaySessionId + ' , Current state:' + sessionState);
                } else {
                  log('closeSession.js:: Successfully closed session ' + midwaySessionId + ' , state changed to: ' + sessionState);
                  return _callback(null, 'Successfully closed session ' + midwaySessionId + ' , state changed to: ' + sessionState);
                }
              }
            } catch (e) {
              log('closeSession.js:: Error in parsing JSON response from /closeSession :' + e.message);
              return _callback(null, 'Error in parsing JSON response from /closeSession :' + e.message);
            }

        });
    return this;
};

module.exports = MidwayCommand;
