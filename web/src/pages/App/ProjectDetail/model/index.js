import { toMobx ,toJS} from '@chaoswise/cw-mobx';
import { reqApplicationList } from "../services";
import _ from "lodash";

const model = {
  // 唯一命名空间
  namespace: "ProjectDetail",
  // 状态
  state: {
    checkPageFLag: 'applyList',
    searchParams: {},
    applicationList: {}, //应用列表
    applicationLength:0,
    total: 0,
    curPage:0,
    pageSize:10,
    activeProject: {},
    isEditProjectModalVisible: false,
  },
  effects: {
    // 获取项目列表数据
    *getApplicationList(params = {},flag) {
      // 处理参数
      let options = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...this.searchParams,
        ...params,
      };
      // 请求数据
      const res = yield reqApplicationList(options);
      this.setApplicationList(res,flag);
    },
    // *saveProject(params = {}, callback) {
    //   // 测试代码
    //   const res = yield saveProjectService(params);
    //   callback && callback(res);
    // },
  },
  reducers: {
    setCheckPageFLag(a) {
      this.checkPageFLag=a.key;
    },
    setApplicationList(res,flag) {
      if(flag){
        this.applicationList = res.data;
      }else{
        this.applicationList.list&& this.applicationList.list.push(...res.list);
      }
      // let tableData = toJS(this.applicationList.list);
      console.log('飞机',res);
      // this.applicationLength=tableData.length;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
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