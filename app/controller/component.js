'use strict';

const BaseController = require('./base');
const CODE = require('../lib/error');
const _ = require('lodash');
const Enum = require('../lib/enum');

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

    if (componentInfo.msg === 'Exists Already') {
      this.fail('创建失败, 组件名称已存在', null, CODE.FAIL);
    } else if (componentInfo.msg === 'Fail') {
      this.fail('创建失败, 初始化开发空间失败', null, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(componentInfo, [ 'data', 'id' ]) });
    }
  }

  async copy() {
    const { ctx, app, service } = this;

    const addComponentSchema = app.Joi.object().keys({
      name: app.Joi.string(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(addComponentSchema, ctx.request.body);

    const componentInfo = await service.component.copyComponent(id, requestData);

    if (componentInfo.msg === 'Exists Already') {
      this.fail('创建失败, 组件名称已存在', null, CODE.FAIL);
    } else if (componentInfo.msg === 'Fail') {
      this.fail('创建失败, 初始化开发空间失败', null, CODE.FAIL);
    } else if (componentInfo.msg === 'No Exists') {
      this.fail('创建失败, 复制组件不存在', null, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(componentInfo, [ 'data', 'id' ]) });
    }
  }

  async updateInfo() {
    const { ctx, app, service } = this;

    const updateInfoSchema = app.Joi.object().keys({
      type: app.Joi.string(),
      projects: app.Joi.array().items(app.Joi.string()).min(1),
      tags: app.Joi.array().items(app.Joi.string()),
      category: app.Joi.string().required(),
      subCategory: app.Joi.string().required(),
      desc: app.Joi.string(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateInfoSchema, ctx.request.body);

    await service.component.updateInfo(id, requestData);

    this.success('更新成功', { id });
  }

  async delete() {
    const { ctx, app, service } = this;

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    await service.component.delete(id);
    this.success('更新成功', { id });
  }

  async release() {
    const { ctx, app, service } = this;

    const releaseComponentSchema = app.Joi.object().keys({
      compatible: app.Joi.boolean().required(),

      no: app.Joi.string(),
      desc: app.Joi.string(),
    });

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(releaseComponentSchema, ctx.request.body);

    if (!requestData.compatible && !requestData.no) this.fail('组件版本不兼容旧版本，请添加版本号', null, CODE.PARAM_ERR);
    const releaseComponent = await service.component.releaseComponent(id, requestData);

    if (releaseComponent.msg === 'Exists Already') {
      this.fail('发行版本失败, 组件版本已存在', null, CODE.FAIL);
    } else if (releaseComponent.msg === 'Fail') {
      this.fail('发行版本失败, 初始化空间失败', null, CODE.FAIL);
    } else {
      this.success('发行版本成功', null);
    }
  }

  async getInfo() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const componentInfo = await service.component.getComponentInfo(id);
    if (_.isEmpty(componentInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', componentInfo);
    }
  }
}

module.exports = ComponentsController;

