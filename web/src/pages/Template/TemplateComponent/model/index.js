import { toMobx,toJS } from '@chaoswise/cw-mobx';
import { 
  getTreeDataService,
  getListDataService,
  assemblyDetail,
  getTagsService
} from '../services';

const model = {
  // 唯一命名空间
  namespace: "LibraryTemplate",
  // 状态
  state: {
    treeData:[],
    listData:{},
    selectedData:{
      category:'全部组件',
      subCategory:''
    },
    searchName:'',
    searchKey:'',
    searchStatus:'all',
    tagsData:[],
    isDrawerVisible:false,
    assemlyDetail:[]
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
    *getListData(listSearch){
      const { category,subCategory } = toJS(this.selectedData);
      if (category==='全部组件') {
        const params = {
          ...listSearch
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      }else{
        const params = {
          category:category,
          subCategory:subCategory,
          ...listSearch
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      }
    },
    *getAssemlyDetail(id,callback) {
      const res = yield assemblyDetail(id);
      this.isDrawerVisible=true;
     this.setAssemlyDetail(res);
    },
  },
  reducers: {
    setAssemlyDetail(res) {
      this.assemlyDetail = res.data;
    },
    setDrawerVisible(res){
      this.isDrawerVisible=res;
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
    setTagsData(res){
      this.tagsData = res;
    }
  }
};

export default toMobx(model);