#!/usr/bin/env node

var WunderlistSDK = require('wunderlist');
var program = require('commander');
var wunderlistAPI = new WunderlistSDK({
    'accessToken': '93b7a581f3204d31128bb816f459a4842cceb460976e728f155c1b2ca63a',
    'clientID': '6cca1923696f790a903d'
});

program
    .version('0.0.1')
    .parse(process.argv);

// WunderlistSDK.initialized.then(function () { console.log("WunderlistSDK initialized"); });
wunderlistAPI.initialized.done(function () { console.log("wunderlistAPI initialized"); });
console.log("wunderlistAPI is initialized " + wunderlistAPI.isInitialized());
wunderlistAPI.http.lists.all()
    .done(function (lists) {
        console.log("lists " + lists);
    })
    .fail(function () {
        console.error('there was a problem');
    });

console.log("good bye world");

// vim:fileencoding=UTF-8:ts=4:sw=4:sta:et:sts=4:ai

