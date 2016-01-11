#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = require('./package');
var WunderCLI = require('./libs/WunderCLI');
var WunderPrinter = require('./libs/WunderPrinter');
var WunderSelector = require('./libs/WunderSelector');
var WunderConfig = require('./libs/WunderConfig');


var loadProgramConfigs = function(paths) {
  var configPaths = [ path.join(process.env.PWD, '/.config/', pkg.name + '.json'),
                      path.join(process.env.HOME, '/.config/', pkg.name + 'json') ];
  paths = paths.filter(function(p) { return p !== undefined; });
  paths = paths.map(function(p) { return path.join(p, pkg.name + '.json'); });
  var conf;
  try {
    conf = new WunderConfig(configPaths.concat(paths));
  } catch(error)  {
    console.log('Failed: Configuration ' + error);
    process.exit();
  }
  return conf;
};


program
  .version(pkg.version)
  .option('-c, --conf <dir>', 'Specific another configuration directory');

// [auth]
program
  .command('auth')
  .description('[TODO] Auth wunder')
  .action(function() {
    console.log('YMK in command program.conf ' + program.conf);
    console.log(WunderConfig);
    // WunderConfig.file();
  });

// [list]
program
  .command('list [lists...]')
  .alias('ls')
  .description('List all lists and tasks with filters')
  .action(function(lists) {
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
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
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
    cli.newLists(titles)
      .then(function(res) { console.log(res.length + ' Lists Successfully Created'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('delete-list [lists...]')
  .alias('dl')
  .description('Delete lists')
  .action(function(lists) {
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
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
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
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
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
    var printer = new WunderPrinter();
    cli.sync()
      .then(function(cli) { return cli.wunderRoot.wunderLists; })
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
}

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
