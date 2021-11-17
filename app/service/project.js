'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const Enum = require('../lib/enum');

class ProjectService extends Service {
  async create(params) {
    const { ctx } = this;

    const projectData = await this.assembleProjectData(params);
    if (!projectData) return;

    Object.assign(projectData, {
      creator: ctx.userInfo.userId,
    });
    return await ctx.model.Project._create(projectData);
  }

  async assembleProjectData(params, update = false) {
    const { ctx } = this;

    if (!update) {
      const existProject = await ctx.model.Project._findOne({ name: params.name });
      if (!_.isEmpty(existProject)) return;
    }

    const newTradeNames = params.trades.filter(item => !item.id);
    const existTrades = await ctx.model.Trade._find({ name: { $in: newTradeNames.map(item => item.name) }, status: Enum.COMMON_STATUS.VALID });
    const insertTrades = newTradeNames.filter(item => !existTrades.some(trade => trade.name === item.name));

    let insertedTrades = [];
    if (!_.isEmpty(insertTrades)) {
      insertedTrades = await ctx.model.Trade._create(insertTrades);
    }

    return Object.assign({}, params, {
      // creator: ctx.userInfo.userId,
      updater: ctx.userInfo.userId,
      trades: [
        ...params.trades.filter(item => item.id).map(item => item.id), // 前端传进来的带id的
        ...existTrades.map(item => item.id), // 前端传进来无id的，但库里已存在的
        ...insertedTrades.map(item => item.id) ], // 前端传进来无id的，新创建的
    });
  }

  async delete(id) {
    const { ctx } = this;
    return await ctx.model.Project._deleteOne({ id });
  }

  async edit(id, params) {
    const { ctx } = this;

    const projectData = await this.assembleProjectData(params, true);
    if (!projectData) return;

    return await ctx.model.Project._updateOne({ id }, projectData);
  }

  async getList(query, options) {
    const { ctx } = this;

    const filter = {};

    if (!_.isEmpty(query.key)) {
      const keyFilter = {
        $or: [
          {
            name: {
              $regex: query.key,
            },
          },
          {
            desc: {
              $regex: query.key,
            },
          },
        ],
      };

      const trades = await ctx.model.Trade._find({ name: { $regex: query.key } });
      const filterTradeIds = trades.map(item => item.id);
      if (!_.isEmpty(filterTradeIds)) {
        keyFilter.$or.push({
          trades: {
            $in: filterTradeIds,
          },
        });
      }

      Object.assign(filter, keyFilter);
    }

    const total = await ctx.model.Project._count(filter);
    const list = await ctx.model.Project._find(filter, null, options);
    const tradeIds = [],
      userIds = [];
    list.forEach(l => {
      tradeIds.push(...l.trades);
      userIds.push(l.creator);
    });
    const tradeInfos = await ctx.model.Trade._find({ id: { $in: _.uniq(tradeIds) } });
    const tradeMap = _.keyBy(tradeInfos, 'id');

    const creators = await ctx.model.User._find({ id: { $in: _.uniq(userIds) } });
    const creatorMap = _.keyBy(creators, 'id');
    list.forEach(l => {
      l.trades = l.trades.map(id => ({
        id,
        name: tradeMap[id] && tradeMap[id].name || '',
      }));
      l.creatorName = creatorMap[l.creator] && creatorMap[l.creator].username || '';
    });

    return {
      total,
      list,
    };
  }

  async getInfo(id) {
    const { ctx } = this;

    const info = await ctx.model.Project._findOne({ id });

    const tradeInfos = await ctx.model.Trade._find({ id: { $in: info.trades } });
    const tradeMap = _.keyBy(tradeInfos, 'id');

    const creator = await ctx.model.User._findOne({ id: info.creator });
    info.trades = info.trades.map(id => ({
      id,
      name: tradeMap[id] && tradeMap[id].name || '',
    }));
    info.creatorName = creator.username;

    return info;
  }
}

module.exports = ProjectService;
