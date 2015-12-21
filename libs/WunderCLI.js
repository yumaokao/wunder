'use strict';

var Promise = require('bluebird');
var WunderRoot = require('./models/WunderRoot');

var WunderCLI = function() {
};

WunderCLI.prototype.lists = function() {
  console.log("YMK in WunderCLI");
};

module.exports = WunderCLI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
