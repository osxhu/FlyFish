'use strict';
const CODE = require('../lib/error');
const _ = require('lodash');

module.exports = config => {
  return async function authCheck(ctx, next) {
    const { reqUrlWhiteList, cookieConfig: { doucCookieName, name }, services: { douc: { baseURL } } } = config;

    const doucCookieValue = ctx.cookies.get(doucCookieName, { signed: false });
    const lcapCookieValue = ctx.cookies.get(name, { signed: false });

    // douc用户鉴权
    if (doucCookieValue) {
      const userInfo = await ctx.service.userDouc.syncUser();
      if (_.isEmpty(userInfo)) {
        ctx.status = 301;
        return ctx.redirect(baseURL + '/lcapWeb/index.html');
      }
      await next();
    // lcap用户鉴权
    } else if (lcapCookieValue) {
      const userInfo = ctx.helper.getCookie();
      if (userInfo.userId) {
        ctx.userInfo = userInfo;
        await next();
      }
    // 白名单
    } else if (reqUrlWhiteList.includes(ctx.url)) {
      await next();
    } else {
      ctx.body = {
        code: CODE.AUTH_FAIL,
        msg: 'AUTH FAIL',
        data: null,
      };
      return;
    }
  };
};

