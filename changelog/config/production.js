'use strict';

module.exports = Object.assign(require('../../config/config.prod')({}), {
  mysql: {
    visual_component_uri: 'mysql://root:Root@123@10.0.14.151:3306/visual_component_platform',
    solution_uri: 'mysql://root:Root@123@10.0.14.151:3306/solution_platform',
  },
});
