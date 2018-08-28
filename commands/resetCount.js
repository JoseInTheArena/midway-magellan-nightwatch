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

function MidwayCommand () {
  events.EventEmitter.call(this);
}

Util.inherits(MidwayCommand, events.EventEmitter);

/**
 *
 * @param midwaySessionId
 * @param callback
 * @returns {MidwayCommand}
 */
MidwayCommand.prototype.command = function (midwaySessionId, callback) {
  var self = this;
  var log = CommandUtil.log;

  midwaySessionId = midwaySessionId || this.api.midwaySessionId;

  var _callback = function (err, response) {
    if (err) {
      log('resetCount.js:: Error in resetCount:', err);
    }
    callback && callback(err, response);
    self.emit("complete");
  };

  var resetURLCountPath = '/resetURLCount';
  if (midwaySessionId) {
    resetURLCountPath += ('/' + midwaySessionId);
  }

  CommandUtil.executeMockAPI({httpMethod: 'get',path:resetURLCountPath}, _callback);

  return this;
};

module.exports = MidwayCommand;
