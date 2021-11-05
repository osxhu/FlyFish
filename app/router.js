'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.use(app.middleware.authCheck(app.config));

  // users
  router.post('/users/register', controller.user.register);
  router.post('/users/login', controller.user.login);
  router.post('/users/logout', controller.user.logout);
};
