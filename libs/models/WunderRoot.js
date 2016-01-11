'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderList = require('./WunderList');

var WunderRoot = function(obj, up) {
  WunderAPI.call(this, obj, up)

  this.wunderLists = [];
};
util.inherits(WunderRoot, WunderAPI);

WunderRoot.prototype.lists = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/lists')
      .then(function(data) {
        self.wunderLists = data.map(function(l) {
          return new WunderList(l, self); 
        });
        resolve(self.wunderLists);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderRoot.prototype.newList = function(title) {
  return this.post('/lists', { 'title': title });
};

module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
