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
  $ npm install --save merge
  $ npm install --save prompt
  $ npm install --save minimatch

  # for mocha
  $ sudo npm install -g mocha
  $ sudo npm install --save chai
  $ sudo npm install --save bdd-stdin

  # auto install
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
* [$] 2015-12-21 ~ 2015-12-23 Error Handeling
* [%] 2015-12-23 List adder, selector, deteler, renamer
* [ ] 2015-12-29 Move tests to mocha test
* [ ] 2015-12-29 Task adder, selector, deteler, renamer, updater, completer
* [ ] 2015-12-23 Padding with padding configs
* [ ] 2015-12-23 Auth to generate access token per user
* [ ] 2015-12-23 Refactor WunderAPI.js
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
