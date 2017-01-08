'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderList = require('./WunderList');

var WunderRoot = function(obj, up) {
  WunderAPI.call(this, obj, up);
  this.node = '/root/';

  // this.wunderLists = [];
};
util.inherits(WunderRoot, WunderAPI);

WunderRoot.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.getCache()
      .then(function(cache) {
        // console.log('get the cache');
        return self.wunderLists = cache.lists.map(function(l) {
          return new WunderList(l, self);
        });
      })
      .catch(function(resp) {
        // console.log('no cache: ' + resp.message);
        return self.lists();
      })
      .then(function(lists) {
        return Promise.map(lists, function(l) { return l.sync(); });
      })
      .then(function() {
        var cacheObj = {
          obj: self.obj,
          lists: self.wunderLists.map(function(l) { return l.obj; })
        };
        return self.saveCache(cacheObj);
      })
      .then(function() { resolve(self); })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderRoot.prototype.lists = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/lists')
      .then(function(data) {
        self.wunderLists = data.map(function(l) {
          return new WunderList(l, self); 
        });
      })
      .then(function() { resolve(self.wunderLists); })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

WunderRoot.prototype.newList = function(title) {
  return this.post('/lists', { 'title': title });
};

WunderRoot.prototype.newLists = function(titles) {
  var self = this;
  return Promise.map(titles, function(t) { return self.newList(t); });
};

module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
