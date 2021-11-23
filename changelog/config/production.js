module.exports = Object.assign(require('../../config/config.prod')({}), {
  mysql: {
    uri: 'mysql://root:Root@123@10.0.14.151:3306/visual_component_platform'
  },
});