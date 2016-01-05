'use strict';
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.defaults({
  'Auth': {
    'baseURL': 'http://a.wunderlist.com/api/v1',
    'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
    'clientID': '6cca1923696f790a903d'
  }
});

var WunderCLI = require('../libs/WunderCLI');
describe('WunderCLI', function() {
	describe('Should always has list inbox', function () {
	  it('should be wunderLists', function (done) {
      var cli = new WunderCLI(nconf.get('Auth'));
      this.timeout(15000);
      cli.sync()
        // .then(function(cli) { done(new Error('a')); })
        .then(function(cli) { done(); })
        .catch(function(err) { done(err); });
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
