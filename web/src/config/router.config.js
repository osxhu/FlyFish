module.exports = {
  loadingComponent: "@/components/Loading", // 路由按需加载 loading组件
  noAuthShow: "@/components/NoAuth", // 无权限展示效果
  hocRouteWrapper: "@/components/hocRouteWrapper", // 每个路由可以通过高阶组件进行处理
  routes: [
    {
      path: "/404", // 路径
      code: "44", // 唯一code，权限校验用，无code代办无权限
      exact: true, // 是否精确匹配
      dynamic: false, // 是否懒加载
      component: "@/pages/Error",
    },
    {
      path: "/",
      component: "@/layouts/BasicLayout",
      dynamic: false,
      routes: [
        {
          icon: "pie-chart",
          name: "应用创建",
          path: "/app",
          component: "@/pages/App",
          routes: [
            {
              name: "项目管理",
              path: "/app/project-manage",
              component: "@/pages/App/ProjectManage",
            },
            {
              name: "布局",
              path: "/app/:id/project-detail",
              component: "@/pages/App/ProjectDetail",
              hideInMenu: true,
              activeMenuKey: "/app/project-manage"
            },
            {
              name: "应用开发",
              path: "/app/apply-develop",
              component: "@/pages/App/ApplyDevelop",
            }
            // { from: "/app", to: "/app/project-manage" },
          ],
        },
        {
          icon: "pie-chart",
          name: "测试登录",
          path: "/login",
          component: "@/pages/Login",
        },
        {
          icon: "pie-chart",
          name: "列表页",
          path: "/list",
          component: "@/layouts/NestedRouterLayout",
          routes: [
            {
              name: "基础列表",
              path: "/list/basic-list",
              component: "@/pages/List/BasicList",
            },
            {
              name: "详情",
              path: "/list/list-detail/:id",
              component: "@/pages/List/ListDetail",
              hideInMenu: true,
              activeMenuKey: "/list/basic-list",
              showBack: true, // 当前面包屑位置显示为返回
            },
            {
              name: "搜索列表",
              path: "/list/search-list",
              component: "@/pages/List/SearchList",
            },
            {
              name: "带导航列表",
              path: "/list/navigation-list",
              component: "@/pages/List/NavigationList",
            },
            { from: "/list", to: "/list/basic-list" },
          ],
        },
        {
          icon: "pie-chart",
          name: "表单",
          path: "/form",
          component: "@/pages/Form/index",
          routes: [
            {
              name: "基础",
              path: "/form/basic",
              component: "@/pages/Form/Basic",
            },
            {
              name: "侧边展示",
              path: "/form/siderShow",
              component: "@/pages/Form/SiderShow",
            },
            {
              name: "动态表单",
              path: "/form/dynamic",
              component: "@/pages/Form/Dynamic",
            },
            {
              name: "表单联动",
              path: "/form/link",
              component: "@/pages/Form/Link",
            },
          ],
        },
        {
          icon: "pie-chart",
          name: "用户管理",
          path: "/user",
          component: "@/pages/User",
          routes: [
            {
              name: "用户列表",
              path: "/user/user-manage",
              component: "@/pages/User/UserManage",
            },
            {
              name: "角色列表",
              path: "/user/role-manage",
              component: "@/pages/User/RoleManage",
            },
          ],
        },
        { from: "/", to: "/app" },
      ],
    },
  ],
};
