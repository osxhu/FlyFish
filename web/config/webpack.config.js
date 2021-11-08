const path = require('path');
const modifyVars = require('./themes/dark.js');

// 详细扩展配置参考  https://www.npmjs.com/package/@chaoswise/scaffold

module.exports = {
  debugIe: false, // 是否在ie下调试(关闭热更新)
  useMultipleTheme: false, // 是否开启多主题
  isCombinePortal: false, // 是否开启对接portal的配置
  publicPath: '/',
  hot:true,
  isNoticeUpdate: true, // 是否开启升级通知
  routerType: 'hash', // 路由类型browser|hash  默认 hash  
  themes: [
    {
      name: 'light',
      entryPath: path.resolve(__dirname, './themes/light.js')
    }, 
    {
      name: 'dark',
      entryPath: path.resolve(__dirname, './themes/dark.js')
    }
  ],
  modifyVars, // 非多主题下样式变量
  htmlTagsPlugin: config => {
    config.tags = [
      'conf/env-config.js',
    ];
    return config;
  },
  htmlPlugin: config => {
    config.excludeAssets = [];
    return config;
  },
  devServer: config => {
    config.port = 8000;
    config.proxy = {
      '/api': {
          target: 'http://10.2.3.56:3000',
          // changeOrigin:true,
          pathRewrite:{
            "^/api":""
          }
      }
    };
    return config;
  }
};