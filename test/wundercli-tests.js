'use strict';
var chai = require('chai');
var should = require('chai').should();
var stdin = require('bdd-stdin');
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);


var WunderCLI = require('../libs/WunderCLI');
var WunderSelector = require('../libs/WunderSelector');
var WunderConfig = require('../libs/WunderConfig');
var conf = new WunderConfig();

describe('WunderCLI', function() {
  this.timeout(30000);
	describe('Should always have a list \'inbox\' at head', function () {
	  it('should be have a title \'inbox\'', function (done) {
      var cli = new WunderCLI(conf.get('Auth'));
      cli.sync()
        // .then(function(cli) { done(new Error('a')); })
        .then(function(cli) {
          cli.should.have.property('wunderRoot');
          return cli.wunderRoot.wunderLists;
        })
        .then(function(lists) {
          lists.length.should.be.equal(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('could not be deleted', function (done) {
      var cli = new WunderCLI(conf.get('Auth'));
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.length.should.be.equal(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          return cli.deleteLists(lists);
        })
        .then(function(res) {
          res.should.be.equal(0);
          done();
        })
        .catch(function(err) {
          err.should.have.property('code').to.be.equal(422);
          done();
        });
    });
	  it.skip('could not be renamed', function (done) {
      done();
    });
  });
	describe('CRUD /list with a single [wunder test]', function () {
    var cli = new WunderCLI(conf.get('Auth'));
	  it('If exists, Delete [wunder test] [wunder rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) {
            return l.obj.title === 'wunder test' || l.obj.title === 'wunder rename';
          });
          return cli.deleteLists(wls);
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          return cli.newLists([ 'wunder test' ]);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('wunder test');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Update [wunder test] -> [wunder rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var titles = [ 'wunder rename' ];
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder test'; });
          return cli.renameLists(wls, titles);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('wunder rename');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete [wunder rename]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'wunder rename'; });
          wls.length.should.be.equal(1);
          return cli.deleteLists(wls);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [wunder rename] will be deleted', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'wunder test'; })
            .length.should.be.equal(0);
          lists.filter(function(l) { return l.obj.title === 'wunder rename'; })
            .length.should.be.equal(0);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
	describe('CRUD /list with two [crud_lists_0, crud_lists_1]', function () {
    var lasts = [ 'crud_lists_0', 'crud_lists_1', 'crud_lists_2' , 'crud_lists_3' ];
    var clsts = lasts.slice(0, 2);
    var ulsts = lasts.slice(2, 4);
    var cli = new WunderCLI(conf.get('Auth'));
	  it('If exists, Delete [ crud_lists_* ', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) {
            return lasts.indexOf(l.obj.title) !== -1;
          });
          return cli.deleteLists(wls);
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('Create [crud_lists_0, crud_lists_1]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return lasts.indexOf(l.obj.title) !== -1; })
            .length.should.be.equal(0);
          return cli.newLists([ 'crud_lists_0', 'crud_lists_1' ]);
        })
        .then(function(res) {
          res.length.should.be.equal(2);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [crud_lists_0, crud_lists_1]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return clsts.indexOf(l.obj.title) !== -1; })
            .length.should.be.equal(2);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Update [ _0, _1 ] -> [ _2, _3 ]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return clsts.indexOf(l.obj.title) !== -1; });
          return cli.renameLists(wls, ulsts);
        })
        .then(function(res) {
          res.length.should.be.equal(2);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Delete [_2, _3 ]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return ulsts.indexOf(l.obj.title) !== -1; });
          wls.length.should.be.equal(2);
          return cli.deleteLists(wls);
        })
        .then(function(res) {
          res.length.should.be.equal(2);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Read [ _0, _1, _2, _3 ] will be deleted', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return lasts.indexOf(l.obj.title) !== -1; })
            .length.should.be.equal(0);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

describe('WunderSelector', function() {
  this.timeout(30000);
	describe('parseNumberRange', function () {
    var sel = new WunderSelector();
    var objs = ['I', 'II' , 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    var pairs = [ { test: '1,', result: ['I'] },
                  { test: '1, 2', result: ['I', 'II'] },
                  { test: '-1, 2', result: ['II'] },
                  { test: '-1, -2', result: [] },
                  { test: '1, 1', result: ['I'] },
                  { test: '2-3-5', result: ['II', 'III', 'IV', 'V'] },
                  { test: '1,2, 3, 5 - 7', result: ['I', 'II', 'III', 'V', 'VI', 'VII'] },
                  { test: '1,2, 3, 5 - 11', result: ['I', 'II', 'III', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'] }
                ];
    function verifier(pair) {
      function v(done) {
        var res = sel.parseNumberRange(pair.test, objs);
        JSON.stringify(res).should.be.equal(JSON.stringify(pair.result));
        done();
      }
      return v;
    }
    pairs.forEach(function(p) { it(p.test, verifier(p)); });
  });
	describe('minimatch normal', function () {
    var minimatch = require('minimatch');
    var objs = ['I', 'II' , 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    var pairs = [ { test: 'I', result: ['I'] },
                  { test: 'I?', result: ['II', 'IV', 'IX'] },
                  { test: 'I*', result: ['I', 'II', 'III', 'IV', 'IX'] },
                  { test: '!I*', result: ['V', 'VI', 'VII', 'VIII', 'X'] },
                  { test: 'I+(I|X)', result: ['II', 'III', 'IX'] },
                  { test: '', result: [] },
                  { test: '*X', result: ['IX', 'X'] },
                  { test: '?X', result: ['IX'] },
                  { test: '*V*', result: ['IV', 'V', 'VI', 'VII', 'VIII'] },
                  { test: '?(I)V?(I)', result: ['IV', 'V', 'VI'] },
                  { test: '?(I)V?(I|X)', result: ['IV', 'V', 'VI'] }
                ];
    function verifier(pair) {
      function v(done) {
        var res = objs.filter(minimatch.filter(pair.test));
        JSON.stringify(res).should.be.equal(JSON.stringify(pair.result));
        done();
      }
      return v;
    }
    pairs.forEach(function(p) { it(p.test, verifier(p)); });
  });
	describe('minimatch escape', function () {
    var minimatch = require('minimatch');
    var objs = ['I', 'I?' , 'I+', 'I|', 'I*', 'I(V)', 'I+(?*)', 'I+(?|*)', 'IV', 'IX'];
    var pairs = [ { test: 'I', result: ['I'] },
                  { test: 'I?', result: ['I?', 'I+', 'I|', 'I*', 'IV', 'IX'] },
                  { test: 'I\\?', result: ['I?'] },
                  { test: 'I\\*', result: ['I*'] },
                  { test: 'I\\|', result: ['I|'] },
                  { test: '*\\**', result: ['I*', 'I+(?*)', 'I+(?|*)'] },
                  { test: 'I(V)', result: ['I(V)'] },
                  { test: 'I\\+(\\?\\*)', result: ['I+(?*)'] },
                  { test: 'I\\+(\\?\\|\\*)', result: ['I+(?|*)'] }
                ];
    function verifier(pair) {
      function v(done) {
        var res = objs.filter(minimatch.filter(pair.test));
        JSON.stringify(res).should.be.equal(JSON.stringify(pair.result));
        done();
      }
      return v;
    }
    pairs.forEach(function(p) { it(p.test, verifier(p)); });
  });
	describe('Select a list to delete', function () {
	  it('input [1] should be \'inbox\'', function (done) {
      var cli = new WunderCLI(conf.get('Auth'));
      var sel = new WunderSelector();
      cli.sync()
        .then(function(cli) {
          stdin('1', '\n');
          return sel.selectDeleteLists(cli, { 'lists': [] });
        })
        .then(function(lists) {
          lists.should.have.length(1);
          lists[0].should.have.property('obj');
          lists[0].obj.should.have.property('title').to.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
