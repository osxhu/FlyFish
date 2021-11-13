'use strict';
const Service = require('egg').Service;
const _ = require('lodash');

const Enum = require('../lib/enum');

class ApplicationService extends Service {
  async create(params) {
    const { ctx } = this;
    const userInfo = ctx.userInfo;

    Object.assign(params, {
      creator: userInfo.userId,
      updater: userInfo.userId,
    });

    return await ctx.model.Application._create(params);
  }
}

module.exports = ApplicationService;
