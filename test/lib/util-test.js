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
var Util = require('../../lib/util');

describe('Utils Test', function () {

  it('should calculate sessions based on workercount', function (done) {
    Expect(Util.calculateSessions(32)).to.equal(38);
    done();
  });

  it('should calculate sessions based on workercount and factor', function (done) {
    Expect(Util.calculateSessions(20, 50.0)).to.equal(30);
    done();
  });

  it('should NOT calculate sessions if workercount is not defined', function (done) {
    Expect(Util.calculateSessions()).to.equal(undefined);
    done();
  });

  it('should NOT calculate sessions if workercount is not a number', function (done) {
    Expect(Util.calculateSessions('a')).to.equal(undefined);
    done();
  });

});
