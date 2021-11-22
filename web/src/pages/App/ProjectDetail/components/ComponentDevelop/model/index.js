/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:31:23
 */
import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
  getTreeDataService,
  industryList,
  assemblyDetail,
  changeAssembly,
  getUserInfoService,
  getListDataService,
  getTagsService,
  deleteOneAssembly
} from '../services';
import { message } from 'antd';
import { successCode } from "@/config/global";

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelop",
  // 状态
  state: {
    detailShow: false,
    addModalvisible: false,
    treeData: null,
    listData: {},
    userInfo: {},

    libraryListData: {},
    selectedData: {
      category: '',
      subCategory: ''
    },
    searchName: '',
    searchKey: '',
    searchStatus: 'all',
    projectId: '',
    total: 0,
    curPage: 1,
    pageSize: 20,
    hasMore: true,
    tagsList: [],
    industryList: [],//行业列表
    assemlyDetail: [],//组件详情
    isDrawerVisible: false,
    listLength: 0,
    libraryListLength: 0
  },
  effects: {
    *getUserInfo() {
      const id = localStorage.getItem('id');
      const res = yield getUserInfoService({ id });
      if (res && res.data) {
        this.setUserInfo(res.data);
      }
    },
    *getTreeDataFirst() {
      const res = yield getTreeDataService();
      if (res && res.data) {
        const data = res.data[0].categories;
        this.setTreeData(data);
        const first = toJS(data)[0];
        if (first) {
          this.setSelectedData({
            category: first.id,
            subCategory: ''
          });
        }
      }
    },
    *getListData(obj, state) {
      let curPage = this.curPage - 1;
      const pageSize = this.pageSize;
      const { category, subCategory } = toJS(this.selectedData);
      const searchName = this.searchName;
      const searchKey = this.searchKey;
      const searchStatus = this.searchStatus;
      const params = {
        projectId: this.projectId,
        name: searchName ? searchName : undefined,
        key: searchKey ? searchKey : undefined,
        developStatus: searchStatus !== 'all' ? searchStatus : undefined,
        category: category,
        subCategory: subCategory === '' ? undefined : subCategory,
        curPage: curPage,
        pageSize
      };
      const res = yield getListDataService(params);
      this.setListData(res.data);
    },
    // 组件库列表数据
    *getLibraryListData(options, state) {
      const params = {
        isLib: true,
        pageSize: 20,
        ...options
      };
      const res = yield getListDataService(params);
      this.setLibraryListData(res.data, state);
    },
    *deleteAssembly(params = {}, callback) {
      // 请求数据
      const res = yield deleteOneAssembly(params);
      callback && callback(res);
    },
    // 标签列表
    *getTagsList() {
      const res = yield getTagsService({ type: 'component' });
      this.setTagsList(res);
    },
    // 行业列表
    *getIndustrysList() {
      const res = yield industryList();
      this.setIndustryList(res);
    },
    // 修改组件归属
    *changeOneAssemly(id, params, callback) {
      const res = yield changeAssembly(id, params);
      callback && callback(res);
    },
    *getAssemlyDetail(id, callback) {
      const res = yield assemblyDetail(id);
      this.isDrawerVisible = true;
      this.setAssemlyDetail(res);
    },
  },
  reducers: {
    setTagsList(res) {
      this.tagsList = res.data;
    },
    setProjectId(id) {
      this.projectId = id;
    },
    setUserInfo(res) {
      this.userInfo = res;
    },
    setDrawerVisible(res) {
      this.isDrawerVisible = res;
    },
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setIndustryList(res) {
      this.industryList = res.data.list;
    },
    setLibraryListData(res, state) {
      if (state) {
        this.libraryListData = res;
      } else {
        this.libraryListData.list && this.libraryListData.list.push(...res.list);
      }
      let libraryListData = toJS(this.libraryListData.list);
      this.libraryListLength = libraryListData.length;
      if(this.libraryListLength>=res.total){
        this.hasMore=false;
      }
    },
    setDetailShow(res) {
      this.detailShow = res;
    },
    setAddModalvisible(res) {
      this.addModalvisible = res;
    },
    setTreeData(res) {
      this.treeData = res;
    },
    setListData(res) {
      this.listData = res;
      this.total = res && res.total;
    },
    setCurPage(res) {
      this.curPage = res;
    },
    setHasMore(flag) {
      this.hasMore = flag;
    },
    setSelectedData(res) {
      this.selectedData = res;
    }
  }
};

export default toMobx(model);