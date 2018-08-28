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
 * Set a route to have a specific variant.
 * The route id and variant id can be seen (if looking at the "Paths" view)...
 * Usage: client.setMockVariant({ route: `route id`, variant: `variant id` })
 */

function MockCommand () {
    events.EventEmitter.call(this);
}

Util.inherits(MockCommand, events.EventEmitter);

/**
 *
 * @param options
 * @param callback
 * @returns {MockCommand}
 */
MockCommand.prototype.command = function (options, callback) {
    var self = this;
    var log = CommandUtil.log;

    var _callback = function (err, response) {
      if (err) {
        log('setVariantInput.js:: Error in setVariantInput:', err);
      }

      callback && callback(err, response);
      self.emit('complete');
    };

    log('setVariantInput.js:: Setting variant input');
    CommandUtil.executeMockAPI({path:'/route/' + encodeURIComponent(options.route || options.fixture),
    payload:{
        input: {
            variant: options.input
        }
    },
    midwaySessionId:options.midwaySessionId}, _callback);

    return this;
};

module.exports = MockCommand;
