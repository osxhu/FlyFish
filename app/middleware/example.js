'use strict';

module.exports = options => {
  return async function midName(ctx, next) {
    await next();
  };
};

