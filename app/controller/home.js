'use strict';

const BaseController = require('./base');

class HomeController extends BaseController {
  async index() {
    const {ctx, app, service, config, logger} = this;

    const data = await service.home.getHomeInfo();
    this.success(0, '获取成功', data);
    // ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
