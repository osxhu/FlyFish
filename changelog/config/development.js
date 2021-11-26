'use strict';

module.exports = Object.assign(require('../../config/config.development')({}), {
  mysql: {
    visual_component_uri: 'mysql://Rootmaster:Rootmaster@777@10.2.3.56:3306/visual_component_platform',
    solution_uri: 'mysql://Rootmaster:Rootmaster@777@10.2.3.56:3306/solution_platform',
  },
  old_vc_www: '/resources/flyFish/visual_component_platform_server/www',
  old_solution_www: '/resources/flyFish/solution-platform-server/www',
});
