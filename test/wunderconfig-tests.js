'use strict';
var chai = require('chai');
var should = require('chai').should();
var expect = require('chai').expect;
var convict = require('convict');

var schema = {
  Auth: {
    baseURL: {
      format: String,
      doc: 'WunderList API URL with version',
      default: 'http://a.wunderlist.com/api/v1'
    },
    accessToken: {
      format: function (val) { if (!/^[a-f0-9]{60}$/.test(val)) {
        throw new Error('should be a 60 character hex string'); }},
      doc: 'Access Token for user',
      default: '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5'
    },
    clientID: {
      format: function (val) { if (!/^[a-f0-9]{20}$/.test(val)) {
        throw new Error('should be a 20 character hex string'); }},
      doc: 'Application Client ID',
      default: '501cd26b0b953ee66cb2'
    }
  }
};

describe('WunderConfig', function() {
  var WunderConfig = require('../libs/WunderConfig');
	describe('Class convict', function () {
	  it('Auth', function (done) {
      var conf = convict(schema);
      conf.validate({ strict: true });
      JSON.stringify(conf.get('Auth')).should.be.equal(JSON.stringify({
        'baseURL': 'http://a.wunderlist.com/api/v1',
        'accessToken': '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5',
        'clientID': '501cd26b0b953ee66cb2' }));
      done();
    });
	  it('configuration null file \'not_exists.json\'', function (done) {
      var conf = convict(schema);
      expect(function() { conf.loadFile([ 'test/not_exists.json' ]); }).to.throw();
      done();
    });
	  it('configuration not valid file \'config0.json\'', function (done) {
      var conf = convict(schema);
      conf.loadFile(process.cwd() + '/test/configs/config0.json');
      expect(function() { conf.validate({ strict: true }); }).to.throw();
      done();
    });
	  it('configuration one valid file \'config1.json\'', function (done) {
      var conf = convict(schema);
      conf.loadFile(process.cwd() + '/test/configs/config1.json');
      // expect(function() { conf.validate({ strict: true }); }).to.not.throw();
      conf.validate({ strict: true });
      JSON.stringify(conf.get('Auth')).should.be.equal(JSON.stringify({
        'baseURL': 'http://a.wunderlist.com/api/v1',
        'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
        'clientID': '0123456789abcdefcf01' }));
      done();
    });
	  it('configuration two file \'config1.json\', \'config2.json\'', function (done) {
      var conf = convict(schema);
      conf.loadFile([ process.cwd() + '/test/configs/config1.json',
                      process.cwd() + '/test/configs/config2.json' ]);
      expect(function() { conf.validate({ strict: true }); }).to.not.throw();
      JSON.stringify(conf.get('Auth')).should.be.equal(JSON.stringify({
        'baseURL': 'http://a.wunderlist.com/api/v1',
        'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
        'clientID': '0123456789abcdefcf02' }));
      done();
    });
  });
	describe('Class WunderConfig', function () {
	  it('default values', function (done) {
      var conf = new WunderConfig();
      conf.validate({ strict: true });
      JSON.stringify(conf.get('Auth')).should.be.equal(JSON.stringify({
        'baseURL': 'http://a.wunderlist.com/api/v1',
        'accessToken': '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5',
        'clientID': '501cd26b0b953ee66cb2' }));
      done();
    });
	  it('class WunderConfig with \'config2.json\'', function (done) {
      var conf = new WunderConfig([ process.cwd() + '/test/configs/config2.json' ]);
      conf.validate({ strict: true });
      JSON.stringify(conf.get('Auth')).should.be.equal(JSON.stringify({
        'baseURL': 'http://a.wunderlist.com/api/v1',
        'accessToken': '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5',
        'clientID': '0123456789abcdefcf02' }));
      done();
    });
  });
});

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
