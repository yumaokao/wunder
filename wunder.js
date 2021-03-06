#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var program = require('commander');
var pkg = require('./package');
var Promise = require('bluebird');
var WunderCLI = require('./libs/WunderCLI');
var WunderPrinter = require('./libs/WunderPrinter');
var WunderSelector = require('./libs/WunderSelector');
var WunderConfig = require('./libs/WunderConfig');


var loadProgramConfigs = function(args) {
  var configPaths = [ path.join(process.env.PWD, '/.config/', pkg.name + '.json'),
                      path.join(process.env.HOME, '/.config/', pkg.name + '.json') ];
  var paths;
  paths = args.conf.filter(function(p) { return p !== undefined; });
  paths = paths.map(function(p) { return path.join(p, pkg.name + '.json'); });
  var conf;
  try {
    conf = new WunderConfig(configPaths.concat(paths));
  } catch(error)  {
    console.log('Failed: Configuration ' + error);
    process.exit();
  }

  // from args explicitily
  if (args.useCache !== undefined)
     conf.set('Cache.useCache', args.useCache);
  return conf;
};

function collect(val, memo) {
    memo.push(val);
    return memo;
}


program
  .version(pkg.version)
  .option('-c, --conf <dir>', 'Specific another configuration directory', collect, [])
  .option('--use-cache', 'Use cache explicitily');

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
    var conf = loadProgramConfigs(program);
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
  .command('new-list <titles...>')
  .alias('nl')
  .description('New lists')
  .action(function(titles) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    cli.sync()
      .then(function(cli) { return cli.wunderRoot.newLists(titles); })
      .then(function(res) { console.log(res.length + ' Lists Successfully Created'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('update-list <updates...>')
  .alias('ul')
  .description('Update lists')
  .option('-l, --lists [lists]', 'Lists to update', function(v, t) { t.push(v); return t; }, [])
  .action(function(updates, options) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'update', { 'lists': options.lists }); })
      .then(function(ls) {
        if (ls.length !== updates.length)
          return Promise.reject({ message: 'Please give same number of updates as selected lists' });
        var upds = updates.map(function(u) { return JSON.parse(u); });
        return Promise.map(ls, function(l, i) { return l.update(upds[i]); });
      })
      .then(function(res) { console.log(res.length + ' Lists Successfully Updated'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('delete-list [lists...]')
  .alias('dl')
  .description('Delete lists')
  .action(function(lists) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'delete', { 'lists': lists }); })
      .then(function(ls) { return sel.confirmDeleteLists(ls); })
      .then(function(ls) { return Promise.map(ls, function(l) { return l.delete(); }); })
      .then(function(res) { console.log(res.length + ' Lists Successfully Deleted'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

// url: /tasks
program
  .command('new-task <titles...>')
  .alias('nt')
  .description('New tasks')
  .option('-l, --lists [lists]', 'Lists for newly tasks to place', function(v, t) { t.push(v); return t; }, [])
  .action(function(titles, options) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'add new tasks', { 'lists': options.lists }); })
      .then(function(ls) { return Promise.map(ls, function(l) { return l.newTasks(titles); }); })
      .then(function(res) { console.log(res.length + ' Tasks Successfully Created'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('update-task <updates...>')
  .alias('ut')
  .description('Update tasks')
  .option('-l, --lists [lists]', 'Lists to select tasks', function(v, t) { t.push(v); return t; }, [])
  .option('-t, --tasks [tasks]', 'Tasks to update', function(v, t) { t.push(v); return t; }, [])
  .action(function(updates, options) {
    var conf = loadProgramConfigs([ program.conf ]);
    var cli = new WunderCLI(conf);
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'to select tasks', { 'lists': options.lists }); })
      .then(function(ls) { return sel.selectTasks(ls, 'update', { 'tasks': options.tasks }); })
      .then(function(tsks) {
        if (tsks.length !== updates.length)
          return Promise.reject({ message: 'Please give same number of updates as selected tasks' });
        var upds = updates.map(function(u) { return JSON.parse(u); });
        return Promise.map(tsks, function(t, i) { return t.update(upds[i]); });
      })
      .then(function(res) { console.log(res.length + ' Tasks Successfully Updated'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });
program
  .command('delete-task [tasks...]')
  .alias('dt')
  .description('Delete tasks')
  .option('-l, --lists [lists]', 'Lists for newly tasks to place', function(v, t) { t.push(v); return t; }, [])
  .action(function(tasks, options) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    var sel = new WunderSelector();
    cli.sync()
      .then(function(cli) { return sel.selectLists(cli, 'to select tasks', { 'lists': options.lists }); })
      .then(function(ls) { return sel.selectTasks(ls, 'delete', { 'tasks': tasks }); })
      .then(function(tsks) { return sel.confirmDeleteTasks(tasks); })
      .then(function(tsks) { return Promise.map(tsks, function(t) { return t.delete(); }); })
      .then(function(res) { console.log(res.length + ' Tasks Successfully Deleted'); })
      .catch(function(err) { console.log('Failed: ' + err.message); });
  });

program
  .command('*')
  .action(function() {
    program.outputHelp();
  });

program
  .parse(process.argv);

// default goes to lists
if (!process.argv.slice(2).length) {
    var conf = loadProgramConfigs(program);
    var cli = new WunderCLI(conf);
    var printer = new WunderPrinter();
    cli.sync()
      .then(function(cli) { return cli.wunderRoot.wunderLists; })
      .then(printer.colorPrint)
      .catch(function(err) { console.log('Failed: ' + err.message); });
}

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
