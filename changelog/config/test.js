'use strict';

module.exports = Object.assign(require('../../config/config.test'), {
  mysql: {
    uri: 'mysql://root:Admin@123@10.2.3.247:3306/visual_component_platform',
  },
});
