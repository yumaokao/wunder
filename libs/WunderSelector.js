'use strict';

var Promise = require('bluebird');
var chalk = require('chalk');
var repeat = require('string.prototype.repeat');
var prompt = require('prompt');
Promise.promisifyAll(prompt);

var WunderSelector = function() { };

WunderSelector.prototype.selectLists = function(cli, filters) {
  root = cli.root;
  filters = filters || { };
  root.wunderLists.forEach(function(l) {
    console.log(chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
  });
};

module.exports = WunderSelector;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
