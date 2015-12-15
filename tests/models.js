#!/usr/bin/env node

'use strict';

function Obj(obj) {
  this.obj = obj;
};

Obj.prototype.show = function() {
  console.log("show TITLE " + this.obj.title + " ID " + this.obj.id);
};

var objs = [
  {'title': 'A', 'id': 'id_a'},
  {'title': 'B', 'id': 'id_b'},
  {'title': 'C', 'id': 'id_c'},
  {'title': 'D', 'id': 'id_d'}
];

// objs.forEach(function(o) { console.log(o.title); });
objs.map(function(o) { return new Obj(o); }).forEach(function(o) { o.show(); });

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
