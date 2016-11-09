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

describe('WunderCLI-SubTasks', function() {
  this.timeout(30000);
	describe('CRUD /subtask in task [task test] in list [list test]', function () {
    var cli = new WunderCLI(conf);
	  it('If exists, Delete [list test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) {
            return l.obj.title === 'list test';
          });
          return Promise.map(wls, function(l) { return l.delete(); });
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create list [list test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'list test'; })
            .length.should.be.equal(0);
          return cli.wunderRoot.newLists(['list test']);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('list test');
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Create task [task test] at list [list test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
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
    /* it('Create subtask [subtask test] at task [task test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          tasks.length.should.be.equal(1);
          tasks[0].obj.title.should.be.equal('task test');
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task test'; });
          wtsks.length.should.be.equal(1);
          return tasks[0].newSubtasks(['subtask test']);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('subtask test');
          done();
        })
        .catch(function(err) { done(err); });
    });

    it('Read subtask [subtask test] at task [task test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          tasks.length.should.be.equal(1);
          tasks[0].obj.title.should.be.equal('task test');
          return tasks[0].wunderSubtasks;
        })
        .then(function(subtasks) {
          subtasks.length.should.be.equal(1);
          subtasks[0].obj.title.should.be.equal('subtask test');
          done();
        })
        .catch(function(err) { done(err); });
    }); */
    /* it('Read task [task test] at list [wunder test]', function (done) {
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
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
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
          var updates = [ { 'title': 'task rename'} ];
          return Promise.map(tasks, function(t, i) { return t.update(updates[i]); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('task rename');
          done();
        })
        .catch(function(err) { done(err); });
    }); */
    /* it('Delete subtask [subtask test] at task [task test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task test'; });
          wtsks.length.should.be.equal(1);
          return wtsks[0].wunderSubtasks;
        })
        .then(function(subtasks) {
          var wstsks = subtasks.filter(function(s) { return s.obj.title === 'subtask test'; });
          wstsks.length.should.be.equal(1);
          return Promise.map(wstsks, function(s) { return s.delete(); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    }); */
    it('Delete task [task test] at list [list test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
          wls.length.should.be.equal(1);
          return wls[0].wunderTasks;
        })
        .then(function(tasks) {
          var wtsks = tasks.filter(function(t) { return t.obj.title === 'task test'; });
          wtsks.length.should.be.equal(1);
          return Promise.map(wtsks, function(t) { return t.delete(); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete list [list test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'list test'; });
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
