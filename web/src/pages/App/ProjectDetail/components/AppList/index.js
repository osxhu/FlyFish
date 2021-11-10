import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Button, SearchBar } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import store from "../../model";

import List from '../NavigationList/index';
import { Icon, Select } from 'antd';
const { Option } = Select;
import Collapse from '@/components/collapse';
import Drawer from '@/components/Drawer';
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ ProgressId, checkPageFLag }) {
    const {
      openEditProjectModal,
    } = store;
    const intl = useIntl();
    const progressDetail = [{ id: 1, status: 1, title: '测试大屏33', development: '春卷', create: 'ewfefe' }, { id: 2, status: 2, title: '测试大屏44', development: 'jifwfeferf', create: '321321' }, { id: 3, status: 2, title: '测试大屏55', development: 'eweqweq', create: 'vrevevr' }];

    const onSearch = (e) => {
      console.log('applist父组件搜索触发', e);
    };
    const onSave = (e) => {
      console.log('applist父组件保存触发', e);
    };
    const onDelete = (id) => {
      console.log('applist父组件删除触发', id);
    };
    const onAdd = (id) => {
      console.log('applist父组件收藏触发', id);
    };
    // 传递给card底部的方法
    const AllMethod = {
      change: openEditProjectModal
    };

    const searchContent = [
      {
        components: (
          <Select mode="tags"
            id="name"
            key="name"
            name='行内'
            style={{ width: "170px" }}
            placeholder={
              intl.formatMessage({
                id: "common.pleaseSelect",
                defaultValue: "请选择",
              }) + "行业"
            }
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
            id="AppName"
            key="AppName"
            name='应用名称'
            style={{ width: "170px" }}
            placeholder={intl.formatMessage({
              id: "pages.applyDevelop.searchInputAppName",
              defaultValue: "输入应用名称进行查询",
            })}
          />
        ),
      },
      {
        components: (
          <Select mode="tags" id="ApplyLabel"
            key="ApplyLabel"
            name='应用标签' style={{ width: 170 }}
            placeholder={intl.formatMessage({
              id: "pages.applyDevelop.searchInputApplyLabel",
              defaultValue: "选择应用标签进行查询",
            })}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        ),
      },
    ];
    // collaose的内容配置 
    const collapseData = [
      {
        name: '北京项目test', //面板项目名称
        data: progressDetail,
        onSave: openEditProjectModal, //新建的回调
        showCardFotter: true,
        titleName: '应用'
      }, {
        searchContent, //搜索框配置  
        onSearch, //点击搜索的回调
        state: 1, //底部文字状态,1:应用模板  2:组件库
        data: progressDetail, //card数据
        showCardFotter: true,//是否显示card组件底部文字显示
        titleName: '模板'
      }
    ];
    return (
      <>
        {
          checkPageFLag === 'applyList' ? <div className={styles.appList}>
            应用类型选择：<Select
              id="name"
              key="name"
              style={{ width: "200px" }}
              select
              className={styles.select}
              placeholder={intl.formatMessage({
                id: "pages.applyDevelop.searchInputPlaceholder",
                defaultValue: "选择应用类型进行查询",
              })}
            />
            <Collapse collapseData={collapseData} AllMethod={AllMethod} >
              <>
                <div key="development" className={styles.mybtn}>开发应用</div>
                <div key="look" className={styles.mybtn}>预览应用</div>
                <div key="copy" className={styles.mybtn}>复制应用</div>
                <div key="export" className={styles.mybtn}>导出应用</div>
                <div key="change" className={styles.mybtn} >编辑信息</div>
                <div key="delete" className={styles.mybtn}>删除</div>
              </>
              <>
                <div key="look" className={styles.mybtn}>预览模板应用</div>
                <div key="export" className={styles.mybtn}>使用模板创建应用</div>
              </>
            </Collapse>
          </div> : null
        }
        {
          checkPageFLag === 'assemblyList' ? <List onSearch={onSearch} onSave={onSave} onDelete={onDelete} onAdd={onAdd} /> : null
        }
        {/* <Drawer/> */}
      </>

    );
  }
);
