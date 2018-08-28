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
var MidwayMagellanNightwatch = require('../../lib/index');
var Expect = require('chai').expect;
var Assert = require('chai').assert;
var Util = require('../../lib/util');
var midwayOptions = {
  appPort: 8000,
  port: 8002,
  httpsPort: 8003
};
var options;
var nightwatch;

describe('NightwatchHandler Test', function () {

  beforeEach(function () {
    Util.setAppPort(0);
    Util.setMidwayPort(0);
    Util.setMidwayHttpsPort(0);

    options = {
      start: function(opts, cb) {
        Expect(opts).to.not.be.null;
        Expect(opts.log).to.not.be.null;
        Expect(typeof opts.log).to.equal('function');
        cb();
      },
      stop: function(opts, cb) {
        Expect(opts).to.not.be.null;
        Expect(opts.log).to.not.be.null;
        Expect(typeof opts.log).to.equal('function');
        cb();
      },
      logFile: './log.txt',
      midwayOptions: midwayOptions
    }

  });

  it('Missing options test', function (done) {
    try {
      MidwayMagellanNightwatch.nightwatch();
    } catch (e) {
      Expect(e.message).to.equal('Missing options in nightwatch init');
      done();
    }
  });

  it('Complete test', function (done) {
    nightwatch = MidwayMagellanNightwatch.nightwatch(options);
    nightwatch.before(function () {
      nightwatch.after(function () {
        Expect(Util.getAppPort()).to.equal('8000');
        Expect(Util.getMidwayPort()).to.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.equal('8003');
        done();
      });
    });
  });

  it('Without teardown', function (done) {
    options.stop = undefined;

    nightwatch = MidwayMagellanNightwatch.nightwatch(options);
    nightwatch.before(function () {
      nightwatch.after(function () {
        Expect(Util.getAppPort()).to.equal('8000');
        Expect(Util.getMidwayPort()).to.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.equal('8003');
        done();
      });
    });
  });

  it('Without setup', function (done) {
    options.start = undefined;

    nightwatch = MidwayMagellanNightwatch.nightwatch(options);
    nightwatch.before(function () {
      nightwatch.after(function () {
        Expect(Util.getAppPort()).to.not.equal('8000');
        Expect(Util.getMidwayPort()).to.not.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.not.equal('8003');
        done();
      });
    });
  });

  it('Setup throws error', function (done) {
    options.start = function(opts, cb) {
      Expect(opts).to.not.be.null;
      Expect(opts.log).to.not.be.null;
      Expect(typeof opts.log).to.equal('function');
      cb(new Error('Error in setup'));
    }

    nightwatch = MidwayMagellanNightwatch.nightwatch(options);
    nightwatch.before(function () {
      nightwatch.after(function () {
        Expect(Util.getAppPort()).to.not.equal('8000');
        Expect(Util.getMidwayPort()).to.not.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.not.equal('8003');
        done();
      });
    });
  });

  it('No Midway options', function (done) {
    options.midwayOptions = undefined;

    nightwatch = MidwayMagellanNightwatch.nightwatch(options);
    nightwatch.before(function () {
      nightwatch.after(function () {
        Expect(Util.getAppPort()).to.not.equal('8000');
        Expect(Util.getMidwayPort()).to.not.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.not.equal('8003');
        done();
      });
    });
  });

});
