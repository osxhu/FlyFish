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
  config.middleware = [ 'errorHandler', 'notfoundHandler' ];


  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    url: 'mongodb://10.2.3.56:27017/flyfish',
    options: {
      useUnifiedTopology: true,
    },
  };

  config.cluster = {
    listen: {
      port: 7001,
      hostname: '10.2.3.56',
    },
  };

  config.cookieConfig = {
    name: 'FLY_FISH_V2.0',
    domain: '10.2.3.56',
    encryptionKey: 'BYkCpvTfyZ%hrJYSrOUWxPhrJAOZcVZo',
  };
  
  const staticDir = '/www';
  config.pathConfig = {
    staticDir,
  };

  return {
    ...config,
    ...userConfig,
  };
};
