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
  var self = this;
  return new Promise(function(resolve, reject) {
    prompt.getAsync(schema)
      .then(function(res) {
        resolve(self.parseInputs(res.lists, root.wunderLists));
      })
      .catch(function(err) { reject({ message: err }); });
  });
};

WunderSelector.prototype.parseInputs = function(tstr, objs) {
  var nums = tstr.split(',');
  // lis = lis.map(function(l) { return l.trim(); });
  var lls = nums.map(function(ns) {
    // console.log(ns);
    var ranges = ns.split('-');
    ranges = ranges.map(function(r) { return r.trim(); });
    var ind = Math.min.apply(Math, ranges);
    var end = Math.max.apply(Math, ranges);
    var len = (ranges.length == 2) ?
      Math.abs(ranges[1] - ranges[0]) + 1 : 1;
    // return objs.slice(ind - 1, len);
    return objs.slice(ind - 1, end);
  });
  var lists = [].concat.apply([], lls);
  lists = lists.filter(function(value, index, self) { return self.indexOf(value) === index; });
  // console.log('Test: \'' + tstr + '\' --> (' + lists.length + ') ' + lists);
  return lists;
};

module.exports = WunderSelector;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
