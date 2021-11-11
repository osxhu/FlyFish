'use strict';
const Service = require('egg').Service;
// const Enum = require('../lib/enum');
// const _ = require('lodash');

class ProjectService extends Service {
  async create(params) {
    const { ctx } = this;
    return await ctx.model.Project._create(params);
  }

  async delete(id) {
    const { ctx } = this;
    return await ctx.model.Project._deleteOne({ id });
  }

  async edit(id, params) {
    const { ctx } = this;
    return await ctx.model.Project._updateOne({ id }, params);
  }

  async getList(query, options) {
    const { ctx } = this;
    // TODO: 行业搜索
    const filter = {
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
    const total = await ctx.model.Project._count(filter);
    const list = await ctx.model.Project._find(filter, null, options);
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
