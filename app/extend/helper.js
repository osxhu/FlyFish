'use strict';

exports.handler = ({ code, msg, data }) => {
  if (code !== 200) this.ctx.throw(code, msg);
  return data;
};
