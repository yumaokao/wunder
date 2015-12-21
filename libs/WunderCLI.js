'use strict';

var Promise = require('bluebird');
var chalk = require('chalk');
var repeat = require('string.prototype.repeat');
var WunderRoot = require('./models/WunderRoot');


var WunderCLI = function() {
  this.root = new WunderRoot();
};

// recursively sync all end points from root
WunderCLI.prototype.sync = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    self.root.lists()
      .then(function(lists) {
        return Promise.all(lists.map(function(l) { return l.tasks(); }));
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.notes(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.subtasks(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.comments(); }));
        return Promise.all(proms);
      })
      .then(function() {
        var tasks = [].concat.apply([], self.root.wunderLists.map(function(l) { return l.wunderTasks; }));
        var proms = [].concat.apply([], tasks.map(function(t) { return t.reminders(); }));
        return Promise.all(proms);
      })
      .then(function() {
        resolve(self);
      });
  });
};

WunderCLI.prototype.lists = function() {
  this.root.lists().then(function(lists) {
    lists.forEach(function(list) {
      list.tasks().then(function(tasks) {
        Promise.all(tasks.map(function(t) { return t.notes(); }))
          .then(function() {
            return Promise.all(tasks.map(function(t) { return t.subtasks(); }));
          })
        .then(function() {
          return Promise.all(tasks.map(function(t) { return t.comments(); }));
        })
        .then(function() {
          console.log(chalk.bold.blue(list.obj.title + ' (' + list.wunderTasks.length + ')'));
              list.wunderTasks.forEach(function(t) {
                // console.log('    ' + t.obj.title);
                console.log(' '.repeat(2) + chalk.green(t.obj.title));
                t.wunderNotes.forEach(function(n) {
                  console.log(' '.repeat(4) + '   Note: ' + n.obj.content.replace(/\n/g, '\n' + ' '.repeat(4 + 9)));
                });
                t.wunderSubtasks.forEach(function(n) {
                  console.log('    Subtask: [' + n.obj.title + ']');
                });
                t.wunderComments.forEach(function(n) {
                  console.log('    Comment: [' + n.obj.text + ']');
                });
              });
        });
      });
    });
  });
};

module.exports = WunderCLI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
