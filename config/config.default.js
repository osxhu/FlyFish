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
  config.middleware = [ 'error_handler' ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.bodyParser = {
    jsonLimit: '10mb',
    formLimit: '10mb',
  };

  config.mongoose = {
    url: 'mongodb://localhost:27017/flyfish',
    options: {
      useUnifiedTopology: true,
    },
  };

  config.cluster = {
    listen: {
      port: 7001,
      // hostname: '127.0.0.1', // 不建议设置 hostname 为 '0.0.0.0'，它将允许来自外部网络和来源的连接，请在知晓风险的情况下使用
    },
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  // 路由鉴权白名单
  config.reqUrlWhiteList = [

  ];

  // egg-axios 配置
  config.http = {
    headers: {
      common: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
    },
    timeout: 10000,
  };

  return {
    ...config,
    ...userConfig,
  };
};
