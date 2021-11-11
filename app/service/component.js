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

    // const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    // const existsComponents = await ctx.model.Component._findOne({ name: createComponentInfo.name });
    // if (!_.isEmpty(existsComponents)) {
    //   returnData.msg = 'Exists Already';
    //   return returnData;
    // }

    // const createInfo = {
    //   name: createComponentInfo.name,
    //   category: createComponentInfo.category,
    //   subCategory: createComponentInfo.subCategory,
    //   type: createComponentInfo.type,
    //   projects: createComponentInfo.projects,
    //   tags: createComponentInfo.tags || [],
    //   desc: createComponentInfo.desc || '无',
    //   versions: [{
    //     no: 'v1.0',
    //     desc: '系统初始化',
    //     status: Enum.COMMON_STATUS.VALID,
    //   }],
    //   cover: '',
    //   creator: userInfo.userId,
    // };

    // const result = await ctx.model.Component._create(createInfo);

    // // Todo : init component
    // returnData.data.id = result._id.toString();
    await this.createDevWorkspace(111, 'true');

    return returnData;
  }

  async createDevWorkspace(componentId, init = false, force = false) {
    // ignore force if init === true
    const { config, logger } = this;
    const { pathConfig } = config;
    const version = 'v1';
    const { componentsPath, componentsTplPath } = pathConfig;

    if (init) {
      const componentPath = `${componentsPath}/${componentId}`;
      await fs.mkdirSync(`${componentPath}`);

      const componentVersionPath = `${componentPath}/${version}`;
      await fs.mkdirSync(componentVersionPath);

      const srcPath = `${componentVersionPath}/src`;
      const srcTplPath = `${componentsTplPath}/src`;
      await fs.mkdirSync(srcPath);
      await fs.writeFileSync(`${srcPath}/main.js`, require(`${srcTplPath}/mainJs.js`)(componentId));
      await fs.writeFileSync(`${srcPath}/Component.js`, require(`${srcTplPath}/ComponentJs.js`)(componentId));
      await fs.writeFileSync(`${srcPath}/setting.js`, require(`${srcTplPath}/setting.js`)(componentId));

      const settingPath = `${srcPath}/settings`;
      await fs.mkdirSync(settingPath);
      await fs.writeFileSync(`${settingPath}/options.js`, require(`${srcTplPath}/options.js`)(componentId));
      await fs.writeFileSync(`${settingPath}/data.js`, require(`${srcTplPath}/data.js`)(componentId));

      const buildPath = `${componentsPath}/${componentId}/${version}/build`;
      const buildTplPath = `${componentsTplPath}/build`;
      await fs.mkdirSync(buildPath);
      await fs.writeFileSync(`${buildPath}/webpack.config.dev.js`, require(`${buildTplPath}/webpack.config.dev.js`)(componentId));
      await fs.writeFileSync(`${buildPath}/webpack.config.production.js`, require(`${buildTplPath}/webpack.config.production.js`)(componentId));

      await fs.writeFileSync(`${componentVersionPath}/editor.html`, require(`${componentsTplPath}/editor.html.js`)(componentId));
      await fs.writeFileSync(`${componentVersionPath}/env.js`, require(`${componentsTplPath}/env.js`)(componentsPath, componentId, version));
      await fs.writeFileSync(`${componentVersionPath}/options.js`, require(`${componentsTplPath}/options.json.js`)(componentId));
      await fs.writeFileSync(`${componentVersionPath}/package.js`, require(`${componentsTplPath}/package.json.js`)(componentId));
    }
  }
}

module.exports = ComponentService;
