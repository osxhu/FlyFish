/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { observer, toJS } from '@chaoswise/cw-mobx';
import { Input, Icon, Tree,BasicLayout } from '@chaoswise/ui';
import store from '../model/index';
import styles from './index.less';
const { Search } = Input;

const NavigationTree = observer(() => {
  /** 
   * getNavigationTree 获取列表数据方法
   * onClickSelect     点击树节点触发的方法
   * treeData          树形结构数据
   * departmentKey     树节点标识
  */
  const { getNavigationTree, onClickSelect } = store;
  const { departmentKey, treeData } = store;
  let navigationTreeData = toJS(treeData);
  const [searchValue, setSearchValue] = useState();
  // 请求数据
  useEffect(() => {
    getNavigationTree();
  }, []);
  // 点击搜索后的节点处理
  const onSelectSearchMenu = ({ selectedKeys }) => {
    onClickSelect(selectedKeys);
  };
  // 点击树节点触发的方法
  const onSelect = (departmentKey) => {
    onClickSelect(departmentKey);
  };
  return (
    <div style={{ padding: '12px 10px' }} className={styles.treeCotainer}>
      <div className={styles.title}>
        组件列表
      </div>
      <div style={{ height: 'calc(100% - 32px)', overflow: 'auto' }}>
        <Tree
          multiple={true}
          switcherIcon={<Icon type="down" />}
          onSelectSearchMenu={onSelectSearchMenu}
          treeData={navigationTreeData}
          extendType='menu'
          selectedKeys={[departmentKey]}
        />
      </div>

    </div>
  );
});
export default NavigationTree;