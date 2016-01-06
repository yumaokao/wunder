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
    'accessToken': '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5',
    'clientID': '501cd26b0b953ee66cb2'
  }
});

var WunderCLI = require('../libs/WunderCLI');
var WunderSelector = require('../libs/WunderSelector');
describe('WunderCLI', function() {
  this.timeout(30000);
	describe('Should always have a list \'inbox\' at head', function () {
	  it('should be have a title \'inbox\'', function (done) {
      var cli = new WunderCLI(nconf.get('Auth'));
      cli.sync()
        // .then(function(cli) { done(new Error('a')); })
        .then(function(cli) {
          cli.should.have.property('root');
          return cli.root.lists();
        })
        .then(function(lists) {
          lists.length.should.be.equal(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('could not be deleted', function (done) {
      var cli = new WunderCLI(nconf.get('Auth'));
      cli.sync()
        .then(function(cli) {
          return cli.root.lists();
        })
        .then(function(lists) {
          lists.length.should.be.equal(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          return cli.deleteLists(lists);
        })
        .then(function(num) {
          num.should.be.equal(0);
          done();
        })
        .catch(function(err) {
          err.should.have.property('code').to.be.equal(422);
          done();
        });
    });
	  it('[TODO] could not be renamed', function (done) {
      done();
    });
  });
	describe('CRUD /list with [wunder test]', function () {
    var cli = new WunderCLI(nconf.get('Auth'));
	  it('If exists, Delete [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.root.lists(); })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          return cli.deleteLists(wls);
        })
        .then(function(num) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.root.lists(); })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          return cli.addList({ 'title': 'wunder test' })
        })
        .then(function(data) {
          data.title.should.be.equal('wunder test');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.root.lists(); })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.root.lists(); })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return cli.deleteLists(wls);
        })
        .then(function(num) {
          num.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder test] will be deleted', function (done) {
      cli.sync()
        .then(function(cli) { return cli.root.lists(); })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

describe('WunderSelector', function() {
  this.timeout(30000);
	describe('Select a list to delete', function () {
	  it('input [1] should be \'inbox\'', function (done) {
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
