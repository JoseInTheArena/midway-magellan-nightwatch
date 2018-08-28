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
var ResetMockConfig = require('../../commands/resetMockConfig');
var TestSetup = require('./test-setup');

describe('Reset Mock Config Test', function () {
  var readStub;
  var requestStub;

  it('should reset mock config', function (done) {
    var res = {
      code: 200
    };
    readStub = TestSetup.getReadStub(res);
    requestStub = TestSetup.getRequestStub(res);

    var resetMockConfig = new ResetMockConfig();

    resetMockConfig.command({}, function (err, response) {
      Expect(err).to.equal(null);
      Expect(response.code).to.equal(200);
      Sinon.assert.calledWith(requestStub, 'post', '/midway/api/config/reset',
        { baseUrl: 'http://localhost:10002',
          headers: { referer: 'http://localhost:10000/' },
          payload: undefined });
      done();
    });
  });
});
