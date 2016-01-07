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
    'accessToken': '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5',
    'clientID': '501cd26b0b953ee66cb2'
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
    var sel = new WunderSelector();
    var printer = new WunderPrinter();
    cli.sync()
      .then(function(cli) { return sel.selectListLists(cli, { 'lists': lists }); })
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

// url: /lists
program
  .command('new-lists <titles...>')
  .alias('nl')
  .description('New lists')
  .action(function(titles) {
    var cli = new WunderCLI(nconf.get('Auth'));
    cli.newLists(titles)
      .then(function(res) { console.log(res.length + ' Lists Successfully Created'); })
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
      .then(function(cli) { return sel.selectDeleteLists(cli, { 'lists': lists }); })
      .then(function(ls) { return sel.confirmDeleteLists(ls); })
      .then(cli.deleteLists)
      .then(function(res) { console.log(res.length + ' Lists Successfully Deleted'); })
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
      .then(function(cli) { return sel.selectRenameLists(cli, { 'lists': lists }); })
      .then(function(ols) { return sel.inputRenameTitles(ols, options.titles); })
      .then(function(obj) { return cli.renameLists(obj.lists, obj.titles); })
      .then(function(res) { console.log(res.length + ' Lists Successfully Renamed'); })
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
