'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');
class UserService extends Service {
  async userRegister(createUserInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsUsers = await ctx.model.User.findOne({ username: createUserInfo.username });
    if (!_.isEmpty(existsUsers)) {
      returnData.msg = 'user exists';
      return returnData;
    }

    createUserInfo.password = md5(createUserInfo.password);
    await ctx.model.User.create(toNewDoc(createUserInfo));
    const userInfo = toObj(await ctx.model.User.findOne({ username: createUserInfo.username }));

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

    const result = toObj(await ctx.model.User.findOne({ _id: userId }));

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

    await ctx.model.User.updateOne({ _id: id }, toUpdateDoc(updateData));
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
    const data = (await ctx.model.User.find(queryCond)).map(toObj);

    return { total, data };
  }
}

function toObj(doc) {
  if (_.isEmpty(doc)) return {};
  const obj = {
    id: doc._id.toString(),
    createTime: doc.create_time && doc.create_time.getTime(),
    updateTime: doc.update_time && doc.update_time.getTime(),
    username: doc.username,
    role: doc.role,
    email: doc.email,
    phone: doc.phone,
    status: doc.status,
  };

  return obj;
}

function toNewDoc(obj) {
  const doc = {
    update_time: Date.now(),
    create_time: Date.now(),
  };

  if (obj.username) doc.username = obj.username;
  if (obj.password) doc.password = obj.password;
  if (obj.role) doc.role = obj.role;
  if (obj.email) doc.email = obj.email;
  if (obj.phone) doc.phone = obj.phone;
  if (obj.status) doc.status = obj.status;

  return doc;
}

function toUpdateDoc(obj) {
  const doc = {
    update_time: Date.now(),
  };

  if (obj.username) doc.username = obj.username;
  if (obj.role) doc.role = obj.role;
  if (obj.email) doc.email = obj.email;
  if (obj.phone) doc.phone = obj.phone;
  if (obj.status) doc.status = obj.status;

  return doc;
}

module.exports = UserService;
