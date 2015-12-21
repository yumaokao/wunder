wunder
======

Introduction
------------
* `wunder` is a command line interface of WunderList.
* features:
  + command line interface 


Wanted
------
* Wanted features
  + interactive interface
  + ncurses interface


Build Up
--------
* initial a npm package
  code:: sh

  $ npm init
  $ node wunder.js

* npm install
  code:: sh

  $ npm install --save commmander
  # $ npm install --save wunderlist
  $ npm install --save restler
  $ npm install --save blessed
  $ npm install --save bluebird
  $ npm install --save chalk
  $ npm install --save string.prototype.repeat
  $ npm install --save nconf

  $ npm install


Debug
-----
* node-inspector
  code:: sh

  $ sudo npm install -g node-inspector
  $ node-debug wunder.js


Todo
----
* [$] 2015-12-14 ~ 2015-12-21 WunderList model class libraries
* [$] 2015-12-21 ~ 2015-12-21 Configuration infrastructure
* [ ] 2015-12-21 Error Handeling
* [ ] 2015-12-14 Model with local cache with version

Reference
---------
.. _Documentation: https://developer.wunderlist.com/documentation
.. _WunderLine: http://www.wunderline.rocks/
.. _CommandLineNodeJs: https://developer.atlassian.com/blog/2015/11/scripting-with-node/
.. _DebugNodeJs: http://spin.atomicobject.com/2015/09/25/debug-node-js/
.. _NodeStyleGuide:  https://github.com/felixge/node-style-guide
.. _NodeModulePatterns: https://darrenderidder.github.io/talks/ModulePatterns

.. vim:fileencoding=UTF-8:ts=4:sw=4:sta:et:sts=4:ai
