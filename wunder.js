#!/usr/bin/env node

'use strict';

var program = require('commander');
var WunderRoot = require('./libs/WunderRoot');
var pkg = require('./package');

var Promise = require('bluebird');
var chalk = require('chalk');

program
  .version(pkg.version)
  .option('-c, --conf <dir>', 'Specific another configuration directory');

program
  .command('list')
  .alias('ls')
  .description('LIST all lists or tasks')
  .option('-l, --lists <list>', 'Which list to show')
  .action(function(option) {
    var lists = option.lists || 'all';
    // console.log('YMK in command list, options ' + program.conf);
    // console.log('YMK in command list, lists ' + lists);
    var root = new WunderRoot();
    root.lists().then(function(lists) {
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
              console.log(chalk.blue(list.obj.title));
              list.wunderTasks.forEach(function(t) {
                // console.log('    ' + t.obj.title);
                console.log('    ' + chalk.green(t.obj.title));
                t.wunderNotes.forEach(function(n) {
                  console.log('        Note: [' + n.obj.content.replace(/\n/g, ' ') + ']');
                });
                t.wunderSubtasks.forEach(function(n) {
                  console.log('        Subtask: [' + n.obj.title + ']');
                });
                t.wunderComments.forEach(function(n) {
                  console.log('        Comment: [' + n.obj.text + ']');
                });
              });
            });
        }); 
      });
    });
  });

program
  .parse(process.argv);

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
