'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');

const mongoUrl = config.get('mongoose.url');
const solutionUri = config.get('mysql.solution_uri');

let mongoClient,
  solutionSequelize;
const tableMap = {};

async function init() {
  mongoClient = new MongoClient(mongoUrl);
  await mongoClient.connect();

  solutionSequelize = new Sequelize(solutionUri);
  tableMap.Tag = solutionSequelize.define('component_tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'component_tag',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { Tag } = tableMap;
    const tags = await Tag.findAll({ where: { status: 1 } });
    console.log(`${tags.length} 个项目等待被同步`);

    for (const tag of tags) {
      const doc = {
        name: tag.name,
        desc: tag.description,
        status: 'valid',
        create_time: new Date(),
        update_time: new Date(),
        old_id: tag.id,
      };
      await mongoClient.db('projects').insertOne(doc);
    }
  } catch (error) {
    console.log(error.stack || error);
  }
})();

