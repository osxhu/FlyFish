import { toMobx } from '@chaoswise/cw-mobx';
import { getUsertManageListService, saveProjectService } from "../services";
import _ from "lodash";
import { message } from 'antd';

const model = {
  // 唯一命名空间
  namespace: "UserList",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    activeProject: null,
    activeUser:null,
    isEditProjectModalVisible: false,
    isRoleModalVisible:false,
    deleteId:null,
    currentPage:1,
    pageSize:30
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
      const res = yield getUsertManageListService(options);
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
      this.projectList = res.data.list;
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
    openRoleModal(project){
      this.activeUser = _.clone(project);
      this.isRoleModalVisible = true;
    },
    closeRoleModal(){
      this.activeUser = null;
      this.isRoleModalVisible = false;
    },
    closeEditProjectModal() {
      this.activeProject = null;
      this.isEditProjectModalVisible = false;
    },
    deleteOne(id){
      this.deleteId=id;
      message.success('删除成功');
    }
  },
};

export default toMobx(model);