'use strict';

const BaseController = require('./base');
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
    const { service } = this;

    const list = await service.tag.getAll();
    this.success('获取成功', list);
  }
}

module.exports = TagController;

