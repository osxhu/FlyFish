'use strict';
const CODE = require('../lib/error');

module.exports = options => {
  return async function authCheck(ctx, next) {
    const userId = ctx.cookies.get('userId');
    if (!options.reqUrlWhiteList.includes(ctx.url) && !userId) {
      ctx.body = {
        code: CODE.AUTH_FAIL,
        msg: 'AUTH FAIL',
        data: null,
      };
      ctx.status = 403;
      return;
    }

    ctx.userId = userId;
    await next();
  };
};

