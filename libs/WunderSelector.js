'use strict';

var Promise = require('bluebird');
var chalk = require('chalk');
var minimatch = require('minimatch');
var repeat = require('string.prototype.repeat');
var prompt = require('prompt');
Promise.promisifyAll(prompt);

var WunderSelector = function() { };
// -------------------------
// Lists
// -------------------------
WunderSelector.prototype.selectListLists = function(cli, filters) {
  if (filters !== undefined && filters.lists !== undefined
      && Array.isArray(filters.lists) && filters.lists.length === 0)
    return cli.wunderRoot.wunderLists;
  return this.selectLists(cli, 'list', filters);
};
WunderSelector.prototype.selectDeleteLists = function(cli, filters) {
  return this.selectLists(cli, 'delete', filters);
};
// WunderSelector.prototype.selectRenameLists = function(cli, filters) {
  // return this.selectLists(cli, 'rename', filters);
// };
WunderSelector.prototype.inputRenameTitles = function(lists, titles) {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (lists.length < titles.length)
      reject({ message: 'Too few lists selected' });
    var adds = lists.slice(titles.length, lists.length);
    Promise.each(adds, function(a) {
        return prompt.getAsync(self.schemaString('Which title to rename [' + a.obj.title + '] ?'))
          .then(function(res) {
            return titles.push(res.string); });
      })
      .then(function() {
        if (lists.length !== titles.length)
          reject({ message: 'Not enough titles to rename' })
        resolve({ 'lists': lists, 'titles': titles });
      })
      .catch(function(err) { reject({ message: err }); });
  });
};
WunderSelector.prototype.confirmDeleteLists = function(lists) {
  lists.forEach(function(l) {
    console.log(chalk.black.bgYellow('D') + ' ' +
    chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
  });
  return this.confirmObjs(action, 'lists', lists);
};

WunderSelector.prototype.selectLists = function(cli, action, filters) {
  var root = cli.wunderRoot;
  // if user specific, return matched/filtered lists
  if (filters !== undefined && filters.lists !== undefined
      && Array.isArray(filters.lists) && filters.lists.length > 0)
    return root.wunderLists.filter(function(l) {
      // Use wildcard/minimatch
      return filters.lists.filter(function(f) {
        // console.log(JSON.stringify(f));
        // console.log(f + ' ' + l.obj.title + ' -> ' + minimatch(l.obj.title, f));
        return minimatch(l.obj.title, f);
      }).length !== 0;
      // return filters.lists.indexOf(l.obj.title) !== -1;
    });

  root.wunderLists.forEach(function(l, i) {
    console.log(chalk.black.bgYellow(i + 1) + ' ' +
                chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
  });
  var self = this;
  return new Promise(function(resolve, reject) {
    prompt.message = 'Select'
    prompt.start();
    prompt.getAsync(self.schemaNumberRange('Lists to ' + action))
      .then(function(res) { resolve(self.parseNumberRange(res.range, root.wunderLists)); })
      .catch(function(err) { reject({ message: err }); });
  });
};

WunderSelector.prototype.confirmObjs = function(action, type, objs) {
  var schema = {
    properties: {
      confirm: {
        description: 'Sure to ' + action + ' these ' + type + '(' + objs.length + ') ? [y/N]',
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
    .then(function(res) { resolve(res.confirm.toLowerCase() === 'y' ? objs : []); })
    .catch(function(err) { reject({ message: err }); });
  });
};

// Tasks
WunderSelector.prototype.selectTasks = function(lists, action, filters) {
  var self = this;
  var ltasks = lists.map(function(l) { return l.wunderTasks; });
  var tasks = [].concat.apply([], ltasks);

  if (filters !== undefined && filters.tasks !== undefined
      && Array.isArray(filters.tasks) && filters.tasks.length > 0)
    return tasks.filter(function(t) {
      // Use wildcard/minimatch
      return filters.tasks.filter(function(f) {
        // console.log(JSON.stringify(f));
        // console.log(f + ' ' + l.obj.title + ' -> ' + minimatch(l.obj.title, f));
        return minimatch(t.obj.title, f);
      }).length !== 0;
      // return filters.lists.indexOf(l.obj.title) !== -1;
    });

  tasks.forEach(function(t, i) {
    console.log(chalk.black.bgYellow(i + 1) + ' ' +
                chalk.bold.blue(t.obj.title + ' in ' + t.up.obj.title));
  });
  var self = this;
  return new Promise(function(resolve, reject) {
    prompt.message = 'Select'
    prompt.start();
    prompt.getAsync(self.schemaNumberRange('Tasks to ' + action))
      .then(function(res) { resolve(self.parseNumberRange(res.range, tasks)); })
      .catch(function(err) { reject({ message: err }); });
  });
};
WunderSelector.prototype.confirmDeleteTasks= function(tasks) {
  tasks.forEach(function(t) {
    console.log(chalk.black.bgYellow('D') + ' ' +
    chalk.bold.blue(t.obj.title + ' in ' + t.up.obj.title));
  });
  return this.confirmObjs(action, 'tasks', tasks);
};

WunderSelector.prototype.schemaNumberRange = function(act) {
  return {
    properties: {
      range: {
        description: act + ' (e.g. 1,2,3-4)',
        pattern: /^[\d,\-\s]+$/,
        message: 'Numbers only (e.g. 1,2, 3,4-5)',
        required: true
      }
    }
  };
};

WunderSelector.prototype.schemaString = function(act) {
  return {
    properties: {
      string: {
        description: act,
        message: 'Any character should be OK',
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
