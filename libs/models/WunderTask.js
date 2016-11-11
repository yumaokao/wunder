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

  this.node = '/tasks/';

  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};
util.inherits(WunderTask, WunderAPI);

WunderTask.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.subtasks()
      .then(function(stasks) {
        return Promise.map(stasks, function(s) { return s.sync(); });
      })
      .then(function() { return self.comments(); })
      .then(function(comms) {
        return Promise.map(comms, function(c) { return c.sync(); });
      })
      .then(function() { return self.notes(); })
      .then(function(nts) {
        return Promise.map(nts, function(n) { return n.sync(); });
      })
      .then(function() { return self.reminders(); })
      .then(function(rmds) {
        return Promise.map(rmds, function(r) { return r.sync(); });
      })
      .then(function() { resolve(self); })
      .catch(function(resp) {
        reject(resp);
      });
  });
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

WunderTask.prototype.newSubtask = function(title) {
  return this.post('/subtasks', { 'title': title, 'task_id': this.obj.id });
};

WunderTask.prototype.newSubtasks = function(titles) {
  var self = this;
  return Promise.map(titles, function(t) { return self.newSubtask(t); });
};

WunderTask.prototype.newComment= function(text) {
  return this.post('/task_comments', { 'text': text, 'task_id': this.obj.id });
};

WunderTask.prototype.newComments = function(texts) {
  var self = this;
  return Promise.map(texts, function(t) { return self.newComment(t); });
};

WunderTask.prototype.newNote = function(content) {
  return this.post('/notes', { 'content': content, 'task_id': this.obj.id });
};

WunderTask.prototype.newNotes = function(contents) {
  var self = this;
  return Promise.map(contents, function(c) { return self.newNote(c); });
};

WunderTask.prototype.newReminder = function(date) {
  return this.post('/reminders', { 'date': date, 'task_id': this.obj.id });
};

WunderTask.prototype.newReminders = function(dates) {
  var self = this;
  return Promise.map(dates, function(d) { return self.newReminder(d); });
};

module.exports = WunderTask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
