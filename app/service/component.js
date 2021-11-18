'use strict';
const Service = require('egg').Service;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const _ = require('lodash');
const simpleGit = require('simple-git');
const Diff2html = require('diff2html');
const minify = require('html-minifier').minify;
const fsExtra = require('fs-extra');

const Enum = require('../lib/enum');

class ComponentService extends Service {
  async updateCategoryInfo(updateInfo) {
    const { ctx } = this;

    const existsCategory = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 }) || [];

    const existsCategoryIds = _.flatten(_.get(existsCategory, [ 0, 'categories' ], []).map(category => (category.children || []).map(children => children.id + '')));
    const updateCategoryIds = _.flatten((updateInfo.categories || []).map(category => (category.children || []).filter(children => children.id).map(children => children.id + '')));
    const deleteCategoryIds = _.difference(existsCategoryIds, updateCategoryIds);

    const returnData = { msg: 'ok', data: {} };
    if (!_.isEmpty(deleteCategoryIds)) {
      const components = await ctx.model.Component._find({ subCategory: { $in: deleteCategoryIds } }, null, { limit: 1 }) || [];
      if (!_.isEmpty(components)) {
        returnData.msg = 'Exists Already';
        return returnData;
      }
    }

    for (let i = 0; i < (updateInfo.categories || []).length; i++) {
      const category = updateInfo.categories[i];
      if (!category.id) category.id = `${Date.now()}${i}`;
      for (let j = 0; j < (category.children || []).length; j++) {
        const subCategory = category.children[j];
        if (!subCategory.id) subCategory.id = `${Date.now()}${i}${j}`;
      }
    }
    await ctx.model.ComponentCategory._create(updateInfo);

    return returnData;
  }

  async getCategoryList() {
    const { ctx } = this;

    const result = await ctx.model.ComponentCategory._find({}, null, { sort: '-create_time', limit: 1 });
    return result;
  }

  async getList(requestData) {
    const { ctx } = this;

    const { key, name, isLib, tags, trades, projectId, developStatus, type, category, subCategory, curPage, pageSize } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };
    const queryProjects = [];
    if (projectId) queryProjects.push(projectId);

    queryCond.$or = [];
    if (key) {
      queryCond.$or.push({ name: { $regex: key } });
      queryCond.$or.push({ desc: { $regex: key } });
    }
    if (name) queryCond.name = { $regex: name };
    if (subCategory) {
      queryCond.category = category;
      queryCond.subCategory = subCategory;
    }
    if (developStatus) queryCond.developStatus = developStatus;
    if (type) queryCond.type = type;
    if (_.isBoolean(isLib)) queryCond.isLib = isLib;
    if (!_.isEmpty(tags)) queryCond.tags = { $in: tags };

    const users = await ctx.model.User._find();
    const projectList = await ctx.model.Project._find();
    const tagList = await ctx.model.Tag._find();

    const matchUsers = (users || []).filter(user => user.username.includes(key));
    const matchProjects = (projectList || []).filter(project => project.name.includes(key));
    const matchTags = (tagList || []).filter(tag => tag.name.includes(key));

    const matchUserIds = matchUsers.map(user => user.id);
    const matchProjectIds = matchProjects.map(project => project.id);
    const matchTagIds = matchTags.map(tag => tag.id);

    if (!_.isEmpty(trades)) {
      const tradeProjects = (projectList || []).filter(project => {
        const matchTrade = (trades || []).find(trade => (project.trades || []).includes(trade));
        return !_.isEmpty(matchTrade);
      });
      const tradeProjectIds = (tradeProjects || []).map(project => project.id);
      if (!_.isEmpty(tradeProjectIds)) queryProjects.push(...tradeProjectIds);
    }
    if (!_.isEmpty(queryProjects)) queryCond.projects = { $in: queryProjects };

    if (!_.isEmpty(matchUserIds)) queryCond.$or.push({ creator: { $in: matchUserIds } });
    if (!_.isEmpty(matchProjectIds)) queryCond.$or.push({ projects: { $in: matchProjectIds } });
    if (!_.isEmpty(matchTagIds)) queryCond.$or.push({ tags: { $in: matchTagIds } });
    if (_.isEmpty(queryCond.$or)) delete queryCond.$or;
    const componentList = await ctx.model.Component._find(queryCond);

    const total = componentList.length || 0;
    const data = (componentList || []).splice(curPage * pageSize, pageSize).map(component => {
      const curUser = (users || []).find(user => user.id === component.creator) || {};
      const curProjects = (projectList || []).filter(project => (component.projects || []).includes(project.id));
      const curTags = (tagList || []).filter(tag => (component.tags || []).includes(tag.id));

      return {
        id: component.id,
        name: component.name,
        developStatus: component.developStatus,
        type: component.type,
        cover: component.cover,
        category: component.category,
        subCategory: component.subCategory,
        tags: (curTags || []).map(tag => {
          return {
            id: tag.id,
            name: tag.name,
          };
        }),
        projects: (curProjects || []).map(project => {
          return {
            id: project.id,
            name: project.name,
          };
        }),
        version: _.get(component, [ 'version', (component.version || []).length - 1, 'no' ], '暂未上线'),
        creator: curUser.username,
        isLib: component.isLib || false,

        updateTime: component.updateTime,
        createTime: component.createTime,
      };
    });

    return { total, data };
  }

  async getComponentInfo(id) {
    const { ctx } = this;

    const componentInfo = await ctx.model.Component._findOne({ id });
    const userInfo = await ctx.model.User._findOne({ id: componentInfo.creator });

    const projectIds = componentInfo.projects || [];
    const projectsInfo = await ctx.model.Project._find({ id: { $in: projectIds } });

    const tradeIds = [];
    let tradesInfo = [];

    for (const projectInfo of projectsInfo) {
      if (!_.isEmpty(projectInfo.trades)) tradeIds.push(...projectInfo.trades);
    }
    if (!_.isEmpty(tradeIds)) tradesInfo = await ctx.model.Trade._find({ id: { $in: tradeIds } });

    const tagIds = componentInfo.tags || [];
    const tagsInfo = await ctx.model.Tag._find({ id: { $in: tagIds } });

    const returnInfo = {
      id: componentInfo.id,
      name: componentInfo.name,
      isLib: componentInfo.isLib,
      projects: (componentInfo.projects || []).map(project => {
        const curProject = (projectsInfo || []).find(projectInfo => projectInfo.id === project) || {};
        return {
          id: curProject.id || '',
          name: curProject.name || '',
        };
      }),
      trades: (tradesInfo || []).map(trade => {
        return {
          id: trade.id || '',
          name: trade.name || '',
        };
      }),
      tags: (componentInfo.tags || []).map(tag => {
        const curTag = (tagsInfo || []).find(tagInfo => tagInfo.id === tag) || {};
        return {
          id: curTag.id || '',
          name: curTag.name || '',
        };
      }),
      desc: componentInfo.desc,
      cover: componentInfo.cover,
      creatorInfo: {
        id: userInfo.id,
        username: userInfo.username,
      },
      developStatus: componentInfo.developStatus,
    };

    return returnInfo || {};
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

    const tagInfo = await this.getTagData(createComponentInfo);

    const createInfo = {
      name: createComponentInfo.name,
      category: createComponentInfo.category,
      subCategory: createComponentInfo.subCategory,
      type: createComponentInfo.type,
      projects: createComponentInfo.projects,
      tags: tagInfo.tags || [],
      desc: createComponentInfo.desc || '无',
      versions: [],
      cover: '/component_tpl/public/cover.png',
      creator: userInfo.userId,
      updater: userInfo.userId,
    };

    const result = await ctx.model.Component._create(createInfo);

    const componentId = result.id;
    returnData.data.id = componentId;

    const createResult = await this.initDevWorkspace(componentId);
    if (createResult.msg !== 'success') returnData.msg = createResult.msg;

    return returnData;
  }

  async getTagData(params) {
    const { ctx } = this;

    const newTagNames = (params.tags || []).filter(item => !item.id);
    const existTags = await ctx.model.Tag._find({ name: { $in: newTagNames.map(item => item.name) }, status: Enum.COMMON_STATUS.VALID, type: Enum.TAG_TYPE.COMPONENT });
    const needInsertTags = newTagNames.filter(item => !existTags.some(tag => tag.name === item.name));

    let insertedTags = [];
    if (!_.isEmpty(needInsertTags)) {
      const insertData = needInsertTags.map(item => ({ type: Enum.TAG_TYPE.COMPONENT, name: item.name }));
      insertedTags = await ctx.model.Tag._create(insertData);
    }

    return {
      tags: [
        ...(params.tags || []).filter(item => item.id).map(item => item.id), // 前端传进来的带id的
        ...existTags.map(item => item.id), // 前端传进来无id的，但库里已存在的
        ...insertedTags.map(item => item.id) ], // 前端传进来无id的，新创建的
    };
  }


  async updateInfo(id, requestData) {
    const { ctx } = this;

    const { status, type, projects, category, subCategory, isLib, desc } = requestData;

    const updateData = {};
    if (status) updateData.status = status;
    if (type) updateData.type = type;
    if (_.isBoolean(isLib)) updateData.isLib = isLib;

    if (projects) updateData.projects = projects;
    if (category) updateData.category = category;
    if (subCategory) updateData.subCategory = subCategory;
    if (desc) updateData.desc = desc;

    const tagInfo = await this.getTagData(requestData);
    Object.assign(updateData, tagInfo);

    await ctx.model.Component._updateOne({ id }, updateData);
  }

  async delete(id) {
    const { ctx } = this;

    const returnData = { msg: 'ok', data: {} };

    const existsComponent = await ctx.model.Component._findOne({ id });
    if (!_.isEmpty(existsComponent.applications)) {
      returnData.msg = 'Exists Already';
      returnData.data.error = existsComponent.applications;
      return returnData;
    }

    const updateData = {
      status: Enum.COMMON_STATUS.INVALID,
    };
    await ctx.model.Component._updateOne({ id }, updateData);

    return returnData;
  }

  async copyComponent(id, componentInfo) {
    const { ctx, config, logger } = this;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };
    // TODO: 复制组件文件时，不要复制.git文件夹！！！！

    const copyComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(copyComponent)) {
      returnData.msg = 'No Exists';
      return returnData;
    }

    const existsComponents = await ctx.model.Component._findOne({ name: componentInfo.name });
    if (!_.isEmpty(existsComponents)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const createInfo = {
      name: componentInfo.name,
      category: copyComponent.category,
      subCategory: copyComponent.subCategory,
      type: copyComponent.type,
      projects: copyComponent.projects,
      tags: copyComponent.tags || [],
      desc: copyComponent.desc || '无',
      cover: copyComponent.cover,
      creator: userInfo.userId,
      updater: userInfo.userId,
      versions: [],
    };

    const result = await ctx.model.Component._create(createInfo);

    const componentId = result.id;
    returnData.data.id = componentId;

    const createResult = await this.initDevWorkspace(componentId);
    if (createResult.msg !== 'success') returnData.msg = createResult.msg;

    // 初始化git仓库
    if (config.env === 'prod') {
      try {
        await this.initGit(componentId);
      } catch (e) {
        logger.error('git init error: ', e.stack);
      }
    }

    return returnData;
  }

  async compileComponent(id) {
    const { ctx, config } = this;
    const { pathConfig: { componentsPath } } = config;

    const version = 'current';
    const returnData = { msg: 'ok', data: { error: '' } };
    const existsComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(existsComponent)) {
      returnData.msg = 'No Exists Db';
      return returnData;
    }

    const componentPath = `${componentsPath}/${id}`;
    const componentDevPath = `${componentPath}/${version}`;
    if (!fs.existsSync(componentDevPath)) {
      returnData.msg = 'No Exists Dir';
      return returnData;
    }

    const componentDevPackageJsonPath = `${componentPath}/${version}/package.json`;
    const componentDevNodeModulesPath = `${componentPath}/${version}/node_modules`;
    const packageJson = JSON.parse(fs.readFileSync(componentDevPackageJsonPath).toString());

    if ((!_.isEmpty(packageJson.dependencies) || !_.isEmpty(packageJson.devDependencies)) && !fs.existsSync(componentDevNodeModulesPath)) {
      returnData.msg = 'No Install Depend';
      return returnData;
    }

    try {
      await exec(`cd ${componentDevPath} && npm run ${config.env === 'prod' ? 'build-production' : 'build-dev'}`);
    } catch (error) {
      returnData.msg = 'Compile Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

    // note: async screenshot component cover, no wait!!!!!
    const savePath = `${componentDevPath}/cover.png`;
    this.genCoverImage(id, savePath, version);

    // 用于git push
    if (config.env === 'prod') {
      const git = simpleGit(componentDevPath);
      const status = await git.status();
      if (!status.isClean()) {
        await ctx.model.Component._updateOne({ id }, { needPushGit: true, lastChangeTime: Date.now(), updater: ctx.userInfo.userId });
      }
    }

    return returnData;
  }

  async genCoverImage(id, savePath, version) {
    const { ctx, logger } = this;

    try {
      const url = 'http://www.baidu.com';
      const result = await ctx.helper.screenshot(url, savePath);
      if (result === 'success') {
        await ctx.model.Component._updateOne({ id }, { cover: `/components/${id}/${version}/cover.png` });
      }
      logger.info(`${id} gen cover success!`);
    } catch (error) {
      logger.error(`${id} gen cover error: ${error || error.stack}`);
    }
  }

  async installComponentDepend(id) {
    const { ctx, config } = this;
    const { pathConfig: { componentsPath } } = config;

    const returnData = { msg: 'ok', data: { error: '' } };
    const existsComponent = await ctx.model.Component._findOne({ id });
    if (_.isEmpty(existsComponent)) {
      returnData.msg = 'No Exists Db';
      return returnData;
    }

    const componentPath = `${componentsPath}/${id}`;
    const componentDevPath = `${componentPath}/current`;
    if (!fs.existsSync(componentDevPath)) {
      returnData.msg = 'No Exists Dir';
      return returnData;
    }

    try {
      await exec(`cd ${componentDevPath} && npm i`);
    } catch (error) {
      returnData.msg = 'Install Fail';
      returnData.data.error = error.message || error.stack;
      return returnData;
    }

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
    }

    const createResult = this.initReleaseWorkspace(componentInfo, no, compatible);
    await ctx.model.Component._updateOne({ id: componentId }, { developStatus: Enum.COMPONENT_DEVELOP_STATUS.ONLINE, $push: { versions: { no, desc, status: Enum.COMMON_STATUS.VALID } } });

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
  async initDevWorkspace(componentId) {
    const { config, logger } = this;
    const { pathConfig: { componentsPath, componentsTplPath } } = config;

    const returnInfo = { msg: 'Success' };

    const version = 'current';
    const componentPath = `${componentsPath}/${componentId}`;
    const componentDevPath = `${componentPath}/${version}`;
    try {
      fs.mkdirSync(`${componentPath}`);

      fs.mkdirSync(componentDevPath);

      const srcPath = `${componentDevPath}/src`;
      const srcTplPath = `${componentsTplPath}/src`;

      const replaceId = 'Component_' + componentId;
      fs.mkdirSync(srcPath);
      fs.writeFileSync(`${srcPath}/main.js`, require(`${srcTplPath}/mainJs.js`)(replaceId));
      fs.writeFileSync(`${srcPath}/Component.js`, require(`${srcTplPath}/ComponentJs.js`)(replaceId));
      fs.writeFileSync(`${srcPath}/setting.js`, require(`${srcTplPath}/setting.js`)(replaceId));

      const settingPath = `${srcPath}/settings`;
      fs.mkdirSync(settingPath);
      fs.writeFileSync(`${settingPath}/options.js`, require(`${srcTplPath}/options.js`)(replaceId));
      fs.writeFileSync(`${settingPath}/data.js`, require(`${srcTplPath}/data.js`)(replaceId));

      const buildPath = `${componentDevPath}/build`;
      const buildTplPath = `${componentsTplPath}/build`;
      fs.mkdirSync(buildPath);
      fs.writeFileSync(`${buildPath}/webpack.config.dev.js`, require(`${buildTplPath}/webpack.config.dev.js`)(replaceId));
      fs.writeFileSync(`${buildPath}/webpack.config.production.js`, require(`${buildTplPath}/webpack.config.production.js`)(replaceId));

      fs.writeFileSync(`${componentDevPath}/editor.html`, require(`${componentsTplPath}/editor.html.js`)(componentId));
      fs.writeFileSync(`${componentDevPath}/env.js`, require(`${componentsTplPath}/env.js`)(componentId, replaceId, version));
      fs.writeFileSync(`${componentDevPath}/options.json`, require(`${componentsTplPath}/options.json.js`)(replaceId));
      fs.writeFileSync(`${componentDevPath}/package.json`, require(`${componentsTplPath}/package.json.js`)(replaceId));
      await fsExtra.copy(`${componentsTplPath}/.gitignore`, `${componentDevPath}/.gitignore`);
    } catch (error) {
      returnInfo.msg = 'Fail';
      logger.error('createDevWorkspace error: ', error || error.stack);
    }
    if (config.env === 'prod') {
      try {
        await this.initGit(componentId);
      } catch (e) {
        logger.error('git init error: ', e.stack);
      }
    }

    return returnInfo;
  }

  async initGit(componentId) {
    const { ctx, config: { pathConfig: { componentsPath }, componentGit }, logger } = this;
    const componentDevPath = `${componentsPath}/${componentId}/current`;
    const userInfo = ctx.userInfo;
    try {
      const git = simpleGit(componentDevPath);

      const reqBody = {
        name: componentId,
        path: componentId,
        namespace_id: componentGit.namespaceId,
      };
      const newRepo = await ctx.http.post(`https://git.cloudwise.com/api/v4/projects?private_token=${componentGit.privateToken}`, reqBody);
      const { id: newRepoId, ssh_url_to_repo: newRepoUrl } = newRepo;

      await git
        .init()
        .add('.')
        .commit(`first commit by ${userInfo.username}`)
        .addRemote('origin', newRepoUrl)
        .push([ '-u', '--set-upstream', 'origin', 'master' ]);

      await ctx.model.Component._updateOne({ id: componentId }, { gitLabProjectId: newRepoId, needPushGit: false, lastChangeTime: Date.now() });
    } catch (e) {
      logger.error(e.stack || e);
    }
  }

  async getComponentHistory(options) {
    const { ctx, config: { pathConfig: { componentsPath } } } = this;
    const { id, curPage, pageSize } = options;

    const componentDevPath = `${componentsPath}/${id}/current`;
    const git = simpleGit(componentDevPath);
    const { all: totalLogs } = await git.log();
    const total = totalLogs.length;
    const selectedLogs = totalLogs.slice(curPage * pageSize, (curPage + 1) * pageSize);

    return {
      total,
      list: selectedLogs.map(log => {
        return {
          hash: log.hash,
          message: log.message,
          time: new Date(log.date).getTime(),
        };
      }),
    };
  }

  async getCommitInfo(options) {
    const { config: { pathConfig: { componentsPath } } } = this;
    const { id, hash } = options;

    const componentDevPath = `${componentsPath}/${id}/current`;

    const git = simpleGit(componentDevPath);
    const diffStr = await git.show(hash);
    const diffJson = Diff2html.parse(diffStr);
    const diffHtml = Diff2html.html(diffJson, { drawFileList: true });
    const compressHtml = minify(diffHtml, {
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      conservativeCollapse: true,
    });
    return compressHtml;
  }
}

module.exports = ComponentService;
