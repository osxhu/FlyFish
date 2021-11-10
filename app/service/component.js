'use strict';
const Service = require('egg').Service;

class ComponentService extends Service {
  async updateCategoryInfo(updateInfo) {
    const { ctx } = this;
    await ctx.model.ComponentCategory._create({ categories: updateInfo });
  }

  async getCategoryList() {
    const { ctx } = this;

    const result = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 });
    return result;
  }
}

module.exports = ComponentService;
