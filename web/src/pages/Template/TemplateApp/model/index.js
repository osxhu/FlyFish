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
    isCopyApplyModalVisible: false,
  },
  effects: {
    // 获取项目列表数据
    *getProjectList(params = {}) {
      // 处理参数
      let options = {
        curPage: this.curPage,
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
      this.curPage = res.curPage;
      this.pageSize = res.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
    openCopyApplyModal(project) {
      this.activeProject = _.clone(project);
      this.isCopyApplyModalVisible = true;
    },
    closeCopyApplyModal() {
      this.activeProject = null;
      this.isCopyApplyModalVisible = false;
    },
  },
};

export default toMobx(model);