import { toMobx } from '@chaoswise/cw-mobx';
import { getProjectManageListService, saveProjectService } from "../services";
import _ from "lodash";
import { message } from 'antd';

const model = {
  // 唯一命名空间
  namespace: "RoleList",
  // 状态
  state: {
    searchParams: {},
    projectList: [],
    total: 0,
    activeProject: null,
    activeUser:null,
    isEditRoleModalVisible: false,
    isRoleModalVisible:false,
    deleteId:null
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
    openEditRoleModal(project) {
      this.activeProject = _.clone(project);
      this.isEditRoleModalVisible = true;
    },
    openRoleModal(project){
      this.activeUser = _.clone(project);
      this.isRoleModalVisible = true;
    },
    closeRoleModal(){
      this.activeUser = null;
      this.isRoleModalVisible = false;
    },
    closeEditRoleModal() {
      this.activeProject = null;
      this.isEditRoleModalVisible = false;
    },
    deleteOne(id){
      this.deleteId=id;
      message.success('删除成功');
    }
  },
};

export default toMobx(model);