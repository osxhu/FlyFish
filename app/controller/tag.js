'use strict';

const BaseController = require('./base');
const Enum = require('../lib/enum');

class TagController extends BaseController {
  async add() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const body = await addSchema.validateAsync(ctx.request.body);
    const res = await service.tag.create(body);
    this.success('新建成功', res);
  }

  async getAll() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      type: Joi.string().valid(...Object.values(Enum.TAG_TYPE)).required(),
    });
    const query = await addSchema.validateAsync(ctx.query);

    const list = await service.tag.getAll(query);
    this.success('获取成功', list);
  }
}

module.exports = TagController;

