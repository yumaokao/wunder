'use strict';
var chai = require('chai');
var should = require('chai').should();
var stdin = require('bdd-stdin');
var Promise = require('bluebird');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);


var WunderCLI = require('../libs/WunderCLI');
var WunderSelector = require('../libs/WunderSelector');
var WunderConfig = require('../libs/WunderConfig');
var conf = new WunderConfig();

describe('WunderCLI-Tasks', function() {
  this.timeout(30000);
	describe('CRUD /tasks in list [wunder test]', function () {
    var cli = new WunderCLI(conf);
	  it('If exists, Delete [wunder test] [wunder rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) {
            return l.obj.title === 'wunder test' || l.obj.title === 'wunder rename';
          });
          return Promise.map(wls, function(l) { return l.delete(); });
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create list [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          return cli.wunderRoot.newLists(['wunder test']);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('wunder test');
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Create task [task test] at list [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return wls[0].newTasks(['task test']);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('task test');
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Read task [task test] at list [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          tasks.length.should.be.equal(1);
          tasks[0].obj.title.should.be.equal('task test');
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task test'; });
          wtsks.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Update task [task test] -> [task rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          tasks.length.should.be.equal(1);
          tasks[0].obj.title.should.be.equal('task test');
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task test'; });
          wtsks.length.should.be.equal(1);
          return wtsks;
        })
        .then(function(tasks) {
          var updates = [ { 'title': 'task rename' } ];
          return Promise.map(tasks, function(t, i) { return t.update(updates[i]); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('task rename');
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Delete task [task rename] at list [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task rename'; });
          wtsks.length.should.be.equal(1);
          return Promise.map(wtsks, function(t) { return t.delete(); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete list [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          wls.length.should.be.equal(1);
          return Promise.map(wls, function(l) { return l.delete(); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
