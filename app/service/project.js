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
    return await ctx.model.Project._find(filter, null, options);
  }
}

module.exports = ProjectService;
