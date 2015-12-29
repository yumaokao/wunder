#!/usr/bin/env node

'use strict';

var program = require('commander');
var pkg = require('./package');
var nconf = require('nconf');
var WunderCLI = require('./libs/WunderCLI');
var WunderPrinter = require('./libs/WunderPrinter');
var WunderSelector = require('./libs/WunderSelector');

// Default configurations
nconf.defaults({
  'Auth': {
    'baseURL': 'http://a.wunderlist.com/api/v1',
    'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
    'clientID': '6cca1923696f790a903d'
  }
});

program
  .version(pkg.version)
  .option('-c, --conf <dir>', 'Specific another configuration directory');

// [auth]
program
  .command('auth')
  .description('[TODO] Auth wunder')
  .action(function() {
    console.log('YMK in command program.conf ' + program.conf);
    console.log(nconf.get('Auth'));
    // nconf.file();
  });

// [list]
program
  .command('list [lists...]')
  .alias('ls')
  .description('List all lists and tasks with filters')
  .action(function(option) {
    // var lists = option.lists || 'all';

    var cli = new WunderCLI(nconf.get('Auth'));
    var printer = new WunderPrinter();
    cli.sync()
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

// url: /lists
program
  .command('add-list <title>')
  .alias('al')
  .description('Add a list')
  .action(function(title, option) {
    var cli = new WunderCLI(nconf.get('Auth'));
    var nobj = { 'title': title };
    cli.addList(nobj)
      .then(function() { console.log('Successfully Added'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('delete-list [lists...]')
  .alias('dl')
  .description('Delete lists')
  .action(function(lists) {
    var cli = new WunderCLI(nconf.get('Auth'));
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, { 'lists': lists }); })
      .then(function(lists) {
        var list = lists[0];
        return list.delete();
      })
      .catch(function(err) { console.log('Failed: ' + err.message); });
    // console.log('YMK in command delte-list');
  });

program
  .parse(process.argv);

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
