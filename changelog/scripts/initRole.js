'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');

const mongoUrl = config.get('mongoose.url');

let mongoClient,
  db;

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();
  db = mongoClient.db('flyfish');
}


(async () => {
  try {
    await init();
    const docs = [{
      name: '管理员',
      status: 'valid',
      menus: [
        {
          name: '应用创建',
          url: '/path/1',
        },
        {
          name: '项目管理',
          url: '/path/1-1',
        },
        {
          name: '组件开发',
          url: '/path/1-2',
        },
        {
          name: '应用开发',
          url: '/path/1-3',
        },
        {
          name: '模板库',
          url: '/path/2',
        },
        {
          name: '组件库',
          url: '/path/2-1',
        },
        {
          name: '应用模板库',
          url: '/path/2-2',
        },
        {
          name: '用户管理',
          url: '/path/3',
        },
        {
          name: '用户列表',
          url: '/path/3-1',
        },
        {
          name: '角色列表',
          url: '/path/3-2',
        },
      ],
      desc: 'admin',
      create_time: new Date(),
      update_time: new Date(),
    },
    {
      name: '成员',
      status: 'valid',
      menus: [
        {
          name: '组件开发',
          url: '/path/1-2',
        },
        {
          name: '应用创建',
          url: '/path/1',
        },
        {
          name: '项目管理',
          url: '/path/1-1',
        },
        {
          name: '应用开发',
          url: '/path/1-3',
        },
        {
          name: '用户列表',
          url: '/path/3-1',
        },
        {
          name: '用户管理',
          url: '/path/3',
        },
        {
          name: '角色列表',
          url: '/path/3-2',
        },
        {
          name: '组件库',
          url: '/path/2-1',
        },
        {
          name: '应用模板库',
          url: '/path/2-2',
        },
        {
          name: '模板库',
          url: '/path/2',
        },
      ],
      desc: '基础角色',
      create_time: new Date(),
      update_time: new Date(),
    },
    ];
    await db.collection('roles').insertMany(docs);
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

