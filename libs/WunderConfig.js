'use strict';

var fs = require('fs');
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
  },
  Cache: {
    cacheDir: {
      format: String,
      doc: 'Directory where cacheObjs stores',
      default: undefined
    },
    useCache: {
      format: Boolean,
      doc: 'WunderCLI uses cache or not',
      default: false
    }
  }
};

var WunderConfig = function(paths) {
  if (paths === undefined)
    paths = [];
  this.conf = convict(schema);
  this.conf.loadFile(paths.filter(function(p) {
    try {
      return fs.statSync(p).isFile();
    } catch (err) { return false; } }));
  this.conf.validate();
};

WunderConfig.prototype.get = function(param) {
  return this.conf.get(param)
};

WunderConfig.prototype.validate = function(param) {
  return this.conf.validate(param);
};

module.exports = WunderConfig;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
