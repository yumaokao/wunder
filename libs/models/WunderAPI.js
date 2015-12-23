'use strict';

var rest = require('restler');
var merge = require('merge');
var Promise = require('bluebird');

var WunderAPI = function(obj, up) {
  this.obj = obj;
  this.up = up;
  this.options = up.options;
  this.baseURL = up.baseURL;
}

WunderAPI.prototype.fetchAs = function(aurl, target, newer) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.get(aurl)
      .then(function(data) {
        self[target] = data.map(function(d) { return new newer(d, self); });
        resolve(self[target]);
      })
      .catch(function(resp) { reject(resp); });
  });
};

WunderAPI.prototype.get = function(aurl) {
  var wurl = this.baseURL + aurl;
  var opts = merge({}, this.options);
  var self = this;

  return new Promise(function(resolve, reject) {
    rest.get(wurl, opts).on('complete', function(data, resp) {
      // console.log("url response " + resp.statusCode);
      if (resp.statusCode == 200) {
        resolve(data);
      } else {
        var error = new WunderError(resp);
        reject(error);
      }
    });
  });
};

WunderAPI.prototype.post = function(aurl, nobj) {
  var wurl = this.baseURL + aurl;
  var opts = merge({}, this.options);
  opts.data = JSON.stringify(nobj);
  var self = this;

  return new Promise(function(resolve, reject) {
    rest.post(wurl, opts).on('complete', function(data, resp) {
      // console.log("url response " + resp.statusCode);
      if (resp.statusCode == 201) {
        resolve(data);
      } else {
        var error = new WunderError(resp);
        reject(error);
      }
    });
  });
};

var WunderError = function(resp) {
  this.method = resp.req.method;
  this.path = resp.req.path;
  this.code = resp.statusCode;
  this.error = resp.statusMessage;
  this.message = this.method + ' ' + this.path + ' => ' + this.code + ': ' + this.error;
}

module.exports = WunderAPI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
