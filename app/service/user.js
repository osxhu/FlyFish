'use strict';
const Service = require('egg').Service;

class UserService extends Service {
  async userLogin() {
    const result = await this.ctx.model.User.find();
    return result;
  }
}

module.exports = UserService;
