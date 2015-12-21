#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('./package');
var WunderCLI = require('./libs/WunderCLI');

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
    var cli = new WunderCLI();
    cli.lists();
    cli.sync().then(function() { console.log('YMK synced'); });;
  });

program
  .parse(process.argv);

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
