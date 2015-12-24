'use strict';

var Promise = require('bluebird');
var chalk = require('chalk');
var repeat = require('string.prototype.repeat');

var WunderPrinter = function() {
};

WunderPrinter.prototype.colorPrint = function(cli) {
  root = cli.root;
  root.wunderLists.forEach(function(l) {
    console.log(chalk.bold.blue(l.obj.title + ' (' + l.wunderTasks.length + ')'));
    l.wunderTasks.forEach(function(t) {
      // console.log('wunderNotes ' + t.wunderNotes.length);
      // console.log('wunderSubtasks ' + t.wunderSubtasks.length);
      // console.log('wunderComments ' + t.wunderComments.length);
      // console.log('wunderReminders ' + t.wunderReminders.length);
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
};

module.exports = WunderPrinter;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
