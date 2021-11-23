module.exports = Object.assign(require('../../config/config.development')({}), {
  mysql: {
    uri: 'mysql://Rootmaster:Rootmaster@777@10.2.3.56:3306/visual_component_platform'
  },
});
