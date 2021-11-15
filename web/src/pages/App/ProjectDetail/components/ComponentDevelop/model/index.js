/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:31:23
 */
import { toMobx, toJS } from '@chaoswise/cw-mobx';
import { getTreeDataService, industryList,assemblyDetail,changeAssembly, getListDataService, deleteOneAssembly } from '../services';
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
    libraryListData: {},
    selectedData: {
      category: '全部组件',
      subCategory: ''
    },
    industryList: [],//行业列表
    assemlyDetail:[],//组件详情
    isDrawerVisible:false
  },
  effects: {
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data[0].categories);
    },
    *getListData(id) {
      const { category, subCategory } = toJS(this.selectedData);
      if (category === '全部组件') {
        const params = {
          projectId: id
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      } else {
        const params = {
          category: category,
          projectId: id,
          subCategory: subCategory
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      }
    },
    // 组件库列表数据
    *getLibraryListData( options) {
      const params = {
        isLib: true,
        ...options
      };
      // 请求数据
      const res = yield getListDataService(params);
      if (res.code ===successCode) {
        this.setLibraryListData(res.data);
      } 

    },
    *deleteAssembly(params = {}, callback) {
      // 请求数据
      const res = yield deleteOneAssembly(params);
      callback && callback(res);
    },
    // 行业列表
    *getIndustrysList() {
      const res = yield industryList();
      this.setIndustryList(res);
    },
    // 修改组件归属
    *changeOneAssemly(id,params,callback) {
      const res = yield changeAssembly(id,params);
      callback && callback(res);
    },
    *getAssemlyDetail(id,callback) {
      const res = yield assemblyDetail(id);
      this.isDrawerVisible=true;
     this.setAssemlyDetail(res);
    },
  },
  reducers: {
    setDrawerVisible(res){
      this.isDrawerVisible=res;
    },
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setIndustryList(res) {
      this.industryList = res.data.list;
    },
    setLibraryListData(res) {
      this.libraryListData = res;
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
    },
    setSelectedData(res) {
      this.selectedData = res;
    }
  }
};

export default toMobx(model);