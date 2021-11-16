import { toMobx, toJS } from '@chaoswise/cw-mobx';
import {
  getTreeDataService,
  getListDataService,
  assemblyDetail,
  getTagsService,
  industryList
} from '../services';

const model = {
  // 唯一命名空间
  namespace: "LibraryTemplate",
  // 状态
  state: {
    treeData: [],
    listData: {},
    selectedData: {
      isLib:true,
      category: '全部组件',
      subCategory: ''
    },
    searchName: '',
    searchKey: '',
    searchStatus: 'all',
    tagsData: [],
    industryList:[],
    isDrawerVisible: false,
    assemlyDetail: [], listLength: 0

  },
  effects: {
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data[0].categories);
    },
    *getTagsData() {
      const res = yield getTagsService();
      if (res && res.data) {
        this.setTagsData(res.data);
      }
    },
    *getListData(listSearch, state) {
      const { category, subCategory } = toJS(this.selectedData);
      if (category === '全部组件') {
        const params = {
          ...listSearch,
          isLib:true,
        };
        const res = yield getListDataService(params);
        this.setListData(res.data, state);
      } else {
        const params = {
          category: category,
          subCategory: subCategory,
          isLib:true,
          ...listSearch
        };
        const res = yield getListDataService(params);
        this.setListData(res.data, state);
      }
    },
    *getAssemlyDetail(id, callback) {
      const res = yield assemblyDetail(id);
      this.isDrawerVisible = true;
      this.setAssemlyDetail(res);
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
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setDrawerVisible(res) {
      this.isDrawerVisible = res;
    },
    setTreeData(res) {
      this.treeData = res;
    },
    setListData(res, state) {
      if (state) {
        this.listData = res;
      } else {
        this.listData.list&&this.listData.list.push(...res.list);
      }
      
      let tableData = toJS(this.listData.list);
      this.listLength = tableData.length;
    },
    setSelectedData(res) {
      this.selectedData = res;
    },
    setSearchName(res) {
      this.searchName = res;
    },
    setSearchKey(res) {
      this.searchKey = res;
    },
    setSearchStatus(res) {
      this.searchStatus = res;
    },
    setTagsData(res) {
      this.tagsData = res;
    }
  }
};

export default toMobx(model);