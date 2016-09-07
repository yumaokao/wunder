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

  # $ npm install --save wunderlist
  # $ npm install --save nconf
  # $ npm install --save blessed
  $ npm install --save commmander
  $ npm install --save restler
  $ npm install --save bluebird
  $ npm install --save chalk
  $ npm install --save string.prototype.repeat
  $ npm install --save merge
  $ npm install --save prompt
  $ npm install --save minimatch
  $ npm install --save convict
  $ npm install --save rimraf

  # for mocha
  $ sudo npm install -g mocha
  $ sudo npm install --save chai
  $ sudo npm install --save bdd-stdin

  # auto install
  $ npm install

* npm update
  code:: sh

  $ npm update


Mocha
-----
* tests
  code:: sh

  # run all tests
  $ mocha

  # run tests with filter
  $ mocha -f Sel
  WunderSelector
    parseNumberRange


Debug
-----
* node v6.5.0
  code:: sh

  # experimental feature
  $ node --inspect --debug-brk wunder.js

* node-inspector
  code:: sh

  $ sudo npm install -g node-inspector
  $ node-debug wunder.js

  # node v6.5.0 will lead to websocket_closed
  # TypeError: Cannot read property 'ref' of undefined
  #     at InjectorClient.<anonymous>
  #         (.../node-inspector/lib/InjectorClient.js:111:22)
  #
  # see https://github.com/node-inspector/node-inspector/issues/905

* deprecation
  code:: sh

  # use --trace-deprecation   show stack traces on deprecations
  $ node --trace-deprecation wunder.js dl
  Select: Lists to delete (e.g. 1,2,3-4):  (node:2306) DeprecationWarning: 'root' is deprecated, use 'global'
      at WunderSelector.selectLists (/home/yumaokao/stages/wunder/libs/WunderSelector.js:54:8)


Todo
----
* [$] 2015-12-14 ~ 2015-12-21 WunderList model class libraries
* [$] 2015-12-21 ~ 2015-12-21 Configuration infrastructure
* [$] 2015-12-21 ~ 2015-12-23 Error Handeling
* [$] 2015-12-23 ~ 2016-01-09 List adder, selector, deteler, renamer
* [$] 2015-12-29 ~ 2016-01-09 Move tests to mocha test
* [$] 2015-12-23 ~ 2016-01-09 lists match with wildcard
* [$] 2015-12-23 ~ 2016-01-10 test account
* [$] 2015-12-23 ~ 2016-01-10 config directories
* [ ] 2015-12-29 Task adder, selector, deteler, renamer, updater, completer
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
