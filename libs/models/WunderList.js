'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderTask = require('./WunderTask');

var WunderList = function(obj, up) {
  WunderAPI.call(this, obj, up);
  this.node = '/lists/';

  // this.wunderTasks = [];

  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};
util.inherits(WunderList, WunderAPI);

WunderList.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.tasks()
      .then(function(tasks) {
        return Promise.map(tasks, function(t) { return t.sync(); });
      })
      .then(function() { resolve(self); })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderList.prototype.tasks = function() {
  return this.fetchAs('/tasks?list_id=' + this.obj.id,
                      'wunderTasks', WunderTask);
};

WunderList.prototype.newTask = function(title) {
  return this.post('/tasks', { 'title': title, 'list_id': this.obj.id });
};

WunderList.prototype.newTasks = function(titles) {
  var self = this;
  return Promise.map(titles, function(t) { return self.newTask(t); });
};

module.exports = WunderList;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
