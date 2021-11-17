'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');

class TradeController extends BaseController {
  async list() {
    const { ctx, app: { Joi }, service } = this;

    const { list } = await service.trade.getList();
    this.success('获取成功', { list });
  }
}

module.exports = TradeController;

