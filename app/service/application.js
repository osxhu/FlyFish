'use strict';
const Service = require('egg').Service;
const _ = require('lodash');

const Enum = require('../lib/enum');

class ApplicationService extends Service {
  async create(params) {
    const { ctx } = this;
    const userInfo = ctx.userInfo;

    Object.assign(params, {
      creator: userInfo.userId,
      updater: userInfo.userId,
    });

    const returnData = { msg: 'ok', data: {} };

    const existsApplications = await ctx.model.Application._findOne({ name: params.name });
    if (!_.isEmpty(existsApplications)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }
    const result = await ctx.model.Application._create(params);
    returnData.data = result;

    return returnData;
  }

  async updateBasicInfo(id, requestData) {
    const { ctx } = this;

    const userInfo = ctx.userInfo;
    const { type, projectId, tags, isLib } = requestData;

    const updateData = {
      updater: userInfo.userId,
    };
    if (type) updateData.type = type;
    if (projectId) updateData.projectId = projectId;
    if (tags) updateData.tags = tags;
    if (_.isBoolean(isLib)) updateData.isLib = isLib;

    await ctx.model.Application._updateOne({ id }, updateData);
  }

  async updateDesignInfo(id, requestData) {
    const { ctx } = this;
    const { pages } = requestData;

    const updateData = {};
    if (!_.isEmpty(pages)) updateData.pages = pages;
    await ctx.model.Application._updateOne({ id }, updateData);
  }

  async copyApplication(id, applicationInfo) {
    const { ctx } = this;

    const userInfo = ctx.userInfo;
    const returnData = { msg: 'ok', data: {} };

    const copyApplication = await ctx.model.Application._findOne({ id });
    if (_.isEmpty(copyApplication)) {
      returnData.msg = 'No Exists';
      return returnData;
    }

    const existsApplications = await ctx.model.Application._findOne({ name: applicationInfo.name });
    if (!_.isEmpty(existsApplications)) {
      returnData.msg = 'Exists Already';
      return returnData;
    }

    const createInfo = {
      name: applicationInfo.name,

      type: copyApplication.type,
      category: copyApplication.category,
      projectId: copyApplication.projectId,
      tags: copyApplication.tags || [],
      cover: copyApplication.cover,
      developStatus: copyApplication.developStatus,
      pages: copyApplication.pages,
      status: copyApplication.status,

      creator: userInfo.userId,
      updater: userInfo.userId,
    };

    const result = await ctx.model.Application._create(createInfo);
    returnData.data.id = result.id;

    return returnData;
  }

  async getApplicationInfo(id) {
    const { ctx } = this;

    const applicationInfo = await ctx.model.Application._findOne({ id });
    const usersInfo = await ctx.model.User._find({ id: { $in: [ applicationInfo.creator, applicationInfo.updater ] } });
    const creatorUser = (usersInfo || []).find(user => user.id === applicationInfo.creator) || {};
    const updaterUser = (usersInfo || []).find(user => user.id === applicationInfo.updater) || {};

    let projectInfo = {};
    if (!_.isEmpty(applicationInfo.projectId)) projectInfo = await ctx.model.Project._findOne({ id: applicationInfo.projectId });
    const tagIds = applicationInfo.tags || [];
    const tagsInfo = await ctx.model.Tag._find({ id: { $in: tagIds } });

    const returnInfo = {
      id: applicationInfo.id,
      name: applicationInfo.name,
      isLib: applicationInfo.isLib,
      projectInfo: {
        id: projectInfo.id || '',
        name: projectInfo.name || '',
      },
      tags: (applicationInfo.tags || []).map(tag => {
        const curTag = (tagsInfo || []).find(tagInfo => tagInfo.id === tag) || {};
        return {
          id: curTag.id || '',
          name: curTag.name || '',
        };
      }),
      pages: applicationInfo.pages || [],
      type: applicationInfo.type,
      cover: applicationInfo.cover,
      developStatus: applicationInfo.developStatus,

      creatorInfo: {
        id: creatorUser.id,
        username: creatorUser.username,
      },
      updaterInfo: {
        id: updaterUser.id,
        username: updaterUser.username,
      },
    };

    return returnInfo || {};
  }

  async delete(id) {
    const { ctx } = this;

    const updateData = {
      status: Enum.COMMON_STATUS.INVALID,
    };

    await ctx.model.Application._updateOne({ id }, updateData);
  }

  async getList(requestData) {
    const { ctx } = this;

    const { name, type, isLib, tags, projectId, developStatus, curPage, pageSize } = requestData;
    const queryCond = {
      status: Enum.COMMON_STATUS.VALID,
    };

    if (name) queryCond.name = name;
    if (developStatus) queryCond.developStatus = developStatus;
    if (projectId) queryCond.projectId = projectId;
    if (type) queryCond.type = type;
    if (_.isBoolean(isLib)) queryCond.isLib = isLib;
    if (!_.isEmpty(tags)) queryCond.tags = { $in: tags };

    const users = await ctx.model.User._find({});
    const projectList = await ctx.model.Project._find();
    const tagList = await ctx.model.Tag._find();

    const applicationList = await ctx.model.Application._find(queryCond);

    const total = applicationList.length || 0;
    const data = (applicationList || []).slice(curPage, curPage + pageSize).map(application => {
      const curCreatorUser = (users || []).find(user => user.id === application.creator) || {};
      const curUpdaterUser = (users || []).find(user => user.id === application.updater) || {};
      const curProjectInfo = (projectList || []).find(project => project.id === projectId);
      const curTags = (tagList || []).filter(tag => (application.tags || []).includes(tag.id));

      return {
        id: application.id,
        name: application.name,
        developStatus: application.developStatus,
        type: application.type,
        cover: application.cover,
        tags: (curTags || []).map(tag => {
          return {
            id: tag.id,
            name: tag.name,
          };
        }),
        projects: {
          id: curProjectInfo.id,
          name: curProjectInfo.name,
        },
        pages: application.pages || [],
        creator: curCreatorUser.username,
        updater: curUpdaterUser.username,
        updateTime: application.updateTime,
        createTime: application.createTime,
      };
    });

    return { total, data };
  }
}

module.exports = ApplicationService;
