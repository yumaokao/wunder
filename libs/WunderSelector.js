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
  var schema = {
    properties: {
      lists: {
        description: 'Lists to delete (e.g. 1,2,3-4): ',
        pattern: /^[\d,\s]+$/,
        message: 'Numbers only (e.g. 1,2, 3,4-5): ',
        required: true
      }
    }
  };
  prompt.message = 'Select '
  prompt.start();
  return prompt.getAsync(schema);
};

module.exports = WunderSelector;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
