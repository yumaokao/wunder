'use strict';

var rest = require('restler');
var Promise = require('bluebird');

var WunderAPI = function() {
  this.token = '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a';
  this.client = '6cca1923696f790a903d';

  this.baseURL = 'http://a.wunderlist.com/api/v1';
  this.options = { headers: { 'X-Access-Token': this.token,
                              'X-Client-ID': this.client } };
};

WunderAPI.prototype.fetchAs = function(aurl, target) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.get(aurl)
      .then(function(data) {
        self[target] = data.map(function(d) { return new self.newers[target](d, self); });
        resolve(self[target]);
      })
      .catch(function(resp) { reject(resp); });
  });
};

WunderAPI.prototype.get = function(aurl) {
  var wurl = this.baseURL + aurl;
  var self = this;

  return new Promise(function(resolve, reject) {
    rest.get(wurl, self.options).on('complete', function(data, resp) {
      // console.log("url response " + resp.statusCode);
      if (resp.statusCode == 200) {
        resolve(data);
      } else {
        reject(resp);
      }
    });
  });
};

module.exports = WunderAPI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
