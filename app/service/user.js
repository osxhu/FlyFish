'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');
class UserService extends Service {
  async userRegister(createUserInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsUsers = await ctx.model.User._findOne({ username: createUserInfo.username });
    if (!_.isEmpty(existsUsers)) {
      returnData.msg = 'user exists';
      return returnData;
    }

    createUserInfo.password = md5(createUserInfo.password);
    await ctx.model.User._create(createUserInfo);
    const userInfo = await ctx.model.User._findOne({ username: createUserInfo.username });

    returnData.data = userInfo;

    return returnData;
  }

  async userLogin(username, password) {
    const { ctx } = this;

    const result = await ctx.model.User._findOne({ status: Enum.COMMON_STATUS.VALID, username, password: md5(password) });

    return result || {};
  }

  async getUserInfo(userId) {
    const { ctx } = this;

    const result = await ctx.model.User._findOne({ _id: userId });

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

    await ctx.model.User._updateOne(id, updateData);
  }

  async getUserList(requestData) {
    const { ctx } = this;

    const { id, username, phone, email } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };

    if (id) queryCond.id = id;
    if (username) queryCond.username = username;
    if (phone) queryCond.phone = phone;
    if (email) queryCond.email = email;

    const total = await ctx.model.User._count(queryCond);
    const data = await ctx.model.User._find(queryCond, null, { sort: 'update_time', skip: requestData.curPage, limit: requestData.pageSize });

    return { total, data };
  }
}

module.exports = UserService;
