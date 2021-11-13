'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const Enum = require('../lib/enum');


class TradeService extends Service {
  async create(params) {
    const { ctx } = this;
    const isExist = await ctx.model.Trade._findOne({ ...params, status: Enum.COMMON_STATUS.VALID });
    if (!_.isEmpty(isExist)) return;
    return await ctx.model.Trade._create(params);
  }

  async getList() {
    const { ctx } = this;
    const list = await ctx.model.Trade._find({ status: Enum.COMMON_STATUS.VALID });

    return {
      list,
    };
  }
}

module.exports = TradeService;
