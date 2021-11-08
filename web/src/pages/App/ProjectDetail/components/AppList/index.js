import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Button, Collapse, SearchBar } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import List from '../NavigationList/index';
import Card from '@/components/Card';
import { Icon, Select } from 'antd';
const { Option } = Select;
const { Panel } = Collapse;
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ ProgressId,checkPageFLag, onSave }) {
    const intl = useIntl();
    const progressDetail = {
      name: "北京项目A",
      apply: [{ status: 1, title: '测试大屏33', development: '春卷', create: 'ewfefe' }, { status: 2, title: '测试大屏44', development: 'jifwfeferf', create: '321321' }, { status: 2, title: '测试大屏55', development: 'eweqweq', create: 'vrevevr' }]
    };
    const onSearch=(e)=>{
      console.log('下面搜索框',e);
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
    return (
      <>
       {
        checkPageFLag==='applyList'? <div className={styles.appList}>
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
          <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false}>
            <Panel className='usePanel' header={
              <>
                <span>{progressDetail.name}</span>
                <span className={styles.title}>共</span>
                <span>{progressDetail.apply.length}个应用</span>

              </>
            } extra={
              <Button onClick={(e) => {
                e.stopPropagation();
                onSave && onSave();
              }} type="primary" >添加应用</Button>
            }
              key="1">
              <Card value={progressDetail.apply} showFotter={true}/>
            </Panel>
            <Panel header="从应用模板中选择" key="2" >
              <SearchBar
                searchContent={searchContent} showSearchCount={6}
                onSearch={onSearch}
              />
               <Card value={progressDetail.apply} state={1} showFotter={true} />
            </Panel>
          </Collapse>
        </div>:null
       }
       {
         checkPageFLag==='assemblyList'? <List/>:null
       }
      </>

    );
  }
);
