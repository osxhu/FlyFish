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
  router.post('/roles', controller.role.add);
  router.delete('/roles/:id', controller.role.delete);
  router.get('/roles/info/:id', controller.role.getInfo);
  router.post('/roles/list', controller.role.getList);
  router.put('/roles/:id/basic', controller.role.updateBasicInfo);
  router.put('/roles/:id/members', controller.role.updateMembersInfo);
  router.put('/roles/:id/auth', controller.role.updateAuthInfo);

  // project
  router.post('/projects', controller.project.create);
  router.delete('/projects/:projectId', controller.project.delete);
  router.put('/projects/:projectId', controller.project.edit);
  router.get('/projects/:projectId', controller.project.info);
  router.get('/projects/list', controller.project.list);

  // components
  router.post('/components/categories/list', controller.component.getCategoryList);
  router.put('/components/categories', controller.component.updateCategory);
  router.post('/components/list', controller.component.getList);
  router.post('/components', controller.component.add);
  router.post('/components/release/:id', controller.component.release);
  router.get('/components/:id', controller.component.getInfo);

  // menu
  router.get('/menus/list', controller.menu.list);
};
