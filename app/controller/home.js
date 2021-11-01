'use strict';

const BaseController = require('./base');

class HomeController extends BaseController {
  async index() {
    const { ctx, app, service, config, logger } = this;

    // const data = await service.home.getHomeInfo();
    // this.success('获取成功', data);
    // ctx.throw(501, '内部错误');
    this.fail('出错啦', null, 1000);
  }
}

module.exports = HomeController;
