'use strict';

const BaseController = require('./base');

class ComponentsController extends BaseController {
  async updateCategory() {
    const { ctx, app, service } = this;

    const addRoleBasicInfoSchema = app.Joi.object().keys({
      categories: app.Joi.array().items({
        name: app.Joi.string().required(),
        children: app.Joi.array().items({
          name: app.Joi.string().required(),
        }),
      }).required(),
    });
    const { value: requestData } = ctx.validate(addRoleBasicInfoSchema, ctx.request.body);

    await service.component.updateCategoryInfo(requestData);
    this.success('更新成功', null);
  }

  async getCategoryList() {
    const { service } = this;
    const result = await service.component.getCategoryList();
    this.success('获取成功', result);
  }
}

module.exports = ComponentsController;

