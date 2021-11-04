'use strict';

// 组件类型
exports.COMPONENT_TYPE = {
  COMMON: 'common', // 公共组件
  PROJECT: 'project', // 项目组件
};

// 组件开发状态
exports.COMPONENT_DEVELOP_STATUS = {
  DOING: 'doing', // 开发中
  ONLINE: 'online', // 已上线
};

// 可用状态
exports.COMMON_STATUS = {
  VALID: 'valid', // 可用的
  INVALID: 'invalid', // 不可用的
};

exports.APP_DEVELOP_STATUS = {
  DOING: 'doing', // 开发中
  TESTING: 'testing', // 测试中
  DELIVERED: 'delivered', // 已交付
  DEMO: 'demo', // demo
};
