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

    const screenAndViews = await ScreenAndView.findAll({ where: { status: 1 } });
    const screenAndViewMap = _.keyBy(screenAndViews, 'screen_id');

    for (const screen of screens) {
      const tagIds = screenAndViewMap[screen.screen_id] && screenAndViewMap[screen.screen_id].tag_id;
      const tagArr = tagIds.split(',');
      if (tagArr.length > 1) {
        console.log(screen.name);
      }
    }

  } catch (error) {
    console.log(error.stack || error);
  }
})();

