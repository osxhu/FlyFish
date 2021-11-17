'use strict';
const Service = require('egg').Service;

class TagService extends Service {
  async getAll(params) {
    const { ctx } = this;
    const list = await ctx.model.Tag._find(params);
    return list;
  }
}

module.exports = TagService;
