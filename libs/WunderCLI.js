'use strict';

var Promise = require('bluebird');
var WunderRoot = require('./models/WunderRoot');


var WunderCLI = function(auth) {
  this.baseURL = auth.baseURL;
  this.options = { headers: { 'X-Access-Token': auth.accessToken,
                              'X-Client-ID': auth.clientID,
                              'Content-Type': 'application/json' } };
  this.root = new WunderRoot(null, this);
};

// recursively sync all end points from root
WunderCLI.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.root.lists()
      .then(function(lists) {
        return Promise.all(lists.map(function(l) { return l.tasks(); }));
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.notes(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.subtasks(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.comments(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
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

WunderCLI.prototype.addList = function(nobj) {
  // return this.root.post('/lists?title=' + encodeURIComponent(nobj.title));
  return this.root.post('/lists', nobj);
};

WunderCLI.prototype.deleteLists = function(lists) {
  return Promise.all(lists.map(function(l) { return l.delete(); }));
};

module.exports = WunderCLI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
