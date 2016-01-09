'use strict';

var convict = require('convict');

var WunderConfig = convict({
  Auth: {
    baseURL: {
      format: String,
      doc: 'WunderList API URL with version',
      default: 'http://a.wunderlist.com/api/v1'
    },
    accessToken: {
      format: String,
      doc: 'Access Token for user',
      default: '5fb8cfbdf5ae233d59db89d3bef6aaa273171e42c638f6dbb2b4ad6cd6a5'
    },
    clientID: {
      format: String,
      doc: 'Application Client ID',
      default: '501cd26b0b953ee66cb2'
    }
  }
});

// search ./.config/wunder.json, ~/.config/wunder.json configs
// nconf.file({ file: path.join(process.env.PWD, '/.config/', path.basename(process.argv[1], '.js') + '.json'), search: true });
// nconf.file({ file: path.join(process.env.HOME, '/.config/', path.basename(process.argv[1], '.js') + '.json'), search: true  });
// console.log(process.argv[1]);

module.exports = WunderConfig;

// vim:fileencoding=UTF-8:ts=2:sw=2:sta:et:sts=2:ai
