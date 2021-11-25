'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');

const mongoUrl = config.get('mongoose.url');
const mysqlUri = config.get('mysql.uri');

let client,
  sequelize;
const tableMap = {};
async function init() {
  client = new MongoClient(mongoUrl);
  await client.connect();
  sequelize = new Sequelize(mysqlUri);
  tableMap.Component = sequelize.define('visual_components', {
    component_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    org_id: {
      type: DataTypes.INTEGER,
    },
    component_mark: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    deleted_at: {
      type: DataTypes.INTEGER,
    },
    created_at: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'visual_components',
    timestamps: false,
  });
}


(async () => {
  try {
    await init();
    const { Component } = tableMap;
    const components = await Component.findAll({ where: { deleted_at: 1 } });
    console.log(`${components.length} 个组件等待被同步`);

    for (const component of components) {
      const doc = {
        name: component.name,
        component_mark: component.component_mark,
        old_id: component.component_id,
        create_time: new Date(),
        update_time: new Date(),
      };
      await client.db('components').insertOne(doc);
    }


  } catch (error) {
    console.log(error.stack || error);
  }
})();

