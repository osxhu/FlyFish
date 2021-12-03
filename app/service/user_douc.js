'use strict';
const Service = require('egg').Service;
const Enum = require('../lib/enum');

const md5 = require('md5');
const _ = require('lodash');
const DEFAULT_PASSWORD = '123456';

class UserDoucService extends Service {
  async syncUser() {
    const { ctx, config: { cookieConfig: { doucCookieName }, services: { douc: { baseURL } } } } = this;

    const returnData = { msg: 'ok', data: {} };

    const doucCookieValue = ctx.cookies.get(doucCookieName, { signed: false });
    const userId = ctx.headers.userid;
    const headers = {
      Cookie: `${doucCookieName}=${doucCookieValue}`,
    };

    const doucUserInfo = await ctx.http.get(baseURL + `/douc/api/v1/user/get/${userId}`, {}, { headers });
    const userStatus = _.get(doucUserInfo, [ 'data', 'status' ]);
    const userCode = _.get(doucUserInfo, [ 'code' ]);
    if (userStatus !== 1 || userCode !== 100000) {
      // TODO
      throw Error('user Status Error');
    }

    const { iuser } = await ctx.http.get(baseURL + '/api/v1/auth?module=lcap', {}, { headers });
    const username = _.get(doucUserInfo, [ 'data', 'userAlias' ], '');
    const existsUserInfo = await ctx.model.User._findOne({ username });
    returnData.data = existsUserInfo;

    if (_.isEmpty(existsUserInfo)) {
      const initRoleInfo = await ctx.model.Role._findOne({ name: iuser.isAdmin ? Enum.ROLE.ADMIN : Enum.ROLE.MEMBER });
      const createUserInfo = {
        username,
        phone: _.get(doucUserInfo, [ 'data', 'phone' ], ''),
        email: _.get(doucUserInfo, [ 'data', 'email' ], ''),
        password: md5(DEFAULT_PASSWORD),
        role: initRoleInfo.id,
        is_douc: true,
      };
      await ctx.model.User._create(createUserInfo);
      const userInfo = await ctx.model.User._findOne({ username: createUserInfo.username });
      returnData.data = userInfo;
    }

    return returnData;
  }
}

module.exports = UserDoucService;
