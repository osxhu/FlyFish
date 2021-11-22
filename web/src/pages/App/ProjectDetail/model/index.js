import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { reqApplicationList ,industryList} from "../services";
import _ from "lodash";

const model = {
  // 唯一命名空间
  namespace: "ProjectDetail",
  // 状态
  state: {
    checkPageFLag: 'applyList',
    searchParams: {},
    projectId:'',
    applicationList: {}, //应用列表
    templateapplicationList: {},
    applicationLength: 0,
    templateapplicationLength: 0,
    type: '',
    total: 0,
    curPage: 0,
    pageSize: 15,
    hasMore: true,
    templatehasMore: true,
    activeProject: {},
    industryList:[],
    activeTemplate: {},
    isAddModalVisible: false,
  },
  effects: {
    // 获取项目列表数据
    *getApplicationList(params = {}, flag) {
      // 处理参数
      let options = {
        projectId:this.projectId,
        type: this.type || '2D',
        curPage: this.curPage,
        pageSize: this.pageSize,
        ...params,
      };
      // 请求数据
      const res = yield reqApplicationList(options);
      this.setApplicationList(res);
    },
    // 获取项目模板列表数据
    *getTemplateApplicationList(flag) {
      let options = {
        type: this.type || '2D',
        curPage: this.curPage,
        pageSize: this.pageSize,
        isLib: true
      };
      // 请求数据
      const res = yield reqApplicationList(options);
      this.setTemplateApplicationList(res, flag);
    },
    // 行业列表
    *getIndustrysList() {
      const res = yield industryList();
      this.setIndustryList(res);
    },
  },
  reducers: {
    setIndustryList(res) {
      this.industryList = res.data.list;
    },
    setProjectId(id){
      this.projectId=id;
    },
    setActiveProject(item) {
      if (item) {
        this.activeProject = {
          ...item,
          projects: item.projects.id,
          tags: item.tags.map(item => item.name)
        };
      } else {
        this.activeProject = {};
      }
    },
    setTemplateActiveProject(item) {
      if (item) {
        this.activeTemplate = {
          ...item,
          projects: item.projects.id,
          tags: item.tags.map(item => item.name)
        };
      } else {
        this.activeTemplate = {};
      }
    },
    setType(type) {
      this.type = type;
    },
    setCheckPageFLag(a) {
      this.checkPageFLag = a.key;
    },
    setTemplateApplicationList(res, flag) {
      if (flag) {
        this.templateapplicationList = res.data;
      } else {
        this.templateapplicationList.list && this.templateapplicationList.list.push(...res.data.list);
      }
      let tableData = toJS(this.templateapplicationList.list);
      this.templateapplicationLength = tableData.length;
      if (tableData.length >= res.data.total) {
        this.templatehasMore = false;
      }
    },
    setApplicationList(res,) {
      this.applicationList = res.data;
      this.total = res.data.total;
      this.curPage = res.data.curPage;
      this.pageSize = res.data.pageSize;
    },
    setSearchParams(searchParams) {
      this.searchParams = searchParams || {};
    },
    openAddProjectModal(project) {
      this.activeProject = _.clone(project);
      this.isAddModalVisible = true;
    },
    closeAppProjectModal() {
      this.isAddModalVisible = false;
    },
    openProjectPage(project) {
      this.activeProject = _.clone(project);
    },
  },
};

export default toMobx(model);