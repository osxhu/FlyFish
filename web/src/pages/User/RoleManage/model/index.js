import { toMobx } from '@chaoswise/cw-mobx';
import { getUserListService, changeRole, addNewRole ,deleteOneRole} from "../services";
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
    activeUser: null,
    isEditRoleModalVisible: false,
    isRoleModalVisible: false,
    deleteId: null,
    curPage:0,
    pageSize:30
    
  },
  effects: {
    // 获取项目列表数据
    *getUserList(params = {}) {
      // 处理参数
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      // 请求数据
      const res = yield getUserListService(options);
      this.setProjectList(res);
    },
    *saveProject(params = {}, callback) {
      // 测试代码
      const res = yield changeRole(params);
      callback && callback(res);
    },
    * changeRole(id,params = {}, callback) {
      const res = yield changeRole(id,params);
      callback && callback(res);
    },
    * addNewRole(params = {}, callback) {
      const res = yield addNewRole(params);
      callback && callback(res);
    },
    * deleteRole(params = {}, callback) {
    const res = yield deleteOneRole(params);
    callback && callback(res);
  }
  },
  reducers: {
    setProjectList(res) {
      this.projectList = res.data.list;
      this.total = res.total;
      this.curPage = res.curPage;
      this.pageSize = res.pageSize;
    },
    setSearchParams(searchParams) {
      let sendParams = {};
      for(let i in searchParams){
        if(searchParams[i]){
          sendParams[i] = searchParams[i];
        }
      }
      this.searchParams = sendParams || {};
    },
    openEditRoleModal(project) {
      this.activeProject = _.clone(project);
      this.isEditRoleModalVisible = true;
    },
    openRoleModal(project) {
      this.activeUser = _.clone(project);
      this.isRoleModalVisible = true;
    },
    closeRoleModal() {
      this.activeUser = null;
      this.isRoleModalVisible = false;
    },
    closeEditRoleModal() {
      this.activeProject = null;
      this.isEditRoleModalVisible = false;
    },
    deleteOne(id) {
      this.deleteId = id;
      message.success('删除成功');
    }
  },
};

export default toMobx(model);