import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService, changeProjectService,saveProjectService,deleteProjectService } from "../services";
import _ from "lodash";


const model = {
  // 唯一命名空间
  namespace: "AppProjectManage",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    curPage:0,
    pageSize:10,
    activeProject: null,
    isEditProjectModalVisible: false,
  },
  effects: {
    // 获取项目列表
    *getProjectList(params = {}) {
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      const res = yield getProjectManageListService(options);
      this.setProjectList(res);
    },
    // 新增项目
    *saveProject(params = {}, callback) {
      const res = yield saveProjectService(params);
      callback && callback(res);
    },
    // 编辑项目
    *changeProject(id,params = {}, callback) {
      const res = yield changeProjectService(id,params);
      callback && callback(res);
    },
    *deleteProject(params = {}, callback) {
      const res = yield deleteProjectService(params);
      callback && callback(res);
    },
  },
  reducers: {
    setProjectList(res) {
      
      this.projectList = res.data.list;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setSearchParams(searchParams) {
      let sendParams = {};
      for (let i in searchParams) {
        if (searchParams[i]) {
          sendParams[i] = searchParams[i];
        }
      }
      this.searchParams = sendParams || {};
    },
    openEditProjectModal(project) {
      this.activeProject = _.clone(project);
      this.isEditProjectModalVisible = true;
    },
    openProjectPage(project) {
      this.activeProject = _.clone(project);
    },
    closeEditProjectModal() {
      this.activeProject = null;
      this.isEditProjectModalVisible = false;
    },
  },
};

export default toMobx(model);