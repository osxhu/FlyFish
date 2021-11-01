'use strict';
module.exports = options => {
  return async function authCheck(ctx, next) {
    // const userId = ctx.cookies.get('userId');
    // if (!options.reqUrlWhiteList.includes(ctx.url) && !userId) return ctx.throw(403, 'NO_AUTH');
    // ctx.userId = userId;
    await next();
  };
};

