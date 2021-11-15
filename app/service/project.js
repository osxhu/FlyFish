'use strict';
const Service = require('egg').Service;
const _ = require('lodash');
const Enum = require('../lib/enum');

class ProjectService extends Service {
  async create(params) {
    const { ctx } = this;
    const userInfo = ctx.userInfo;

    Object.assign(params, {
      creator: userInfo.userId,
      updater: userInfo.userId,
    });

    const existProject = await ctx.model.Project._findOne({ name: params.name });
    if (!_.isEmpty(existProject)) return;
    return await ctx.model.Project._create(params);
  }

  async delete(id) {
    const { ctx } = this;
    return await ctx.model.Project._deleteOne({ id });
  }

  async edit(id, params) {
    const { ctx } = this;
    const userInfo = ctx.userInfo;

    Object.assign(params, {
      updater: userInfo.userId,
    });
    return await ctx.model.Project._updateOne({ id }, params);
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
    const tradeInfos = await ctx.model.Trade._find({ id: { $in: _.uniq(tradeIds) } }, null, options);
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
    // TODO: 拼接trades name信息
    const info = await ctx.model.Project._findOne({ id });
    return info;
  }
}

module.exports = ProjectService;
