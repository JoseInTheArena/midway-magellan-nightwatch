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
var magellan;
var magellanGlobal

describe('MagellanHandler Test', function () {

  beforeEach(function () {
    Util.setAppPort(0);
    Util.setMidwayPort(0);
    Util.setMidwayHttpsPort(0);

    options = {
      before: function (opts, cb) {
        return cb();
      },
      after: function (opts, cb) {
        return cb();
      },
      logFile: './log.txt',
      midwayOptions: midwayOptions
    };

  });

  it('Complete test', function (done) {
    magellan = MidwayMagellanNightwatch.magellan(options);
    magellanGlobal = {workerAmount: 2};

    magellan.prototype.initialize(magellanGlobal).then(function () {
      Expect(Util.getAppPort()).to.equal('8000');
      Expect(Util.getMidwayPort()).to.equal('8002');
      Expect(Util.getMidwayHttpsPort()).to.equal('8003');
      magellan.prototype.flush().then(function () {
        done();
      });
    });
  });

  it('Setup throws error', function (done) {
    options.before = function (opts, cb) {
      return cb(new Error('Error in setup'));
    };

    magellan = MidwayMagellanNightwatch.magellan(options);
    magellanGlobal = {};

    magellan.prototype.initialize(magellanGlobal).then(function () {
      Assert.fail('Control should not come here when setup errors out');
      done();
    }, function (err) {
      Expect(err.message).to.equal('Error in setup');
      magellan.prototype.flush().then(function () {
        Expect(Util.getAppPort()).to.equal('0');
        Expect(Util.getMidwayPort()).to.equal('0');
        Expect(Util.getMidwayHttpsPort()).to.equal('0');
        done();
      });
    });
  });

  it('No teardown', function (done) {
    options.after = undefined;

    magellan = MidwayMagellanNightwatch.magellan(options);
    magellanGlobal = {};

    magellan.prototype.initialize(magellanGlobal).then(function () {
      Expect(Util.getAppPort()).to.equal('8000');
      Expect(Util.getMidwayPort()).to.equal('8002');
      Expect(Util.getMidwayHttpsPort()).to.equal('8003');
      magellan.prototype.flush().then(function () {
        done();
      });
    });
  });

  it('Teardown throws error', function (done) {
    options.after = function (opts, cb) {
      return cb(new Error('Error in teardown'));
    };

    magellan = MidwayMagellanNightwatch.magellan(options);
    magellanGlobal = {};

    magellan.prototype.initialize(magellanGlobal).then(function () {
      magellan.prototype.flush().then(function () {
        Expect(Util.getAppPort()).to.equal('8000');
        Expect(Util.getMidwayPort()).to.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.equal('8003');
        done();
      }, function () {
        Assert.fail('Control should not come here when teardown errors out');
        done();
      });
    });
  });

  it('Missing options', function (done) {
    try {
      MidwayMagellanNightwatch.magellan();
    } catch (e) {
      Expect(e.message).to.equal('Missing options in magellan init');
      done();
    }
  });

  it('No Midway Options test', function (done) {
    options.midwayOptions = undefined;

    magellan = MidwayMagellanNightwatch.magellan(options);
    magellanGlobal = {workerAmount: 2};

    magellan.prototype.initialize(magellanGlobal).then(function () {
      magellan.prototype.flush().then(function () {
        Expect(Util.getAppPort()).to.not.equal('8000');
        Expect(Util.getMidwayPort()).to.not.equal('8002');
        Expect(Util.getMidwayHttpsPort()).to.not.equal('8003');
        done();
      });
    });
  });

});
