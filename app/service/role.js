'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const _ = require('lodash');
class RoleService extends Service {
  async add(createRoleInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };
    const existsRoles = await ctx.model.Role.findOne({ name: createRoleInfo.name });
    if (!_.isEmpty(existsRoles)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    await ctx.model.Role.create(createRoleInfo);
    const result = await ctx.model.Role.findOne({ name: createRoleInfo.name });
    returnData.data = result;

    return returnData;
  }

  async updateBasicInfo(id, updateInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };

    if (updateInfo.name) {
      const existsRoles = await ctx.model.Role.findOne({ name: updateInfo.name });
      if (!_.isEmpty(existsRoles)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
    }

    await ctx.model.Role.updateOne({ _id: id }, updateInfo);

    return returnData;
  }

  async updateMembersInfo(id, updateInfo) {
    const { ctx } = this;

    const members = _.uniq(updateInfo.members || []);
    await ctx.model.User.updateMany({ _id: { $in: members } }, { role: id });
  }

  async updateAuthInfo(id, updateInfo) {
    const { ctx } = this;

    await ctx.model.Role.updateOne({ _id: id }, updateInfo);
  }

  async delete(id) {
    const { ctx } = this;

    const returnData = { msg: 'ok' };
    const result = await ctx.model.User.findOne({ role: id });
    if (!_.isEmpty(result)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    await ctx.model.Role.updateOne({ _id: id }, { status: Enum.COMMON_STATUS.INVALID });
    return returnData;
  }

  async getRoleList(requestData) {
    const { ctx } = this;

    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };
    if (requestData.id) queryCond._id = requestData.id;

    const total = await ctx.model.Role.count(queryCond);
    const data = await ctx.model.Role.find(queryCond).sort('update_time').skip(requestData.curPage)
      .limit(requestData.pageSize);

    return { total, data };
  }

  async getRoleInfo(id) {
    const { ctx } = this;

    const roleInfo = await ctx.model.Role.findOne({ _id: id });
    const members = await ctx.model.User.find({ role: id });

    roleInfo._doc.members = (members || []).map(member => {
      return {
        id: member._id.toString(),
        username: member.username,
        email: member.email,
        phone: member.phone,
      };
    });

    return roleInfo;
  }
}

module.exports = RoleService;
