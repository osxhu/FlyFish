'use strict';

const Controller = require('egg').Controller;
const CODE = require('../lib/enum');
class BaseController extends Controller {
  async success(msg, data) {
    const { ctx } = this;
    ctx.body = {
      code: CODE.SUCCESS,
      msg,
      data,
    };
    ctx.status = 200;
  }

  async fail(msg, data, code = CODE.INTERNAL_ERR) {
    const { ctx } = this;
    ctx.body = {
      code,
      msg,
      data,
    };
    ctx.status = 200;
  }
}

module.exports = BaseController;
