'use strict';
var chai = require('chai');
var should = require('chai').should();
var stdin = require('bdd-stdin');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);

var nconf = require('nconf');
nconf.defaults({
  'Auth': {
    'baseURL': 'http://a.wunderlist.com/api/v1',
    'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
    'clientID': '6cca1923696f790a903d'
  }
});

var WunderCLI = require('../libs/WunderCLI');
var WunderSelector = require('../libs/WunderSelector');
describe('WunderCLI', function() {
	describe('Should always has a list \'inbox\' at head', function () {
	  it('should be wunderLists', function (done) {
      this.timeout(30000);
      var cli = new WunderCLI(nconf.get('Auth'));
      cli.sync()
        // .then(function(cli) { done(new Error('a')); })
        .then(function(cli) {
          cli.should.have.property('root');
          return cli.root.lists();
        })
        .then(function(lists) {
          lists.length.should.be.at.least(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

describe('WunderSelector', function() {
	describe('Select a list to delete', function () {
	  it('input [1] should be \'inbox\'', function (done) {
      this.timeout(30000);
      var cli = new WunderCLI(nconf.get('Auth'));
      var sel = new WunderSelector();
      cli.sync()
        .then(function(cli) {
          stdin('1', '\n');
          return sel.selectDeleteLists(cli, { 'lists': [] });
        })
        .then(function(lists) {
          lists.should.have.length(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
