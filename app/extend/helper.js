'use strict';

exports.handler = ({ data: { code, msg, data } }) => {
  if (code !== 200) {
    this.ctx.throw(code, msg);
  }
  return data;
};
