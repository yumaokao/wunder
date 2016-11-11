'use strict';

var util = require('util');
var WunderAPI = require('./WunderAPI');

var WunderReminder = function(obj, up) {
  WunderAPI.call(this, obj, up);
  this.node = '/reminders/';
};
util.inherits(WunderReminder, WunderAPI);

module.exports = WunderReminder;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
