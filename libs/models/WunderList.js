'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderTask = require('./WunderTask');

var WunderList = function(obj, up) {
  WunderAPI.call(this, obj, up);

  // this.wunderTasks = [];

  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};
util.inherits(WunderList, WunderAPI);

WunderList.prototype.sync = function() {
  return this.tasks();
};

WunderList.prototype.tasks = function() {
  return this.fetchAs('/tasks?list_id=' + this.obj.id,
                      'wunderTasks', WunderTask);
};

WunderList.prototype.delete = function() {
  return this.del('/lists/' + this.obj.id + '?revision=' + this.obj.revision);
};

WunderList.prototype.update = function(updater) {
  // TODO: check keys in updater ?
  var data = updater;
  data['revision'] = this.obj.revision;
  return this.patch('/lists/' + this.obj.id, data);
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
