'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');

var WunderRoot = function() {
  WunderAPI.call(this)

  this.cachedLists = [];
  this.cachedRoot = null;

  var self = this;
  this.get('/root').then(function(data) { self.catchedRoot = data; });
};

WunderRoot.prototype.lists = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.get('/lists')
      .then(function(data) {
        self.cachedLists = data;
        resolve(self.cachedLists);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
};

util.inherits(WunderRoot, WunderAPI);
module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
