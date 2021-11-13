'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');

class TradeController extends BaseController {
  async create() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const body = await addSchema.validateAsync(ctx.request.body);
    const res = await service.trade.create(body);
    if (!res) return this.fail('行业已存在，请重新添加', null, CODE.ALREADY_EXISTS);
    this.success('新建成功', res);
  }
}

module.exports = TradeController;

