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
var SetMockId = require('../../commands/setMockId');
var TestSetup = require('./test-setup');
var Util = require('../../lib/util');

describe('Set Mock Id Test', function () {
  var readStub;
  var requestStub;

  it('should set mock id', function (done) {
    var res = JSON.stringify({
      mockId: 'search'
    });
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockId = new SetMockId();

    setMockId.command('search', '123', function (err, response) {
      Expect(err).to.equal(null);
      Expect(JSON.parse(response).mockId).to.equal('search');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/setMockId/search/123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });
      done();
    });
  });

  it('should set mock id without session id', function (done) {
    var res = JSON.stringify({
      mockId: 'search'
    });
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockId = new SetMockId();
    setMockId.api = {};

    setMockId.command('search', null, function (err, response) {
      Expect(err).to.equal(null);
      Expect(JSON.parse(response).mockId).to.equal('search');
      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/setMockId/search',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });
      done();
    });
  });

  it('should not set mock id if error', function (done) {
    readStub = TestSetup.getReadStubWithError();
    requestStub = TestSetup.getRequestStubWithError();

    var setMockId = new SetMockId();

    setMockId.command('search', '123', function (err) {
      Expect(err).to.not.be.null;
      Expect(err).to.equal('Error in read');
      done();
    });
  });

  it('should set mock id with proxy api', function (done) {

    var proxyApi = {
      setMockId: Sinon.spy()
    };
    Util.initProxyApi(proxyApi);

    var res = JSON.stringify({
      mockId: 'search'
    });
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockId = new SetMockId();
    setMockId.api = {
      midwaySessionId: '123'
    };

    setMockId.command('search', null, function (err, response) {
      Expect(err).to.equal(null);
      Expect(JSON.parse(response).mockId).to.equal('search');

      Expect(proxyApi.setMockId.called).to.equal(true);
      Expect(proxyApi.setMockId.calledWith({mockId: 'search', midwaySessionId: '123'})).to.equal(true);

      Sinon.assert.calledWith(requestStub, 'get', '/midway/api/setMockId/search/123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });

      done();
    });
  });


});
