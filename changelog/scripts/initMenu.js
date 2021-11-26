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
    const doc = {
      menus: [
        {
          name: '应用创建',
          url: '/path/1',
          children: [
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
          ],
        },
        {
          name: '模板库',
          url: '/path/2',
          children: [
            {
              name: '组件库',
              url: '/path/2-1',
            },
            {
              name: '应用模板库',
              url: '/path/2-2',
            },
          ],
        },
        {
          name: '用户管理',
          url: '/path/3',
          children: [
            {
              name: '用户列表',
              url: '/path/3-1',
            },
            {
              name: '角色列表',
              url: '/path/3-2',
            },
          ],
        },
      ],
      create_time: new Date(),
      update_time: new Date(),
    };
    await db.collection('menus').insertOne(doc);
  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

