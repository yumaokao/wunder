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

describe('WundeCLI JSON parameters', function() {
	describe('One JSON input string', function () {
	  it('{"title":"mytitle","complete":false}', function (done) {
      var obj = JSON.parse('{"title":"mytitle","completed":false}');
      obj.should.have.property('title').to.be.equal('mytitle');
      obj.should.have.property('completed').to.be.equal(false);
      done();
    });
  });
	describe('Multiple JSON input strings', function () {
	  it('{"title":"mytitle","complete":false}, ...', function (done) {
      var strs = ['{"title":"mytitle","completed":false}',
                  '{"title":"mytitle1","completed":true}',
                  '{"title":"mytitle2","starred":true}',
                  '{"title":"mytitle3","remove":["due_date"]}'];
      var objs = strs.map(function(s) { return JSON.parse(s); });
      objs.should.have.property('length').to.be.equal(4);
      objs[0].should.have.property('title').to.be.equal('mytitle');
      objs[0].should.have.property('completed').to.be.equal(false);
      objs[1].should.have.property('title').to.be.equal('mytitle1');
      objs[1].should.have.property('completed').to.be.equal(true);
      objs[2].should.have.property('title').to.be.equal('mytitle2');
      objs[2].should.have.property('starred').to.be.equal(true);
      objs[3].should.have.property('title').to.be.equal('mytitle3');
      objs[3].should.have.property('remove').should.have.property('length');
      objs[3]['remove'].should.have.property('length').to.be.equal(1);;
      objs[3]['remove'][0].should.be.equal('due_date');
      done();
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
      var cli = new WunderCLI(conf);
      var sel = new WunderSelector();
      cli.sync()
        .then(function(cli) {
          stdin('1', '\n');
          return sel.selectLists(cli, 'delete', { 'lists': [] });
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
