'use strict';
const CODE = require('../lib/error');
const _ = require('lodash');

module.exports = options => {
  return async function authCheck(ctx, next) {
    const userInfo = ctx.helper.getCookie();
    if (!options.reqUrlWhiteList.includes(ctx.url) && !userInfo.userId) {
      ctx.body = {
        code: CODE.AUTH_FAIL,
        msg: 'AUTH FAIL',
        data: null,
      };
      return;
    }

    ctx.userInfo = userInfo;
    await next();
  };
};

