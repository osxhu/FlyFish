/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1635235048156_3836';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'notfoundHandler', 'accessLogger' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    url: 'mongodb://10.0.14.151:27017/flyfish',
    options: {
      useUnifiedTopology: true,
    },
  };

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '10.0.14.151',
    },
  };

  config.componentGit = {
    namespaceId: 2826,
    privateToken: 'cetyg4VERmdwxQBAGgsF',
  };

  const staticDir = '/www';

  config.pathConfig = {
    staticDir,
  };

  config.static = {
    prefix: '/',
    dir: staticDir,
    // dynamic: true,
    // preload: false,
    // maxAge: 31536000,
    // buffer: true,
  };

  return {
    ...config,
    ...userConfig,
  };
};
