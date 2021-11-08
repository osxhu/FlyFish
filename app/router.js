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
  router.get('/users/info/:id', controller.user.getInfo);
  router.post('/users/list', controller.user.getList);
  router.put('/users/info/:id', controller.user.updateUserInfo);

  // roles
  router.post('/roles/add', controller.role.add);
  router.delete('/roles/:id', controller.role.delete);
  router.get('/roles/info/:id', controller.role.getInfo);
  router.post('/roles/list', controller.role.getList);
  router.put('/roles/:id/basic-info', controller.role.updateBasicInfo);
  router.put('/roles/:id/members', controller.role.updateMembersInfo);
  router.put('/roles/:id/auth', controller.role.updateAuthInfo);
};
