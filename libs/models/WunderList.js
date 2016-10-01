'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderTask = require('./WunderTask');

var WunderList = function(obj, up) {
  WunderAPI.call(this, obj, up);

  this.wunderTasks = [];
  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};
util.inherits(WunderList, WunderAPI);

WunderList.prototype.tasks = function() {
  return this.fetchAs('/tasks?list_id=' + this.obj.id,
                      'wunderTasks', WunderTask);
};

WunderList.prototype.delete = function() {
  return this.del('/lists/' + this.obj.id + '?revision=' + this.obj.revision);
};

// TODO: replace with update
WunderList.prototype.rename = function(title) {
  return this.patch('/lists/' + this.obj.id,
      { 'revision': this.obj.revision, 'title': title });
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
