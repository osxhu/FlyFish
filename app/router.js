'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.use(app.middleware.authCheck(app.config));

  // users
  router.post('/users/login', controller.user.login);
};
