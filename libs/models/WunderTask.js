'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderSubtask = require('./WunderSubtask');
var WunderComment = require('./WunderComment');
var WunderNote = require('./WunderNote');
var WunderReminder = require('./WunderReminder');

var WunderTask = function(obj, up) {
  WunderAPI.call(this, obj, up);

  this.wunderSubtasks = [];
  this.wunderComments = [];
  this.wunderNotes = [];
  this.wunderReminders = [];
};
util.inherits(WunderTask, WunderAPI);

WunderTask.prototype.subtasks = function() {
  return this.fetchAs('/subtasks?task_id=' + this.obj.id,
                      'wunderSubtasks', WunderSubtask);
};

WunderTask.prototype.comments = function() {
  return this.fetchAs('/task_comments?task_id=' + this.obj.id,
                      'wunderComments', WunderComment);
};

WunderTask.prototype.notes = function() {
  return this.fetchAs('/notes?task_id=' + this.obj.id,
                      'wunderNotes', WunderNote);
};

WunderTask.prototype.reminders = function() {
  return this.fetchAs('/reminders?task_id=' + this.obj.id,
                      'wunderReminders', WunderReminder);
};

WunderTask.prototype.delete = function() {
  return this.del('/tasks/' + this.obj.id + '?revision=' + this.obj.revision);
};

WunderTask.prototype.update = function(updater) {
  // TODO: check keys in updater ?
  var data = updater;
  data['revision'] = this.obj.revision;
  return this.patch('/tasks/' + this.obj.id, data);
};

module.exports = WunderTask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
