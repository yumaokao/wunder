'use strict';

var util = require('util');
var WunderAPI = require('./WunderAPI');

var WunderRoot = function() {
  WunderAPI.call(this)
  this.fetch();
};

WunderRoot.prototype.fetch = function() {
  this.get('/lists');
}

util.inherits(WunderRoot, WunderAPI);
module.exports = WunderRoot;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
