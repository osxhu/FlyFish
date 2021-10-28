'use strict';

const Controller = require('egg').Controller;

class BaseController extends Controller {
  async success(code, msg, data) {
    const { ctx } = this;
    ctx.body = {
      code,
      msg,
      data,
    };
  }
}

module.exports = BaseController;
