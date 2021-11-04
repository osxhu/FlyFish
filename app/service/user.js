'use strict';
const Service = require('egg').Service;
const md5 = require('md5');
const Enum = require('../lib/enum');

class UserService extends Service {
  async userLogin(username, password) {

    const { ctx } = this;
    const result = await ctx.model.User.findOne({ status: Enum.COMMON_STATUS.VALID, username, password: md5(password) });

    return result || {};
  }
}

module.exports = UserService;
