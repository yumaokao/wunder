#!/usr/bin/env node

'use strict';

var program = require('commander');
var WunderRoot = require('./libs/WunderRoot');
var pkg = require('./package');

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
      lists.forEach(function(elem, index, array) { console.log(elem); });
    });
  });

program
  .parse(process.argv);

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
