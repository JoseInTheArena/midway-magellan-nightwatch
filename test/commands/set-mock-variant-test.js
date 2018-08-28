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
var SetMockVariant = require('../../commands/setMockVariant');
var TestSetup = require('./test-setup');
var Util = require('../../lib/util');

describe('Set Mock Variant Test', function () {
  var readStub;
  var requestStub;

  it('should set mock variant', function (done) {
    var res = 'set variant successfully';
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockVariant = new SetMockVariant();

    setMockVariant.command({route: 'path',  variant: 'variant', midwaySessionId: '123'}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('set variant successfully');
      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/route/path-123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: '{"variant":"variant"}' });
      done();
    });
  });

  it('should set mock variant with route in fixture', function (done) {
    var res = 'set variant successfully';
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockVariant = new SetMockVariant();
    setMockVariant.api = {
      midwaySessionId : '123'
    };

    setMockVariant.command({fixture: 'path',  variant: 'variant'}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('set variant successfully');
      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/route/path-123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: '{"variant":"variant"}' });
      done();
    });
  });

  it('should error out when set mock variant throws error', function (done) {
    readStub = TestSetup.getReadStubWithError();
    requestStub = TestSetup.getRequestStubWithError();

    var setMockVariant = new SetMockVariant();

    setMockVariant.command({route: 'path',  variant: 'variant', midwaySessionId: '123'}, function (err, response) {
      Expect(err).to.not.be.null;
      Expect(err).to.equal('Error in read');
      done();
    });
  });

  it('should set mock variant if proxy api is set', function (done) {
    var proxyApi = {
      setMockVariant: Sinon.spy()
    };
    Util.initProxyApi(proxyApi);

    var res = 'set variant successfully';
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockVariant = new SetMockVariant();

    setMockVariant.command({route: 'path',  variant: 'variant', midwaySessionId: '123'}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('set variant successfully');
      Expect(proxyApi.setMockVariant.called).to.equal(true);
      Expect(proxyApi.setMockVariant.calledWith({mockVariant: 'variant', route: '/path', midwaySessionId: '123'})).to.equal(true);

      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/route/path-123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: '{"variant":"variant"}' });
      done();
    });
  });

  it('should set mock variant if proxy api is set with route in fixture', function (done) {
    var proxyApi = {
      setMockVariant: Sinon.spy()
    };
    Util.initProxyApi(proxyApi);

    var res = 'set variant successfully';
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setMockVariant = new SetMockVariant();

    setMockVariant.command({fixture: 'path',  variant: 'variant', midwaySessionId: '123'}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('set variant successfully');
      Expect(proxyApi.setMockVariant.called).to.equal(true);
      Expect(proxyApi.setMockVariant.calledWith({mockVariant: 'variant', route: '/path', midwaySessionId: '123'})).to.equal(true);

      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/route/path-123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: '{"variant":"variant"}' });
      done();
    });
  });
});
