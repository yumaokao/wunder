'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderTask = require('./WunderTask');
// var WunderRoot = require('./WunderRoot');

var WunderList = function(list, root) {
  WunderAPI.call(this)

  this.obj = list;
  this.wunderRoot = root;

  this.wunderTasks = [];
  // this.wunderSubtasks = [];
  // this.wunderComments = [];
  // this.wunderNotes = [];
  // this.wunderReminders = [];
};

WunderList.prototype.tasks = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/tasks?list_id=' + self.obj.id)
      .then(function(data) {
        self.wunderTasks = data.map(function(t) {
          return new WunderTask(t, self); 
        });
        resolve(self.wunderTasks);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

util.inherits(WunderList, WunderAPI);
module.exports = WunderList;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
