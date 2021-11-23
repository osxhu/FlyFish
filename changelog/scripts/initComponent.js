'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const { Sequelize, DataTypes, Op } = require('sequelize');

const mongoUrl = config.get('mongoose.url');
const mysqlUri = config.get('mysql.uri');

let client,
  sequelize;

(async () => {
  await init();

})();

async function init() {
  client = new MongoClient(mongoUrl);
  await client.connect();
  sequelize = new Sequelize(mysqlUri);

}
