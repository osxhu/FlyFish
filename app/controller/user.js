'use strict';

const BaseController = require('./base');
const _ = require('lodash');
const CODE = require('../lib/error');

class UserController extends BaseController {
  async register() {
    const { ctx, app, service } = this;

    const UserRegisterSchema = app.Joi.object().keys({
      username: app.Joi.string().required(),
      phone: app.Joi.string().required(),
      email: app.Joi.string().required(),
      password: app.Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
      rePassword: app.Joi.ref('password'),
    });
    ctx.validate(UserRegisterSchema, ctx.request.body);

    const { username, password, phone, email } = ctx.request.body;

    const userInfo = await service.user.userRegister(username, password, phone, email);
    if (userInfo.msg === 'user exists') {
      this.fail('注册失败, 用户已存在', null, CODE.FAIL);
    } else {
      this.success('注册成功', { id: _.get(userInfo, [ 'data', '_id' ]) });
    }
  }

  async login() {
    const { ctx, app, service } = this;

    const UserLoginSchema = app.Joi.object().keys({
      username: app.Joi.string().required(),
      password: app.Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });
    ctx.validate(UserLoginSchema, ctx.request.body);

    const { username, password } = ctx.request.body;

    const userInfo = await service.user.userLogin(username, password);

    const cookieToSet = {
      userId: userInfo._id.toString(),
      username: userInfo.username,
      role: userInfo.role,
      phone: userInfo.phone,
      email: userInfo.email,
    };
    ctx.helper.setCookie(cookieToSet);

    if (_.isEmpty(userInfo)) {
      this.fail('登录失败', null, CODE.FAIL);
    } else {
      this.success('登录成功', { id: userInfo._id });
    }
  }

  async logout() {
    const { ctx, app } = this;

    const UserLogoutSchema = app.Joi.object().keys({
      id: app.Joi.string().required(),
    });
    ctx.validate(UserLogoutSchema, ctx.request.body);

    const { id } = ctx.request.body;

    ctx.helper.clearCookie();

    this.success('登出成功', { id });
  }

  async getInfo() {
    const { ctx, app, service } = this;

    const getUserInfoSchema = app.Joi.object().keys({
      id: app.Joi.string().required(),
    });
    ctx.validate(getUserInfoSchema, ctx.params);

    const { id } = ctx.params;

    const userInfo = await service.user.getUserInfo(id);

    if (_.isEmpty(userInfo)) {
      this.fail('获取失败', null, CODE.FAIL);
    } else {
      this.success('获取成功', userInfo);
    }
  }

  async updateUserInfo() {
    const { ctx, app, service } = this;

    const updateUserInfoSchema = app.Joi.object().keys({
      password: app.Joi.string(),
      disable: app.Joi.boolean(),
      phone: app.Joi.string(),
      email: app.Joi.string().email(),
    });
    const { value: id } = ctx.validate(app.Joi.string().length(24).required(), ctx.params.id);
    const { value: requestData } = ctx.validate(updateUserInfoSchema, ctx.request.body);

    await service.user.updateUserInfo(id, requestData);

    this.success('更新成功', { id: requestData.id });
  }

  async getList() {
    const { ctx, app, service } = this;

    const getUserInfoSchema = app.Joi.object().keys({
      id: app.Joi.string(),
      username: app.Joi.string(),
      phone: app.Joi.string(),
      email: app.Joi.string(),

      curPage: app.Joi.number().default(0),
      pageSize: app.Joi.number().default(10),
    });
    const { value: requestData } = ctx.validate(getUserInfoSchema, ctx.request.body);

    const userList = await service.user.getUserList(requestData);

    const returnInfo = {
      total: userList.total,
      curPage: requestData.curPage,
      pageSize: requestData.pageSize,
      list: userList.data,
    };

    this.success('获取成功', returnInfo);
  }
}

module.exports = UserController;

