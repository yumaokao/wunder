#!/usr/bin/env node
'use strict';

var objs = ['I', 'II' , 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

var selector = function(tstr, objs) {
  var nums = tstr.split(',');
  // lis = lis.map(function(l) { return l.trim(); });
  var lls = nums.map(function(ns) {
    // console.log(ns);
    var ranges = ns.split('-');
    ranges = ranges.map(function(r) { return r.trim(); });
    var ind = Math.min.apply(Math, ranges);
    var end = Math.max.apply(Math, ranges);
    var len = (ranges.length == 2) ?
      Math.abs(ranges[1] - ranges[0]) + 1 : 1;
    // return objs.slice(ind - 1, len);
    return objs.slice(ind - 1, end);
  });
  var lists = [].concat.apply([], lls);
  lists = lists.filter(function(value, index, self) { return self.indexOf(value) === index; });
  console.log('Test: \'' + tstr + '\' --> (' + lists.length + ') ' + lists);
  return lists;
};

// Tests
selector('1,', objs);
selector('1, 2', objs);
selector('-1, 2', objs);
selector('-1, -2', objs);
selector('1, 1', objs);
selector('1,1, 1, 1', objs);
selector('2-3-5', objs);
selector('1,2, 3, 5 - 7', objs);
selector('1,2, 3, 5 - 11', objs);

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
