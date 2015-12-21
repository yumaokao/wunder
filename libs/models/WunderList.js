'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderTask = require('./WunderTask');

var WunderList = function(obj, up) {
  WunderAPI.call(this)

  this.obj = obj;
  this.up = up;
  this.options = up.options;

  this.wunderTasks = [];
  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};

WunderList.prototype.tasks = function() {
  return this.fetchAs('/tasks?list_id=' + this.obj.id,
                      'wunderTasks', WunderTask);
};

util.inherits(WunderList, WunderAPI);
module.exports = WunderList;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
