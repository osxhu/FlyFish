'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');

class UserService extends Service {
  async userRegister(username, password, phone, email) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsUsers = await ctx.model.User.findOne({ username });
    if (!_.isEmpty(existsUsers)) {
      returnData.msg = 'user exists';
      return returnData;
    }

    await ctx.model.User.create({ username, phone, email, password: md5(password) });
    const userInfo = await ctx.model.User.findOne({ username });

    returnData.data = userInfo;

    return returnData;
  }

  async userLogin(username, password) {
    const { ctx } = this;

    const result = await ctx.model.User.findOne({ status: Enum.COMMON_STATUS.VALID, username, password: md5(password) });

    return result || {};
  }

}

module.exports = UserService;
