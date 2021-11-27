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
    const componentDir = path.resolve(staticDir, 'components');
    const components = await db.collection('components').find().toArray();

    for (const component of components) {
      const source = path.resolve(oldVCWww, 'static/dev_visual_component/dev_workspace', component.old_org_mark, component.old_component_mark);
      const target = path.resolve(componentDir, component._id.toString(), 'v-current');
      await copyAndIgnore(source, target, [ '.git' ]);

      // 加版本号
      await replaceFiles(target, 'v-current');

      if (component.develop_status === 'online') {
        const versionTarget = path.resolve(componentDir, component._id.toString(), 'v1.0.0');
        await copyAndIgnore(source, versionTarget, [ '.git' ]);

        // 加版本号
        await replaceFiles(versionTarget, 'v1.0.0');

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

async function replaceFiles(target, version) {
  const mainJsPath = path.resolve(target, 'src/main.js');
  const mainJsOrigin = await fs.readFile(mainJsPath, { encoding: 'utf8' });
  const mainJsReplacement = mainJsOrigin.replace(/registerComponent\(\'(\w+)\'\,\sComponent\);/, `registerComponent(\'$1\', \'${version}\', Component);`);
  await fs.writeFile(mainJsPath, mainJsReplacement);

  const settingJsPath = path.resolve(target, 'src/setting.js');
  const settingJsOrigin = await fs.readFile(settingJsPath, { encoding: 'utf8' });
  const settingJsReplacement = settingJsOrigin.replace(/registerComponentOptionsSetting\(\'(\w+)\'\,\sOptionsSetting\);/, `registerComponentOptionsSetting(\'$1\', \'${version}\', OptionsSetting);`)
    .replace(/registerComponentDataSetting\(\'(\w+)\'\,\sDataSetting\);/, `registerComponentDataSetting(\'$1\', \'${version}\', DataSetting);`);
  await fs.writeFile(settingJsPath, settingJsReplacement);
}


async function copyAndIgnore(src, dest, ignores) {
  await fs.copy(src, dest, { filter: src => {
    const basename = path.basename(src);
    return !ignores.some(item => basename === item);
  } });
}

