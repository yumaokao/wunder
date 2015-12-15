#!/usr/bin/env node

'use strict';

var WunderRoot = require('../libs/WunderRoot');

var root = new WunderRoot();
root.fetch().then(function(r) {
  r.lists.forEach(function(elem, index, array) { console.log(elem.title); });
});
// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
