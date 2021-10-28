'use strict';
const Service = require('egg').Service;

class HomeService extends Service {
  async getHomeInfo() {
    const { ctx, app, service, config, logger } = this;
    // ctx.curl();

    // logger.error() 要传入Error类型
    // logger.error(new Error('whoops'));
    // const result = await ctx.model.User.find({ name: 'yangwenju' });
    const result = await ctx.model.User.create({ name: 'ju' });
    return result;
  }
}

module.exports = HomeService;
