/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-10 19:08:41
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-11 17:53:42
 */
import { toMobx } from '@chaoswise/cw-mobx';
import { getTreeDataService } from '../services';

const model = {
  // 唯一命名空间
  namespace: "ComponentDevelop",
  // 状态
  state: {
    detailShow:false,
    addModalvisible:false,
    treeData:null
  },
  effects: {
    *getTreeData() {
      // 请求数据
      const res = yield getTreeDataService();
      this.setTreeData(res.data[0].categories);
    },
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
    }
  }
};

export default toMobx(model);