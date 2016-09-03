'use strict';
var chai = require('chai');
var should = require('chai').should();
var stdin = require('bdd-stdin');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);


var WunderCLI = require('../libs/WunderCLI');
var WunderSelector = require('../libs/WunderSelector');
var WunderConfig = require('../libs/WunderConfig');
var conf = new WunderConfig();

describe('WunderCLI-Tasks', function() {
  this.timeout(30000);
	describe('CRUD /task in list [wunder test]', function () {
    var cli = new WunderCLI(conf);
	  it('If exists, Delete [wunder test] [wunder rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) {
            return l.obj.title === 'wunder test' || l.obj.title === 'wunder rename';
          });
          return cli.deleteLists(wls);
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          return cli.newLists([ 'wunder test' ]);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('wunder test');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return cli.deleteLists(wls);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder test] will be deleted', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          lists.filter(function(l) { return l.obj.title === 'wunder rename'; })
            .length.should.be.equal(0);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });

	// describe('CRUD /list with two [crud_lists_0, crud_lists_1]', function () {
    // var lasts = [ 'crud_lists_0', 'crud_lists_1', 'crud_lists_2' , 'crud_lists_3' ];
    // var clsts = lasts.slice(0, 2);
    // var ulsts = lasts.slice(2, 4);
    // var cli = new WunderCLI(conf);
		// it('If exists, Delete [ crud_lists_* ', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // var wls = lists.filter(function(l) {
            // return lasts.indexOf(l.obj.title) !== -1;
          // });
          // return cli.deleteLists(wls);
        // })
        // .then(function(res) { done(); })
        // .catch(function(err) { done(err); });
    // });
		// it('Create [crud_lists_0, crud_lists_1]', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // lists.filter(function(l) { return lasts.indexOf(l.obj.title) !== -1; })
            // .length.should.be.equal(0);
          // return cli.newLists([ 'crud_lists_0', 'crud_lists_1' ]);
        // })
        // .then(function(res) {
          // res.length.should.be.equal(2);
          // done();
        // })
        // .catch(function(err) { done(err); });
    // });
		// it('Read [crud_lists_0, crud_lists_1]', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // lists.filter(function(l) { return clsts.indexOf(l.obj.title) !== -1; })
            // .length.should.be.equal(2);
          // done();
        // })
        // .catch(function(err) { done(err); });
    // });
		// it('Update [ _0, _1 ] -> [ _2, _3 ]', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // var wls = lists.filter(function(l) { return clsts.indexOf(l.obj.title) !== -1; });
          // return cli.renameLists(wls, ulsts);
        // })
        // .then(function(res) {
          // res.length.should.be.equal(2);
          // done();
        // })
        // .catch(function(err) { done(err); });
    // });
		// it('Delete [_2, _3 ]', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // var wls = lists.filter(function(l) { return ulsts.indexOf(l.obj.title) !== -1; });
          // wls.length.should.be.equal(2);
          // return cli.deleteLists(wls);
        // })
        // .then(function(res) {
          // res.length.should.be.equal(2);
          // done();
        // })
        // .catch(function(err) { done(err); });
    // });
		// it('Read [ _0, _1, _2, _3 ] will be deleted', function (done) {
      // cli.sync()
        // .then(function(cli) { return cli.wunderRoot.wunderLists; })
        // .then(function(lists) {
          // lists.filter(function(l) { return lasts.indexOf(l.obj.title) !== -1; })
            // .length.should.be.equal(0);
          // done();
        // })
        // .catch(function(err) { done(err); });
    // });
  // });
});
// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
