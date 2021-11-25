'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');
const _ = require('lodash');

const mongoUrl = config.get('mongoose.url');
const solutionUri = config.get('mysql.solution_uri');

let mongoClient,
  solutionSequelize;
const tableMap = {};
const SCREEN_STATUS = [ 'doing', 'testing', 'delivered' ];

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();

  solutionSequelize = new Sequelize(solutionUri);
  tableMap.Screen = solutionSequelize.define('visual_screen', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    screen_id: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    options_conf: {
      type: DataTypes.TEXT,
    },
    deleted_at: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.INTEGER,
    },
    updated_at: {
      type: DataTypes.INTEGER,
    },
    create_user_id: {
      type: DataTypes.INTEGER,
    },
    developing_user_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    logo: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'visual_screen',
    timestamps: false,
  });

  tableMap.ScreenAndView = solutionSequelize.define('visual_screen_tag_view', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    screen_id: {
      type: DataTypes.STRING,
    },
    tag_id: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_screen_tag_view',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { Screen, ScreenAndView } = tableMap;
    const screens = await Screen.findAll({ where: { deleted_at: 1 } });
    console.log(`${screens.length} 个应用等待被同步`);

    const screenAndViews = await ScreenAndView.findAll({ where: { status: 1 } });
    const screenAndViewMap = _.keyBy(screenAndViews, 'screen_id');

    const users = await mongoClient.db('users').find();
    const userMap = _.keyBy(users, 'old_user_id');

    const projects = await mongoClient.db('projects').find();
    const projectMap = _.keyBy(projects, 'old_id');

    // TODO: 查所有的新组件


    for (const screen of screens) {
      // Todo: tag_id只留一个
      const tagIds = screenAndViewMap[screen.screen_id] && screenAndViewMap[screen.screen_id].tag_id;
      const tagId = tagIds.split(',')[0];

      const projectId = projectMap[tagId]._id.toString();

      screen.options_conf.components = screen.options_conf.components.map(c => {
        // TODO:替换成新的mongo组件id
        c.type = '';
        c.version = 'v1.0.0';
        return c;
      });
      const doc = {
        name: screen.name,
        old_id: screen.id,
        old_screen_id: screen.screen_id,
        project_id: projectId,
        type: '2D',
        develop_status: SCREEN_STATUS[screen.status] || 'doing',
        creator: userMap[screen.create_user_id] && userMap[screen.create_user_id]._id.toString(),
        updater: userMap[screen.developing_user_id] && userMap[screen.developing_user_id]._id.toString(),
        status: 'valid',
        pages: [ screen.options_conf ],
        create_time: new Date(),
        update_time: new Date(),
      };
      await mongoClient.db('applications').insertOne(doc);
    }

  } catch (error) {
    console.log(error.stack || error);
  }
})();

