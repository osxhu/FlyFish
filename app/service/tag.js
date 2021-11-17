'use strict';
const Service = require('egg').Service;

class TagService extends Service {
  async create(params) {
    const { ctx } = this;
    return await ctx.model.Tag._create(params);
  }

  async getAll(params) {
    const { ctx } = this;
    const list = await ctx.model.Tag._find(params);
    return list;
  }
}

module.exports = TagService;
