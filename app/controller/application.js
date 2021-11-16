'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const path = require('path');

const BaseController = require('./base');
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
    const applicationInfo = await service.application.create(body);

    if (applicationInfo.msg === 'Exists Already') {
      this.fail('创建失败, 应用名称已存在', null, CODE.FAIL);
    } else {
      this.success('创建成功', { id: _.get(applicationInfo, [ 'data', 'id' ]) });
    }
  }

  async editBasicInfo() {
    const { ctx, app: { Joi }, service } = this;

    const editSchema = Joi.object().keys({
      type: Joi.string().valid(...Object.values(Enum.APP_TYPE)),
      tags: Joi.array().items(Joi.string().length(24)),
      projectId: Joi.string().length(24),
      developStatus: Joi.string().valid(...Object.values(Enum.APP_DEVELOP_STATUS)),
    });

    const { value: id } = ctx.validate(Joi.string().length(24).required(), ctx.params.id);
    const body = await editSchema.validateAsync(ctx.request.body);
    await service.application.updateBasicInfo(id, body);

    this.success('编辑基础信息成功', { id });
  }

  async editDesignInfo() {
    const { ctx, app: { Joi }, service } = this;

    const editSchema = Joi.object().keys({
      pages: Joi.array().items(Joi.object().keys({
        components: Joi.array().items(Joi.object().keys({
          version: Joi.string().required(),
        })).min(1)
          .required(),
      })).min(1)
        .required(),
    });

    const { value: id } = ctx.validate(Joi.string().length(24).required(), ctx.params.id);
    const body = await editSchema.validateAsync(ctx.request.body);
    await service.application.updateDesignInfo(id, body);

    this.success('编辑成功', { id });
  }

  async copy() {
    const { ctx, app, service } = this;

    const copyApplicationSchema = app.Joi.object().keys({
      name: app.Joi.string(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(copyApplicationSchema, ctx.request.body);

    const applicationInfo = await service.application.copyApplication(id, requestData);

    if (applicationInfo.msg === 'Exists Already') {
      this.fail('复制失败, 组件名称已存在', null, CODE.FAIL);
    } else if (applicationInfo.msg === 'No Exists') {
      this.fail('复制失败, 复制组件不存在', null, CODE.FAIL);
    } else {
      this.success('复制成功', { id: _.get(applicationInfo, [ 'data', 'id' ]) });
    }
  }

  async getInfo() {
    const { ctx, app, service } = this;
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);

    const applicationInfo = await service.application.getApplicationInfo(id);
    if (_.isEmpty(applicationInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', applicationInfo);
    }
  }

  async delete() {
    const { ctx, app, service } = this;

    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    await service.application.delete(id);
    this.success('删除成功', { id });
  }

  async getList() {
    const { ctx, app: { Joi }, service } = this;
    const getListSchema = Joi.object().keys({
      name: Joi.string(),
      type: Joi.string(),
      projectId: Joi.string().length(24),
      tags: Joi.array().items(Joi.string().length(24)),
      developStatus: Joi.string(),
      isLib: Joi.boolean(),

      curPage: Joi.number().default(0),
      pageSize: Joi.number().default(10),
    });
    const body = await getListSchema.validateAsync(ctx.request.body);

    const appList = await service.application.getList(body);

    const returnInfo = {
      total: appList.total,
      curPage: body.curPage,
      pageSize: body.pageSize,
      list: appList.data,
    };

    this.success('获取成功', returnInfo);
  }

  async export() {
    const { ctx, config: { pathConfig: { componentsPath, appTplPath, appBuildPath, uploadPath } } } = this;
    const id = ctx.params.id;

    const buildPath = path.resolve(appBuildPath, id);
    const appUploadPath = path.resolve(uploadPath, 'application');
    const configPath = path.resolve(buildPath, 'config');

    const appInfo = await ctx.model.Application._findOne({ id });

    await fs.writeJson(path.resolve(configPath, 'env.conf.json'), appInfo.pages);

    const mergedGlobalOptions = {};
    const targetComponentPath = path.resolve(buildPath, 'components');
    (appInfo.pages || []).forEach(async page => {
      Object.assign(mergedGlobalOptions, page.options.ENVGlobalOptions || {});
      (page.components || []).forEach(async component => {
        await fs.copy(
          path.resolve(componentsPath, component.id, component.version, 'release'),
          path.resolve(targetComponentPath, component.id)
        );
      });
    });

    await fs.writeFile(
      path.resolve(configPath, 'env.production.js'),
      require(path.resolve(appTplPath, 'config/env.js')({ globalOptions: mergedGlobalOptions }))
    );

    const sourceIndexPath = path.resolve(appTplPath, 'index.html');
    const targetIndexPath = path.resolve(buildPath, 'index.html');
    await fs.copy(sourceIndexPath, targetIndexPath);

    const sourcePublicPath = path.resolve(appTplPath, 'public');
    const targetPublicPath = path.resolve(buildPath, 'public');
    await fs.copy(sourcePublicPath, targetPublicPath);

    const sourceAssertPath = path.resolve(appTplPath, 'asserts');
    const targetAssertPath = path.resolve(buildPath, 'asserts');
    await fs.copy(sourceAssertPath, targetAssertPath);

    const sourceFragmentPath = path.resolve(appUploadPath, `fragment/${id}`);
    const targetFragmentPath = path.resolve(buildPath, `upload/screen/fragment/${id}`);
    const fragmentExist = await fs.pathExists(sourceFragmentPath);
    if (fragmentExist) {
      await fs.copy(sourceFragmentPath, targetFragmentPath);
    }

    const zipName = `screen_${id}.zip`;
    const destZip = `${appBuildPath}/${zipName}`;
    try {
      const zip = new AdmZip();

      zip.addLocalFolder(buildPath);
      zip.writeZip(destZip);

      ctx.set('Content-Disposition', `attachment;filename=${zipName}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.body = fs.createReadStream(destZip);
    } finally {
      await fs.remove(destZip);
    }
  }
}

module.exports = ApplicationController;

