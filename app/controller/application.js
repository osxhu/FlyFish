'use strict';

const _ = require('lodash');
const fs = require('fs-extra');
const AdmZip = require('adm-zip');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

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
      tags: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })),
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
      name: Joi.string(),
      type: Joi.string().valid(...Object.values(Enum.APP_TYPE)),
      tags: Joi.array().items(Joi.object().keys({
        id: Joi.string().length(24),
        name: Joi.string().required(),
      })),
      projectId: Joi.string().length(24),
      developStatus: Joi.string().valid(...Object.values(Enum.APP_DEVELOP_STATUS)),
      status: Joi.string().valid(...Object.values(Enum.COMMON_STATUS)),
    });

    const { value: id } = ctx.validate(Joi.string().length(24).required(), ctx.params.id);
    const body = await editSchema.validateAsync(ctx.request.body);

    if (body.status === Enum.COMMON_STATUS.VALID && !body.name) {
      return this.fail('还原失败, 请重新填写应用名称', null, CODE.FAIL);
    }

    const updateResult = await service.application.updateBasicInfo(id, body);
    if (updateResult.msg === 'Exists Already') {
      this.fail('更新失败, 应用名称已存在', null, CODE.FAIL);
    } else {
      this.success('编辑基础信息成功', { id });
    }
  }

  async editDesignInfo() {
    const { ctx, app: { Joi }, service } = this;

    const editSchema = Joi.object().keys({
      pages: Joi.array().items(Joi.object().keys({
        components: Joi.array().items(Joi.object().keys({
          id: Joi.string().required(),
          type: Joi.string().required(),
          version: Joi.string().required(),
        }).unknown()).required(),
      }).unknown()).required(),
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
      tags: app.Joi.array().items(app.Joi.object().keys({
        id: app.Joi.string().length(24),
        name: app.Joi.string().required(),
      })),
      projectId: app.Joi.string().length(24),
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
      status: Joi.string().valid(...Object.values(Enum.COMMON_STATUS)),

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

  async getComponentList() {
    const { ctx, app: { Joi }, service } = this;
    const getListSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
      type: Joi.string().valid(...Object.values(Enum.COMPONENT_TYPE)).required(),
      name: Joi.string(),
    });

    const body = await getListSchema.validateAsync(ctx.request.body);
    const result = await service.application.getComponentList(body);
    if (result.msg === 'No Exists ProjectId') {
      this.fail('获取失败, 应用不属于任何项目', null, CODE.FAIL);
    } else {
      this.success('获取成功', result.data);
    }
  }

  async export() {
    const { ctx, config: { pathConfig: { staticDir, componentsPath, appTplPath, appBuildPath, applicationPath } } } = this;
    const id = ctx.params.id;

    const buildPath = path.resolve(staticDir, appBuildPath, id);
    const appPath = path.resolve(staticDir, applicationPath);
    const configPath = path.resolve(buildPath, 'config');

    const appInfo = await ctx.model.Application._findOne({ id });

    await fs.outputFile(path.resolve(configPath, 'env.conf.json'), '');
    await fs.writeJson(path.resolve(configPath, 'env.conf.json'), appInfo.pages);

    const mergedGlobalOptions = {};
    const targetComponentPath = path.resolve(buildPath, 'components');
    (appInfo.pages || []).forEach(async page => {
      Object.assign(mergedGlobalOptions, page.options.ENVGlobalOptions || {});
      (page.components || []).forEach(async component => {
        await fs.copy(
          path.resolve(staticDir, componentsPath, component.type, component.version, 'release'),
          path.resolve(targetComponentPath, component.type)
        );
      });
    });

    await fs.outputFile(
      path.resolve(configPath, 'env.production.js'),
      require(path.resolve(staticDir, appTplPath, 'config/env.js'))({ globalOptions: JSON.stringify(mergedGlobalOptions) })
    );

    const sourceIndexPath = path.resolve(staticDir, appTplPath, 'index.html');
    const targetIndexPath = path.resolve(staticDir, buildPath, 'index.html');
    await fs.copy(sourceIndexPath, targetIndexPath);

    const sourcePublicPath = path.resolve(staticDir, appTplPath, 'public');
    const targetPublicPath = path.resolve(staticDir, buildPath, 'public');
    await fs.copy(sourcePublicPath, targetPublicPath);

    const sourceImgPath = path.resolve(staticDir, appPath, id);
    const targetImgPath = path.resolve(staticDir, buildPath, 'applications');
    const appExist = await fs.pathExists(sourceImgPath);
    if (appExist) {
      await fs.copy(sourceImgPath, targetImgPath);
    }

    const zipName = `screen_${id}.zip`;
    const destZip = `${staticDir}/${appBuildPath}/${zipName}`;
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

  async uploadApplicationImg() {
    const { ctx, app: { Joi }, config: { pathConfig: { staticDir, applicationPath } } } = this;
    const appSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });

    const { id } = await appSchema.validateAsync(ctx.params);
    const file = ctx.request.files[0];
    const targetRelativePath = `${applicationPath}/${id}/${uuidv4()}${path.extname(file.filepath)}`;
    const targetPath = path.resolve(staticDir, targetRelativePath);

    try {
      await fs.copy(file.filepath, targetPath);
    } finally {
      await fs.remove(file.filepath);
    }

    this.success('上传成功', targetRelativePath);
  }

  async deleteApplicationImg() {
    const { ctx, app: { Joi }, config: { pathConfig: { staticDir, applicationPath } } } = this;
    const appSchema = Joi.object().keys({
      id: Joi.string().length(24).required(),
    });
    const { id } = await appSchema.validateAsync(ctx.params);
    const { img } = ctx.query;
    const imgPath = `${staticDir}/${applicationPath}/${id}/${img}`;
    const imgExist = fs.existsSync(imgPath);
    if (imgExist) {
      await fs.remove(imgPath);
    }
    this.success('删除成功');
  }
}

module.exports = ApplicationController;

