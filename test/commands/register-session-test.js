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
var Expect = require('chai').expect;
var Sinon = require('sinon');
var RegisterSession = require('../../commands/registerSession');
var TestSetup = require('./test-setup');

describe('Register Session Test', function () {
  var readStub;
  var requestStub;

  it('should register session if available', function (done) {
    var res = JSON.stringify({
      session: 123
    });

    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var registerSession = new RegisterSession();
    registerSession.command(function (err, response) {
      Expect(err).to.equal(null);
      Expect(JSON.parse(response)).to.equal(123);
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/registerSession',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });
      done();
    });
  });

  it('should NOT register session if NOT available', function (done) {
    var res = JSON.stringify({
      session: 'NOT_AVAILABLE'
    });
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var registerSession = new RegisterSession();
    registerSession.command(function (err, response) {
      Expect(err).to.not.equal(null);
      Expect(response).to.equal(undefined);
      Expect(err.message).to.equal('No sessions available');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/registerSession',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });
      done();
    });
  });
});
