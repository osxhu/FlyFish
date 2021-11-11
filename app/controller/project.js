'use strict';

const BaseController = require('./base');
class ProjectController extends BaseController {
  async create() {
    const { ctx, app: { Joi }, service } = this;

    const addSchema = Joi.object().keys({
      name: Joi.string().required(),
      trades: Joi.array().items(Joi.string()).required(),
      desc: Joi.string().required(),
    });
    const body = await addSchema.validateAsync(ctx.request.body);
    const res = await service.project.create(body);
    this.success('新建成功', res);
  }

  async delete() {
    const { ctx, app: { Joi }, service } = this;
    const deleteSchema = Joi.object().keys({
      projectId: Joi.string().required(),
    });

    const { projectId } = await deleteSchema.validateAsync(ctx.params);
    await service.project.delete(projectId);
    this.success('删除成功', null);
  }

  async edit() {
    const { ctx, app: { Joi }, service } = this;
    const editParamSchema = Joi.object().keys({
      projectId: Joi.string().required(),
    });

    const editBodySchema = Joi.object().keys({
      name: Joi.string(),
      trades: Joi.array().items(Joi.string()),
      desc: Joi.string(),
    });

    const { projectId } = await editParamSchema.validateAsync(ctx.params);
    const body = await editBodySchema.validateAsync(ctx.request.body);
    await service.project.edit(projectId, body);
    this.success('编辑成功', null);
  }

  async list() {
    const { ctx, app: { Joi }, service } = this;

    const listSchema = Joi.object().keys({
      key: Joi.string(),
      curPage: Joi.number().default(1).required(),
      pageSize: Joi.number().default(10).required(),
    });

    const { key, curPage, pageSize } = await listSchema.validateAsync(ctx.query);
    const options = {
      skip: curPage * pageSize,
      limit: pageSize,
    };
    const { list, total } = await service.project.getList({ key }, options);
    this.success('获取成功', { total, list, curPage, pageSize });
  }

  async info() {
    const { ctx, app: { Joi }, service } = this;

    const infoSchema = Joi.object().keys({
      projectId: Joi.string().required(),
    });

    const { projectId } = await infoSchema.validateAsync(ctx.params);
    const info = await service.project.getInfo(projectId);
    this.success('获取成功', info);
  }


}

module.exports = ProjectController;

