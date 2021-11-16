/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-16 10:12:06
 */
import { toMobx,toJS } from '@chaoswise/cw-mobx';
import { 
  getTreeDataService,
  getListDataService,
  getUserInfoService,
  getProjectsService,
  getTagsService
} from '../services';

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelop",
  // 状态
  state: {
    userInfo:{},
    detailShow:false,
    addModalvisible:false,
    editModalvisible:false,
    importModalvisible:false,
    treeData:[],
    listData:{},
    selectedData:{
      category:'全部组件',
      subCategory:''
    },
    searchName:'',
    searchKey:'',
    searchStatus:'all',
    viewId:'',
    editData:{},
    projectsData:[],
    tagsData:[],
    developing:false,
    developingData:null,
    total:0,
    curPage:1,
    pageSize:10
  },
  effects: {
    *getUserInfo() {
      const id = localStorage.getItem('id');
      const res = yield getUserInfoService({id});
      if (res && res.data) {
        this.setUserInfo(res.data);
      }
    },
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data[0].categories);
    },
    *getProjectsData() {
      const res = yield getProjectsService();
      if (res && res.data) {
        this.setProjectsData(res.data.list);
      }
    },
    *getTagsData() {
      const res = yield getTagsService();
      if (res && res.data) {
        this.setTagsData(res.data);
      }
    },
    *getListData(){
      const { category,subCategory } = toJS(this.selectedData);
      let curPage = this.curPage-1;
      const pageSize = this.pageSize;
      if (category==='全部组件') {
        const res = yield getListDataService({ curPage,pageSize });
        this.setListData(res.data);
      }else{
        const params = {
          category:category,
          subCategory:subCategory,
          curPage:curPage-1,
          pageSize
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      }
    },
    *getListDataWithCate(){
      let curPage = this.curPage;
      const pageSize = this.pageSize;
      const { category,subCategory } = toJS(this.selectedData);
      const searchName = this.searchName;
      const searchKey = this.searchKey;
      const searchStatus = this.searchStatus;
      const params = {
        name:searchName?searchName:undefined,
        key:searchKey?searchKey:undefined,
        developStatus:searchStatus!=='all'?searchStatus:undefined,

        category:category==='全部组件'?undefined:category,
        subCategory:category==='全部组件'?undefined:subCategory,
        curPage:curPage-1,
        pageSize
      };
      const res = yield getListDataService(params);
      this.setListData(res.data);
    }
  },
  reducers: {
    setUserInfo(res){
      this.userInfo = res;
    },
    setDetailShow(res){
      this.detailShow = res;
    },
    setAddModalvisible(res){
      this.addModalvisible = res;
    },
    setEditModalvisible(res){
      this.editModalvisible = res;
    },
    setImportModalvisible(res){
      this.importModalvisible = res;
    },
    setTreeData(res){
      this.treeData = res;
    },
    setListData(res){
      this.listData = res;
    },
    setSelectedData(res){
      this.selectedData = res;
    },
    setSearchName(res){
      this.searchName = res;
    },
    setSearchKey(res){
      this.searchKey = res;
    },
    setSearchStatus(res){
      this.searchStatus = res;
    },
    setViewId(res){
      this.viewId = res;
    },
    setEditData(res){
      this.editData = res;
    },
    setProjectsData(res){
      this.projectsData = res;
    },
    setTagsData(res){
      this.tagsData = res;
    },
    setDeveloping(res){
      this.developing = res;
    },
    setDevelopingData(res){
      this.developingData = res;
    },
    setTotal(res){
      this.total = res;
    },
    setPageSize(res){
      this.pageSize = res;
    },
    setCurPage(res){
      this.curPage = res;
    }
  }
};

export default toMobx(model);