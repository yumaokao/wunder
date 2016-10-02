'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./models/WunderAPI');
var WunderRoot = require('./models/WunderRoot');

var WunderCLI = function(conf) {
  this.baseURL = conf.get('Auth').baseURL;
  this.options = { headers: { 'X-Access-Token': conf.get('Auth').accessToken,
                              'X-Client-ID': conf.get('Auth').clientID,
                              'Content-Type': 'application/json' } };
  // this.root = new WunderRoot(null, this);
};
util.inherits(WunderCLI, WunderAPI);

WunderCLI.prototype.root = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/root')
      .then(function(data) {
        self.wunderRoot = new WunderRoot(data, self);
        resolve(self.wunderRoot);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

// recursively sync all end points from root
WunderCLI.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.root()
      .then(function(root) { return root.lists(); })
      .then(function(lists) {
        return Promise.map(lists, function(l) { return l.tasks(); });
      })
      .then(function() {
        var tasks = [].concat.apply([], self.wunderRoot.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.notes(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.wunderRoot.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.subtasks(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.wunderRoot.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.comments(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.wunderRoot.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.reminders(); }));
        return Promise.all(proms);
      })
      .then(function() {
        resolve(self);
      })
      .catch(function(error) {
        // console.log('Error: ' + error.message);
        reject(error);
      });
  });
};

module.exports = WunderCLI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
