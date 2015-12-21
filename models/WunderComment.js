'use strict';

var util = require('util');
var WunderAPI = require('./WunderAPI');

var WunderComment = function(obj, up) {
  WunderAPI.call(this)

  this.obj = obj;
  this.up = up;
};

util.inherits(WunderComment, WunderAPI);
module.exports = WunderComment;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
