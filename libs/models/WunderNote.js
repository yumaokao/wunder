'use strict';

var util = require('util');
var WunderAPI = require('./WunderAPI');

var WunderNote = function(obj, up) {
  WunderAPI.call(this, obj, up);
};
util.inherits(WunderNote, WunderAPI);

module.exports = WunderNote;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
