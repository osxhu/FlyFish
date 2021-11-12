'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

class ComponentService extends Service {
  async updateCategoryInfo(updateInfo) {
    const { ctx } = this;
    await ctx.model.ComponentCategory._create(updateInfo);
  }

  async getCategoryList() {
    const { ctx } = this;

    const result = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 });
    return result;
  }

  async getList(requestData) {
    const { ctx } = this;

    const { key, name, developStatus, type, category, subCategory, curPage, pageSize } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };
    queryCond.$or = [];
    if (key) {
      queryCond.$or.push({ name: { $regex: key } });
      queryCond.$or.push({ desc: { $regex: key } });
    }
    if (name) queryCond.name = name;
    if (subCategory) {
      queryCond.category = category;
      queryCond.subCategory = subCategory;
    }
    if (developStatus) queryCond.developStatus = developStatus;
    if (type) queryCond.type = type;

    const users = await ctx.model.User._find();
    const projects = await ctx.model.Project._find();

    const matchUsers = (users || []).filter(user => user.username.includes(key));
    const matchProjects = (projects || []).filter(project => project.name.includes(key));

    const matchUserIds = matchUsers.map(user => user.id);
    const matchProjectIds = matchProjects.map(project => project.id);

    if (!_.isEmpty(matchUserIds)) queryCond.$or.push({ creator: { $in: matchUserIds } });
    if (!_.isEmpty(matchProjectIds)) queryCond.$or.push({ projects: { $in: matchProjectIds } });

    if (_.isEmpty(queryCond.$or)) delete queryCond.$or;
    const componentList = await ctx.model.Component._find(queryCond);

    const total = componentList.length || 0;
    const data = (componentList || []).slice(curPage, curPage + pageSize).map(component => {
      const curUser = (users || []).find(user => user.id === component.creator) || {};
      const curProjects = (projects || []).filter(project => (component.projects || []).includes(project.id));

      return {
        id: component.id,
        name: component.name,
        developStatus: component.developStatus,
        type: component.type,
        cover: component.cover,
        category: component.category,
        subCategory: component.subCategory,
        tags: [{
          id: 'xxx',
          name: 'xxx',
        }],
        projects: (curProjects || []).map(project => {
          return {
            id: project.id,
            name: project.name,
          };
        }),
        version: _.get(component, [ 'version', (component.version || []).length - 1, 'no' ], 'v1.0'),
        creator: curUser.username,
        updateTime: component.updateTime,
        createTime: component.createTime,
      };
    });

    return { total, data };
  }

  async addComponent(createComponentInfo) {
    const { ctx } = this;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    const existsComponents = await ctx.model.Component._findOne({ name: createComponentInfo.name });
    if (!_.isEmpty(existsComponents)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const createInfo = {
      name: createComponentInfo.name,
      category: createComponentInfo.category,
      subCategory: createComponentInfo.subCategory,
      type: createComponentInfo.type,
      projects: createComponentInfo.projects,
      tags: createComponentInfo.tags || [],
      desc: createComponentInfo.desc || '无',
      versions: [],
      cover: '',
      creator: userInfo.userId,
    };

    const result = await ctx.model.Component._create(createInfo);

    const componentId = result._id.toString();
    returnData.data.id = componentId;

    const createResult = await this.initDevWorkspace(componentId);
    if (createResult.msg !== 'success') returnData.msg = createResult.msg;

    return returnData;
  }

  async releaseComponent(componentId, releaseComponentInfo) {
    const { ctx } = this;

    const returnData = { msg: 'ok' };
    const { no, compatible, desc } = releaseComponentInfo;
    const componentInfo = await ctx.model.Component._findOne({ id: componentId });

    if (!compatible) {
      const existsVersion = (componentInfo.versions || []).find(version => version.no === no);

      if (!_.isEmpty(existsVersion)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
      await ctx.model.Component._updateOne({ id: componentId }, { $push: { versions: { no, desc, status: Enum.COMMON_STATUS.VALID } } });
    }

    const createResult = this.initReleaseWorkspace(componentInfo, no, compatible);
    if (createResult.msg !== 'Success') returnData.msg = createResult.msg;

    return returnData;
  }

  // 初始化上线组件空间  compatible: 是否兼容旧版本组件
  initReleaseWorkspace(componentInfo, no, compatible) {
    const { ctx, config, logger } = this;
    const { pathConfig: { componentsPath } } = config;

    const returnInfo = { msg: 'Success' };
    const componentId = componentInfo.id;
    const version = compatible ? _.get(componentInfo, [ 'version', componentInfo.version || [], 'no' ], no || 'v1') : no;

    try {
      const componentPath = `${componentsPath}/${componentId}`;
      const componentDevPath = `${componentPath}/current`;
      const componentReleasePath = `${componentPath}/${version}`;

      const ignoreDirs = [ 'node_modules' ];
      ctx.helper.copyDirSync(componentDevPath, componentReleasePath, ignoreDirs);
    } catch (error) {
      returnInfo.msg = 'Fail';
      logger.error('releaseCompatibleComponent error: ', error || error.stack);
    }

    return returnInfo;
  }

  // 初始化开发组件空间
  initDevWorkspace(componentId) {
    const { config, logger } = this;
    const { pathConfig: { componentsPath, componentsTplPath } } = config;

    const returnInfo = { msg: 'Success' };

    const version = 'current';
    try {
      const componentPath = `${componentsPath}/${componentId}`;
      fs.mkdirSync(`${componentPath}`);

      const componentDevPath = `${componentPath}/${version}`;
      fs.mkdirSync(componentDevPath);

      const srcPath = `${componentDevPath}/src`;
      const srcTplPath = `${componentsTplPath}/src`;
      fs.mkdirSync(srcPath);
      fs.writeFileSync(`${srcPath}/main.js`, require(`${srcTplPath}/mainJs.js`)(componentId));
      fs.writeFileSync(`${srcPath}/Component.js`, require(`${srcTplPath}/ComponentJs.js`)(componentId));
      fs.writeFileSync(`${srcPath}/setting.js`, require(`${srcTplPath}/setting.js`)(componentId));

      const settingPath = `${srcPath}/settings`;
      fs.mkdirSync(settingPath);
      fs.writeFileSync(`${settingPath}/options.js`, require(`${srcTplPath}/options.js`)(componentId));
      fs.writeFileSync(`${settingPath}/data.js`, require(`${srcTplPath}/data.js`)(componentId));

      const buildPath = `${componentDevPath}/build`;
      const buildTplPath = `${componentsTplPath}/build`;
      fs.mkdirSync(buildPath);
      fs.writeFileSync(`${buildPath}/webpack.config.dev.js`, require(`${buildTplPath}/webpack.config.dev.js`)(componentId));
      fs.writeFileSync(`${buildPath}/webpack.config.production.js`, require(`${buildTplPath}/webpack.config.production.js`)(componentId));

      fs.writeFileSync(`${componentDevPath}/editor.html`, require(`${componentsTplPath}/editor.html.js`)(componentId));
      fs.writeFileSync(`${componentDevPath}/env.js`, require(`${componentsTplPath}/env.js`)(componentsPath, componentId, version));
      fs.writeFileSync(`${componentDevPath}/options.js`, require(`${componentsTplPath}/options.json.js`)(componentId));
      fs.writeFileSync(`${componentDevPath}/package.js`, require(`${componentsTplPath}/package.json.js`)(componentId));
    } catch (error) {
      returnInfo.msg = 'Fail';
      logger.error('createDevWorkspace error: ', error || error.stack);
    }

    return returnInfo;
  }
}

module.exports = ComponentService;
