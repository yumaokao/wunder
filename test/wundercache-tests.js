'use strict';
var chai = require('chai');
var should = require('chai').should();

var Promise = require('bluebird');
var WunderCLI = require('../libs/WunderCLI');
var WunderConfig = require('../libs/WunderConfig');
var conf = new WunderConfig();
var crypto = require('crypto');
var fs = require('fs');
Promise.promisifyAll(fs);
var rimrafAsync = Promise.promisify(require("rimraf"));


describe('WunderCache', function() {
  this.timeout(30000);
	describe('Root with sha256', function () {
	  it('should have same hash with/without wunderLists', function (done) {
      var cli = new WunderCLI(conf);
      var hash0;
      cli.sync()
        .then(function(cli) {
          var shasum = crypto.createHash('sha256');
          cli.should.have.property('root');
          var root = cli.wunderRoot;
          var cacheObj = {
            obj: root.obj,
            lists: root.wunderLists.map(function(l) { return l.obj; })
          };
          // console.log(JSON.stringify(cacheObj));
          shasum.update(JSON.stringify(cacheObj.obj));
          hash0 = shasum.digest('hex');
          // console.log(shasum.digest('hex'));
          return cli.sync();;
        })
        .then(function(cli) {
          var shasum = crypto.createHash('sha256');
          cli.should.have.property('root');
          shasum.update(JSON.stringify(cli.wunderRoot.obj));
          shasum.digest('hex').should.be.equal(hash0);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
	describe('Root with sha256 modified', function () {
    var cli = new WunderCLI(conf);
    var hash0;
    var hash1;
	  it('clear list [cache test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'cache test'; });
          return cli.deleteLists(wls);
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('hash0 value', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot; })
        .then(function(root) {
          var shasum = crypto.createHash('sha256');
          shasum.update(JSON.stringify(root.obj));
          hash0 = shasum.digest('hex');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('Create [cache test]', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          lists.filter(function(l) { return l.obj.title === 'cache test'; })
            .length.should.be.equal(0);
          return cli.newLists([ 'cache test' ]);
        })
        .then(function(res) {
          res.length.should.be.equal(1);
          res[0].title.should.be.equal('cache test');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('hash(root) should not be equal to hash0', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot })
        .then(function(root) {
          var shasum = crypto.createHash('sha256');
          shasum.update(JSON.stringify(root.obj));
          hash1 = shasum.digest('hex')
          hash1.should.not.be.equal(hash0);
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('clear list [cache test] after', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot.wunderLists; })
        .then(function(lists) {
          var wls = lists.filter(function(l) { return l.obj.title === 'cache test'; });
          return cli.deleteLists(wls);
        })
        .then(function(res) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('hash(root) should not be equal to hash0 or hash1', function (done) {
      cli.sync()
        .then(function(cli) { return cli.wunderRoot })
        .then(function(root) {
          var shasum = crypto.createHash('sha256');
          shasum.update(JSON.stringify(root.obj));
          var hash = shasum.digest('hex');
          hash.should.not.be.equal(hash0);
          hash.should.not.be.equal(hash1);
          done();
        })
        .catch(function(err) { done(err); });
    });
  });
	describe('Root in cache', function () {
	  it('make a clean \'test/caches/\'', function (done) {
      rimrafAsync(process.cwd() + '/test/caches/')
        .then(function() { fs.mkdirAsync(process.cwd() + '/test/caches/'); })
        .then(function() { done(); })
        .catch(function(err) { done(err); });
    });
	  it('save root/cacheObj to cache file with hash file name', function (done) {
      var cli = new WunderCLI(conf);
      cli.sync()
        .then(function(cli) {
          var shasum = crypto.createHash('sha256');
          cli.should.have.property('wunderRoot');
          cli.wunderRoot.should.have.property('wunderLists');
          cli.wunderRoot.wunderLists.length.should.be.equal(1);
          cli.wunderRoot.wunderLists[0].obj.title.should.be.equal('inbox');
          var cacheObj = {
            obj: cli.wunderRoot.obj,
            lists: cli.wunderRoot.wunderLists.map(function(l) { return l.obj; })
          };
          shasum.update(JSON.stringify(cacheObj.obj));
          return fs.writeFileAsync(process.cwd() + '/test/caches/' + shasum.digest('hex') + '.json',
                            JSON.stringify(cacheObj));
        })
        .then(function(cli) { done(); })
        .catch(function(err) { done(err); });
    });
	  it('read root/cacheObj from cache file with hash file name', function (done) {
      var cli = new WunderCLI(conf);
      cli.root()
        .then(function(root) {
          var shasum = crypto.createHash('sha256');
          shasum.update(JSON.stringify(root.obj));
          return fs.readFileAsync(process.cwd() + '/test/caches/' + shasum.digest('hex') + '.json', 'utf8');
        })
        .then(JSON.parse)
        .then(function(root) {
          root.should.have.property('lists');
          root.lists.length.should.be.equal(1);
          root.lists[0].title.should.be.equal('inbox');
          done();
        })
        .catch(function(err) { done(err); });
    });
	  it('clear \'test/caches/\'', function (done) {
      rimrafAsync(process.cwd() + '/test/caches/')
        .then(function() { done(); })
        .catch(function(err) { done(err); });
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
