'use strict';
const Service = require('egg').Service;

class HomeService extends Service {
  async getHomeInfo() {
    const { ctx, app, service, config, logger } = this;

    // logger.error() 要传入Error类型
    // logger.error(new Error('whoops'));
    // const result = await ctx.model.User.create({ name: 'ju' });

    // http example
    // ctx.http.post('/post', {postId: 123}).then((data)=>{
    //   // data is only remote server response data
    //   console.log(data);
    // }).catch((err)=>{
    //   console.error(err);
    // });
    const result = await ctx.http.post('/web/rbac/user/login', {"user_email": "test@yunzhihui.com",
    "user_password": "yunzhihui123"});

    return result;
  }
}

module.exports = HomeService;
