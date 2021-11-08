import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService, saveProjectService } from "../services";
import _ from "lodash";

const model = {
  // 唯一命名空间
  namespace: "ApplyDevelop",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    activeProject: null,
    isEditProjectModalVisible: false,
  },
  effects: {
    // 获取项目列表数据
    *getProjectList(params = {}) {
      // 处理参数
      let options = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      // 请求数据
      const res = yield getProjectManageListService(options);
      this.setProjectList(res);
    },
    *saveProject(params = {}, callback) {
      // 测试代码
      const res = yield saveProjectService(params);
      callback && callback(res);
    },
  },
  reducers: {
    setProjectList(res) {
      this.projectList = res.data;
      this.total = res.total;
      this.currentPage = res.currentPage;
      this.pageSize = res.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
    openEditProjectModal(project) {
      this.activeProject = _.clone(project);
      this.isEditProjectModalVisible = true;
    },
    closeEditProjectModal() {
      this.activeProject = null;
      this.isEditProjectModalVisible = false;
    },
  },
};

export default toMobx(model);