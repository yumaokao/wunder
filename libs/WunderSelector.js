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
  root.wunderLists.forEach(function(l, i) {
    console.log(chalk.black.bgYellow(i + 1) + ' ' +
                chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
  });
  var self = this;
  return new Promise(function(resolve, reject) {
    prompt.message = 'Select'
    prompt.start();
    prompt.getAsync(self.schemaNumberRange('Lists to delete'))
      .then(function(res) {
        return self.confirmLists(self.parseNumberRange(res.lists, root.wunderLists));
      })
      .then(function(lists) { resolve(lists); })
      .catch(function(err) { reject({ message: err }); });
  });
};

WunderSelector.prototype.confirmLists = function(lists) {
  lists.forEach(function(l) {
    console.log(chalk.black.bgYellow('D') + ' ' +
                chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
  });
  var schema = {
    properties: {
      confirm: {
        description: 'Sure to delete these lists(' + lists.length + ') ? [y/N]',
        pattern: /^[YyNn]$/,
        message: 'y or n',
        default: 'n',
        required: true
      }
    }
  };
  prompt.message = 'Confirm'
  prompt.start();
  return new Promise(function(resolve, reject) {
    prompt.getAsync(schema)
    .then(function(res) { resolve(res.confirm.toLowerCase() === 'y' ? lists : []); })
    .catch(function(err) { reject({ message: err }); });
  });
};

WunderSelector.prototype.schemaNumberRange = function(act) {
  return {
    properties: {
      lists: {
        description: act + ' (e.g. 1,2,3-4)',
        pattern: /^[\d,\-\s]+$/,
        message: 'Numbers only (e.g. 1,2, 3,4-5)',
        required: true
      }
    }
  };
};

WunderSelector.prototype.parseNumberRange = function(tstr, objs) {
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
