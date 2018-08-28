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
var CommandUtil = require('../../lib/util');
var Sinon = require('sinon');
var Wreck = require('wreck');
var readStub;
var requestStub;

beforeEach(function (done) {
  tests.setup();
  done();
});

afterEach(function (done) {
  tests.cleanup();
  done();
});

var tests = module.exports = {
  readStub: readStub,

  requestStub: requestStub,

  setup: function () {
    CommandUtil.setAppPort(10000);
    CommandUtil.setMidwayPort(10002);
    CommandUtil.setMidwayHttpsPort(10003);
  },

  getReadStub: function (res) {
    this.readStub = Sinon.stub(Wreck, 'read').yields(null, res);
    return this.readStub;
  },

  getReadStubWithError: function (res) {
    this.readStub = Sinon.stub(Wreck, 'read').yields('Error in read');
    return this.readStub;
  },

  getRequestStub: function (res) {
    this.requestStub = Sinon.stub(Wreck, 'request').yields(null, res);
    return this.requestStub;
  },

  getRequestStubWithError: function () {
    this.requestStub = Sinon.stub(Wreck, 'request').yields('Error in request');
    return this.requestStub;
  },

  cleanup: function () {
    this.readStub.restore();
    this.requestStub.restore();
    CommandUtil.initProxyApi();
  }
}
