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
	  it.skip('should have same hash with/without wunderLists', function (done) {
      var cli = new WunderCLI(conf.get('Auth'));
      var hash0;
      cli.sync()
        .then(function(cli) {
          var shasum = crypto.createHash('sha256');
          cli.should.have.property('root');
          var root = cli.root;
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
          shasum.update(JSON.stringify(cli.root.obj));
          shasum.digest('hex').should.be.equal(hash0);
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
      var cli = new WunderCLI(conf.get('Auth'));
      cli.sync()
        .then(function(cli) {
          var shasum = crypto.createHash('sha256');
          cli.should.have.property('root');
          var cacheObj = {
            obj: cli.root.obj,
            lists: cli.root.wunderLists.map(function(l) { return l.obj; })
          };
          shasum.update(JSON.stringify(cacheObj.obj));
          return fs.writeFileAsync(process.cwd() + '/test/caches/' + shasum.digest('hex') + '.json',
                            JSON.stringify(cacheObj));
        })
        .then(function(cli) { done() })
        .catch(function(err) { done(err); });
    });
	  it('clear \'test/caches/\'', function (done) {
      rimrafAsync(process.cwd() + '/test/caches/')
        .then(function() { done(); })
        .catch(function(err) { done(err); });
    });
  });
	describe('Root changed', function () {
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
