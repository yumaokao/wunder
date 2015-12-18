'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderSubtask = require('./WunderSubtask');
var WunderComment = require('./WunderComment');
var WunderNote = require('./WunderNote');
var WunderReminder = require('./WunderReminder');

var WunderTask = function(obj, up) {
  WunderAPI.call(this)

  this.obj = obj;
  this.up = up;

  this.wunderSubtasks = [];
  this.wunderComments = [];
  this.wunderNotes = [];
  this.wunderReminders = [];
};


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

util.inherits(WunderTask, WunderAPI);
module.exports = WunderTask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
