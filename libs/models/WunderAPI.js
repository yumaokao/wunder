'use strict';

var rest = require('restler');
var merge = require('merge');
var crypto = require('crypto');
var Promise = require('bluebird');
var path = require('path');
var fs = require('fs');
Promise.promisifyAll(fs);
var mkdirp = require('mkdirp');
Promise.promisifyAll(mkdirp);

var WunderAPI = function(obj, up) {
  this.obj = obj;
  this.up = up;

  this.config = up.config;
  this.baseURL = up.baseURL;
  this.options = up.options;
  this.cacheDir = up.cacheDir;
  this.useCache = up.useCache;

  this.uuid = crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

WunderAPI.prototype.sync = function() {
  // default do nothing but return self
  return this;
}

WunderAPI.prototype.getCache = function() {
  // console.log(this.cacheDir);
  var self = this;
  return new Promise(function(resolve, reject) {
    if (!self.useCache) {
      reject({ message: 'not using cache' });
    } else {
      fs.accessAsync(self.cacheDir)
        .then(function(err) { resolve(true); })
        .catch(function(resp) {
          // console.log(resp);
          reject({ message: 'no cache saved' });
        });
    }
  });
};

WunderAPI.prototype.saveCache = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    if (self.useCache) {
      fs.accessAsync(self.cacheDir)
        .then(function(err) { resolve(true); })
        .catch({ code: 'ENOENT' }, function(resp) {
          console.log(resp);
          return mkdirp.mkdirpAsync(self.cacheDir)
        })
        .then(function() {
          var cacheObj = {
            obj: self.obj,
            lists: self.wunderLists.map(function(l) { return l.obj; })
          };
          return fs.writeFileAsync(path.join(self.cacheDir, self.uuid),
            JSON.stringify(cacheObj));
        })
        .then(function() {
          resolve(true);
        })
        .catch(function(resp) { resolve(false); });
    } else {
      resolve(false);
    }
  });
};

WunderAPI.prototype.delete = function() {
  return this.del(this.node + this.obj.id + '?revision=' + this.obj.revision);
};

WunderAPI.prototype.update = function(updater) {
  // TODO: check keys in updater ?
  var data = updater;
  data['revision'] = this.obj.revision;
  return this.patch(this.node + this.obj.id, data);
};

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

WunderAPI.prototype.patch = function(aurl, nobj) {
  var wurl = this.baseURL + aurl;
  var opts = merge({}, this.options);
  opts.data = JSON.stringify(nobj);
  var self = this;

  return new Promise(function(resolve, reject) {
    rest.patch(wurl, opts).on('complete', function(data, resp) {
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

WunderAPI.prototype.del = function(aurl) {
  var wurl = this.baseURL + aurl;
  var opts = merge({}, this.options);
  var self = this;

  return new Promise(function(resolve, reject) {
    rest.del(wurl, opts).on('complete', function(data, resp) {
      // console.log("url response " + resp.statusCode);
      if (resp.statusCode == 204) {
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
