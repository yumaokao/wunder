'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
// var WunderRoot = require('./WunderRoot');

var WunderTask = function(task, list) {
  WunderAPI.call(this)

  this.obj = task;
  this.wunderList = list;

  this.wunderSubtasks = [];
  this.wunderComments = [];
  this.wunderNotes = [];
  this.wunderReminders = [];
};

WunderTask.prototype.fetchAs = function(aurl, target) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.get(aurl)
      .then(function(data) {
        self[target] = data;
        resolve(data);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderTask.prototype.subtasks = function() {
  return this.fetchAs('/subtasks?task_id=' + this.obj.id, 'wunderSubtasks');
};

WunderTask.prototype.comments = function() {
  return this.fetchAs('/task_comments?task_id=' + this.obj.id, 'wunderComments');
};

WunderTask.prototype.notes = function() {
  return this.fetchAs('/notes?task_id=' + this.obj.id, 'wunderNotes');
};

WunderTask.prototype.reminders = function() {
  return this.fetchAs('/reminders?task_id=' + this.obj.id, 'wunderReminders');
};

util.inherits(WunderTask, WunderAPI);
module.exports = WunderTask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
