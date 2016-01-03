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
  .action(function(lists) {
    var cli = new WunderCLI(nconf.get('Auth'));
    var printer = new WunderPrinter();
    cli.sync()
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

// url: /lists
program
  .command('new-list <title>')
  .alias('nl')
  .description('New a list')
  .action(function(title) {
    var cli = new WunderCLI(nconf.get('Auth'));
    cli.addList({ 'title': title })
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
      .then(function(cli) { return sel.selectLists(cli, 'delete', { 'lists': lists }); })
      .then(function(ls) {})
      .then(cli.deleteLists)
      .then(function() { console.log('Successfully Deleted'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
    // console.log('YMK in command delte-list');
  });
program
  .command('rename-list [lists...]')
  .alias('rl')
  .description('Rename lists')
  .option('-t, --titles [title]', 'New titles in order', function(v, t) { t.push(v); return t; }, [])
  .action(function(lists, options) {
    var cli = new WunderCLI(nconf.get('Auth'));
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'rename', { 'lists': lists }, false); })
      // .then(cli.deleteLists)
      .then(function(ls) { console.log(ls); })
      .then(function() { console.log('Successfully Renamed'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

// url: /tasks

program
  .command('*')
  .action(function() {
    program.outputHelp();
  });

program
  .parse(process.argv);

// default goes to lists
if (!process.argv.slice(2).length) {
    var cli = new WunderCLI(nconf.get('Auth'));
    var printer = new WunderPrinter();
    cli.sync()
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
}

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
