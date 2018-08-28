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
var CloseSession = require('../../commands/closeSession');
var TestSetup = require('./test-setup');

describe('Close Session Test', function () {
  var readStub;
  var requestStub;

  it('should show AVAILABLE state for session if closed successfully', function (done) {
    var res = JSON.stringify({
      session: 'AVAILABLE'
    });

    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var closeSession = new CloseSession();
    closeSession.command('123', function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('Successfully closed session 123 , state changed to: AVAILABLE');

      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/closeSession/123?mocksPort=10002',
        { baseUrl: 'http://localhost:10002',
            headers: { referer: 'http://localhost:10000/' },
            payload: undefined });
      done();
    });
  });

  it('should show current state if session is not closed successfully', function (done) {
    var res = JSON.stringify({
      session: 'BUSY'
    });

    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var closeSession = new CloseSession();
    closeSession.command('123', function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('Could not close session 123 , Current state:BUSY');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/closeSession/123?mocksPort=10002',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });

      done();
    });
  });

  it('should show error message if session state not shown in response', function (done) {
    var res = JSON.stringify({});

    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var closeSession = new CloseSession();
    closeSession.command('123', function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('Error in closing session. Could not retrieve session string from response');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/closeSession/123?mocksPort=10002',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });

      done();
    });
  });

  it('should throw error message if response is not parseable', function (done) {
    var res = '';

    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var closeSession = new CloseSession();
    closeSession.command('123', function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.have.string('Error in parsing JSON response from /closeSession :');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/closeSession/123?mocksPort=10002',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });

      done();
    });
  });
});
