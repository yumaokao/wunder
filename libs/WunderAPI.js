'use strict';

var url = require('url');
var rest = require('restler');

var WunderAPI = function() {
  this.token = '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a';
  this.client = '6cca1923696f790a903d';

  this.baseURL = 'http://a.wunderlist.com/api/v1';
  this.options = { headers: { 'X-Access-Token': this.token,
                              'X-Client-ID': this.client } };
};

WunderAPI.prototype.get = function(aurl, callbacks) {
  // var wurl = url.resolve(this.baseURL, aurl);
  var wurl = this.baseURL + aurl;
  // console.log('API get url ' + wurl);

  rest.get(wurl, this.options).on('complete', function(data, resp) { 
    console.log("url response " + resp.statusCode);
    if (resp.statusCode == 200) {
      console.log("data.length " + data.length);
      data.forEach(function(elem, index, array) { console.log(elem); });
    }
  });
}

module.exports = WunderAPI;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
