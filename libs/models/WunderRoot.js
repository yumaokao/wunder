'use strict';

var util = require('util');
var Promise = require('bluebird');
var WunderAPI = require('./WunderAPI');
var WunderList = require('./WunderList');

var WunderRoot = function() {
  WunderAPI.call(this)

  this.obj = null;
  this.wunderLists = [];

  var self = this;
  this.get('/root').then(function(data) { self.obj = data; });
};

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

util.inherits(WunderRoot, WunderAPI);
module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
