/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-15 18:51:15
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { SearchBar, AbreastLayout } from "@chaoswise/ui";
import { Icon, Select, Input, Table, Popover, Button, Modal, Row, Col, message, Popconfirm, Upload } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import styles from "./assets/style.less";
import HandleMenu from "./components/handleMenu";
import Detail from "./components/detail";
import _ from "lodash";
import { useIntl } from "react-intl";
import Card from '@/components/TestCard';
import { updateTreeDataService, copyComponentService, deleteComponentService, downloadComponentService } from './services';


const { Option } = Select;

const ComponentDevelop = observer(() => {
  const intl = useIntl();

  const {
    getTreeData,
    getListData,
    setSelectedData,
    setSearchName,
    setSearchKey,
    setSearchStatus,
    setDrawerVisible,
    getTagsData
  } = store;
  const { isDrawerVisible,selectedData, listData } = store;
  const onSearch = (params) => {
    for (const i in params) {
      if (!params[i]) {
        delete params[i];
      }
    }
    getListData(params);
  };
  const searchContent = [
    {
      components: (
        <Select
          id="trade"
          key="trade"
          mode='tags'
          name='行业'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    },
    {
      components: (

        <Input
          id="name"
          key="name"
          style={{ width: "300px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.name",
            defaultValue: "输入组件名称/组件编号/描述/标签/查找组件",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags" id="ApplyLabel"
          key="ApplyLabel"
          name='标签' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchInputApplyLabel",
            defaultValue: "选择应用标签进行查询",
          })}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    },
    {
      components: (
        <Select id="type"
          key="type"
          name='组件类别' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchtype",
            defaultValue: "选择组件类别进行查询",
          })}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
        </Select>
      ),
    }
  ];
  // 请求列表数据
  useEffect(() => {
    getTagsData();
    getTreeData();
  }, []);
  useEffect(() => {
    getListData();
  }, [selectedData]);
  return <div className={styles.templateComponent}>
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn

      SiderWidth={200}
      Siderbar={(
        <div className={styles.leftWrap}>
          <div className={styles.leftBigTitle}>
            <span style={{ marginLeft: 10 }}>组件列表</span>
          </div>
          <div className={styles.allBtn + ' ' + (selectedData.category === '全部组件' ? styles.selected : '')}
            onClick={
              () => {
                setSelectedData({
                  category: '全部组件',
                  subCategory: ''
                });
                setSearchName('');
                setSearchKey('');
                setSearchStatus('');
              }
            }
          >全部组件</div>
          <div className={styles.treeWrap}>
            <HandleMenu />
          </div>
        </div>
      )}
    ><Detail />
      <SearchBar
        searchContent={searchContent} showSearchCount={6} onSearch={onSearch}
      />
      <Card value={listData} state={1} />
    </AbreastLayout>
  </div>;
});
export default ComponentDevelop;
