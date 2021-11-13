'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');
const Enum = require('../lib/enum');

class ApplicationController extends BaseController {
  async create() {
    const { ctx, app: { Joi }, service } = this;

    const createSchema = Joi.object().keys({
      name: Joi.string().required(),
      projectId: Joi.string().length(24).required(),
      type: Joi.string().valid(...Object.values(Enum.APP_TYPE)).required(),
      tags: Joi.array().items(Joi.string().length(24)),
    });
    const body = await createSchema.validateAsync(ctx.request.body);
    const res = await service.application.create(body);
    this.success('新建成功', res);
  }
}

module.exports = ApplicationController;

