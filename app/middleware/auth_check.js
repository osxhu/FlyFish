'use strict';
module.exports = () => {
  return async function authCheck(ctx, next) {
    try {
      const userId = ctx.cookies.get('userId');
      if (!ctx.config.reqUrlWhiteList.includes(ctx.url) && !userId) return ctx.throw(403, 'NO_AUTH');
      ctx.userId = userId;
      await next();
    } catch (err) {
      ctx.logger.error(err.message);
    }
  };
};

