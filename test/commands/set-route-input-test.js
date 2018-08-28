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
var SetRouteInput = require('../../commands/setRouteInput');
var TestSetup = require('./test-setup');

describe('Set Route Input Test', function () {
  var readStub;
  var requestStub;

  it('should set route input', function (done) {
    var res = 'set route input successfully';
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var setRouteInput = new SetRouteInput();

    setRouteInput.command({route: 'route', routeInput: 'path',  variantInput: 'variant', midwaySessionId: '123'}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response).to.equal('set route input successfully');
      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/route/route-123',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: '{"input":{"route":"path","variant":"variant"}}' });
      done();
    });
  });
});
