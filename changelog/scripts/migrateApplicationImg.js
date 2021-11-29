'use strict';

const config = require('config');
const { MongoClient } = require('mongodb');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const mongoUrl = config.get('mongoose.url');
const staticDir = config.get('pathConfig.staticDir');
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
    const appDir = path.resolve(staticDir, 'applications');
    const apps = await db.collection('applications').find().toArray();

    for (const app of apps) {
      const page = app.pages[0];
      const bgImgSource = path.resolve(oldSolutionWww, page.options.backgroundImage);
      const gbImgBasename = path.basename(page.options.backgroundImage);
      const bgImgTarget = path.resolve(appDir, app._id.toString(), gbImgBasename);
      await fs.copy(bgImgSource, bgImgTarget);
      page.options._backgroundImage = page.options.backgroundImage;
      page.options.backgroundImage = path.join('applications', app._id.toString(), gbImgBasename);

      for (const component of page.components) {
        if (component.options.image) {
          const componentImgSource = path.resolve(oldSolutionWww, component.options.image);
          const componentImgBasename = path.basename(component.options.image);
          const componentImgTarget = path.resolve(appDir, app._id.toString(), componentImgBasename);
          await fs.copy(componentImgSource, componentImgTarget);
          component.options._image = component.options.image;
          component.options.image = path.join('applications', app._id.toString(), componentImgBasename);
        }
      }

      // 迁移封面
      const coverSource = path.resolve(oldSolutionWww, 'upload/screen/cover', app._cover);
      const coverTarget = path.resolve('applications', app._id.toString(), 'cover.png');
      await fs.copy(coverSource, coverTarget);

      await db.collection('applications').updateOne({ _id: app._id }, { $set: { pages: app.pages } });
    }

  } catch (error) {
    console.log(error.stack || error);
  } finally {
    mongoClient.close();
    process.exit(0);
  }
})();

