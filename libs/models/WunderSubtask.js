'use strict';

var util = require('util');
var WunderAPI = require('./WunderAPI');

var WunderSubtask = function(obj, up) {
  WunderAPI.call(this, obj, up)
};

util.inherits(WunderSubtask, WunderAPI);
module.exports = WunderSubtask;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
