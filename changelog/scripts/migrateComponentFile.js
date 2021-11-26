'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const mongoUrl = config.get('mongoose.url');
const staticDir = config.get('pathConfig.staticDir');
const oldVCWww = config.get('old_vc_www');
const oldSolutionWww = config.get('old_solution_www');

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
    const componentDir = path.resolve(staticDir, 'www/components');
    const components = await db.collection('components').find({}, {}).toArray();
    const componentMap = _.keyBy(components, 'old_component_mark');

    for (const component of components) {
      const source = path.resolve(oldVCWww, 'static/dev_visual_component/dev_workspace', component.old_org_mark, component.old_component_mark);
      const target = path.resolve(componentDir, component._id.toString(), 'v-current');
      await fs.copy(source, target);

      if (component.develop_status === 'online') {
        const versionTarget = path.resolve(componentDir, component._id.toString(), 'v1.0.0');
        await fs.copy(source, versionTarget);

        const releaseSource = path.resolve(oldSolutionWww, 'static/public_visual_component/1', component.old_component_mark);
        const releaseTarget = path.resolve(versionTarget, 'release');
        await fs.copy(releaseSource, releaseTarget);
      }
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

