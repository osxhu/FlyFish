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

  async getList() {
    const { ctx, app, service } = this;

    const getListSchema = app.Joi.object().keys({
      key: app.Joi.string(),
      name: app.Joi.string(),
      developStatus: app.Joi.string(),
      type: app.Joi.string(),
      category: app.Joi.string(),
      subCategory: app.Joi.string(),

      curPage: app.Joi.number().default(0),
      pageSize: app.Joi.number().default(10),
    });
    const { value: requestData } = ctx.validate(getListSchema, ctx.request.body);

    const roleList = await service.component.getList(requestData);
    const returnInfo = {
      total: roleList.total,
      curPage: requestData.curPage,
      pageSize: requestData.pageSize,
      list: roleList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async add() {
    const { ctx, app, service } = this;

    const addComponentSchema = app.Joi.object().keys({
      name: app.Joi.string(),
      type: app.Joi.string(),
      projects: app.Joi.array().items(app.Joi.string()).min(1),
      tags: app.Joi.array().items(app.Joi.string()),
      category: app.Joi.string().required(),
      subCategory: app.Joi.string().required(),
      desc: app.Joi.string(),
    });
    const { value: requestData } = ctx.validate(addComponentSchema, ctx.request.body);

    const componentInfo = await service.component.addComponent(requestData);
    this.success('创建成功', { id: componentInfo.data.id });
  }
}

module.exports = ComponentsController;

