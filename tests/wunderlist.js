#!/usr/bin/env node
console.log("good bye world");

var rest = require('restler');
var options = { headers: { 'X-Access-Token': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
                           'X-Client-ID': '6cca1923696f790a903d'} };

rest.get("http://a.wunderlist.com/api/v1/lists", options).on('complete', function(data, resp) { 
    console.log("lists response " + resp.statusCode);
    if (resp.statusCode == 200) {
        console.log("data.length " + data.length);
        data.forEach(function(elem, index, array) { console.log(elem); });
    }
});

// vim:fileencoding=UTF-8:ts=4:sw=4:sta:et:sts=4:ai

