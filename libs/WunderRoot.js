'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');

var WunderRoot = function() {
  WunderAPI.call(this)

  this.lists = [];
  this.root = null;
};

WunderRoot.prototype.fetch = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.get('/root')
      .then(function(data) {
        self.root = data;
        return self.get('/lists');
      })
      .then(function(data) {
        self.lists = data;
        // self.lists.forEach(function(elem, index, array) { console.log(elem); });
        resolve(self);
      })
      .catch(function(resp) {
        reject(resp);
      });
  });
}

util.inherits(WunderRoot, WunderAPI);
module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
