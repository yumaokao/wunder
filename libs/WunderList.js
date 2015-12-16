'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
// var WunderRoot = require('./WunderRoot');

var WunderList = function(list, root) {
  WunderAPI.call(this)

  this.list = list;
  this.wunderTasks = [];
  this.wunderRoot = root;

  // var self = this;
  // this.get('/root').then(function(data) { self.catchedRoot = data; });
};

WunderList.prototype.tasks = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/tasks?list_id=' + self.list.id)
      .then(function(data) {
        self.wunderTasks= data;
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
