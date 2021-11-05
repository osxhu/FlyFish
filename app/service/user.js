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

  async getUserInfo(userId) {
    const { ctx } = this;

    const result = await ctx.model.User.findOne({ _id: userId });

    return result || {};
  }

  async updateUserInfo(id, requestData) {
    const { ctx } = this;
    const { disable, password, phone, email } = requestData;

    const updateData = {};
    if (disable) updateData.status = Enum.COMMON_STATUS.INVALID;
    if (password) updateData.password = md5(password);

    if (phone) updateData.phone = phone;
    if (email) updateData.email = email;

    const result = await ctx.model.User.updateOne({ _id: id }, updateData);

    return result || {};
  }

  async getUserList(requestData) {
    const { ctx } = this;

    const { id, username, phone, email } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };

    if (id) queryCond._id = id;
    if (username) queryCond.username = username;
    if (phone) queryCond.phone = phone;
    if (email) queryCond.email = email;

    const total = await ctx.model.User.count(queryCond);
    const data = await ctx.model.User.find(queryCond);

    return { total, data };
  }
}

module.exports = UserService;
