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
        pattern: /^[\d,\-\s]+$/,
        message: 'Numbers only (e.g. 1,2, 3,4-5): ',
        required: true
      }
    }
  };
  prompt.message = 'Select '
  prompt.start();
  // return prompt.getAsync(schema);
  return new Promise(function(resolve, reject) {
    prompt.getAsync(schema)
      .then(function(res) {
        var nums = res.lists.split(',');
        // lis = lis.map(function(l) { return l.trim(); });
        var lls = nums.map(function(ns) {
          // console.log(ns);
          var ranges = ns.split('-');
          ranges.map(function(r) { return r.trim(); });
          var ind = Math.min(ranges);
          var len = (ranges.length == 2) ?
            Math.abs(ranges[1] - ranges[0]) + 1 : 1;
          return cli.WunderList.splice(ind, len);
        });
        console.log(lls);

        resolve(cli);
      })
      .catch(function(err) { reject({ message: err }); });
  });
};

module.exports = WunderSelector;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
