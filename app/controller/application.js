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
      trades: Joi.array().items(Joi.string().length(24)).required(),
      desc: Joi.string(),
    });
    const body = await addSchema.validateAsync(ctx.request.body);
    const res = await service.project.create(body);
    this.success('新建成功', res);
  }
}

module.exports = ApplicationController;

