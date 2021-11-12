/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:31:23
 */
import { toMobx,toJS } from '@chaoswise/cw-mobx';
import { getTreeDataService,getListDataService } from '../services';

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelop",
  // 状态
  state: {
    detailShow:false,
    addModalvisible:false,
    treeData:null,
    listData:{},
    selectedData:{
      category:'全部组件',
      subCategory:''
    }
  },
  effects: {
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data[0].categories);
    },
    *getListData(){
      const { category,subCategory } = toJS(this.selectedData);
      if (category==='全部组件') {
        const res = yield getListDataService();
        this.setListData(res.data);
      }else{
        const params = {
          category:category,
          subCategory:subCategory
        };
        const res = yield getListDataService(params);
        this.setListData(res.data);
      }
    }
  },
  reducers: {
    setDetailShow(res){
      this.detailShow = res;
    },
    setAddModalvisible(res){
      this.addModalvisible = res;
    },
    setTreeData(res){
      this.treeData = res;
    },
    setListData(res){
      this.listData = res;
    },
    setSelectedData(res){
      this.selectedData = res;
    }
  }
};

export default toMobx(model);