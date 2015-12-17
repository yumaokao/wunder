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

WunderTask.prototype.subtasks = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/subtasks?task_id=' + self.obj.id)
      .then(function(data) {
        self.wunderSubtasks = data;
        resolve(self.wunderSubtasks);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderTask.prototype.comments = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/task_comments?task_id=' + self.obj.id)
      .then(function(data) {
        self.wunderComments = data;
        resolve(self.wunderComments);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderTask.prototype.notes = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/notes?task_id=' + self.obj.id)
      .then(function(data) {
        self.wunderNotes = data;
        resolve(self.wunderNotes);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderTask.prototype.reminders = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/reminders?task_id=' + self.obj.id)
      .then(function(data) {
        self.wunderReminders = data;
        resolve(self.wunderReminders);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

util.inherits(WunderTask, WunderAPI);
module.exports = WunderTask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
