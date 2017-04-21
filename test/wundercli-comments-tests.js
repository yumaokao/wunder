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

describe('WunderCLI-Comments', function() {
  this.timeout(30000);
	describe('CRUD /task_comments in task [task test] in list [list test]', function () {
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
    it('Create comment [comment test] at task [task test]', function (done) {
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
          return tasks[0].newComments(['comment test']);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].text.should.be.equal('comment test');
          done();
        })
        .catch(function(err) { done(err); });
    });

    it('Read comment [comment test] at task [task test]', function (done) {
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
          return tasks[0].wunderComments;
        })
        .then(function(comments) {
          comments.length.should.be.equal(1);
          comments[0].obj.text.should.be.equal('comment test');
          done();
        })
        .catch(function(err) { done(err); });
    });
    it('Update comment [comment test] -> [comment rename]', function (done) {
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
          return wtsks[0].wunderComments;
        })
        .then(function(comments) {
          var wstsks = comments.filter(function(s) { return s.obj.text === 'comment test'; });
          wstsks.length.should.be.equal(1);
          var updates = [ { 'text': 'comment rename' } ];
          return Promise.map(wstsks, function(t, i) { return t.update(updates[i]); });
        })
        .then(function(res) {
          res.should.be.equal(0);
          done();
        })
        .catch(function(err) {
          /* Could not update task_comments */
          err.should.have.property('code').to.be.equal(404);
          done();
        });
    });
    it('Delete comment [comment test] at task [task test]', function (done) {
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
          return wtsks[0].wunderComments;
        })
        .then(function(comments) {
          var wstsks = comments.filter(function(s) { return s.obj.text === 'comment test'; });
          wstsks.length.should.be.equal(1);
          return Promise.map(wstsks, function(s) { return s.delete(); });
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
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