/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { message, SearchBar, Pagination, Input, Icon } from "@chaoswise/ui";
import {
  observer
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { useIntl } from "react-intl";
import { Select } from 'antd';
const { Option } = Select;

const ApplyDevelop = observer(() => {
  const intl = useIntl();

  const {
    getApplicationList,
    setSearchParams,
    openCopyApplyModal,
    setOptions,
    setType,
    getTradesList,
    getTagsList
  } = store;
  const { tradesList, searchOptions, tagsList, applicationList, type, total, curPage, pageSize, } =
    store;
  const searchContent = [
    {
      components: (
        <Select
          id="trades"
          key="trades"
          name='行业'
          showSearch
          mode="multiple"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          allowClear
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
        >
          {
            tradesList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
    {
      components: (

        <Input
          id="name"
          key="name"
          allowClear
          name='应用名称'
          suffix={<Icon type="search" />
          }
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.applyName",
            defaultValue: "选择应用名称进行查询",
          })}
        />
      ),
    },
    {
      components: (
        <Select id="tags"
          key="tags"
          showSearch
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          mode="multiple"
          allowClear
          name='应用标签' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.searchInputApplyLabel",
            defaultValue: "选择应用标签进行查询",
          })}
        >
          {
            tagsList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
  ];
  const handleChange = (value) => {
    setType(value);
    getApplicationList();
  };
  const changeColumns = (values) => {
    for (let i in values) {
      if (!values[i] || values[i].length === 0) {
        delete values[i];
      }
    }
    setOptions(values);
  };
  // 请求列表数据
  useEffect(() => {
    getTagsList();
    getTradesList({});
  }, []);
  useEffect(() => {
    getApplicationList();
  }, [searchOptions]);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getApplicationList({ curPage, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getApplicationList({
      curPage: 0,
    });
  };
  return (
    <React.Fragment>
      <div className={styles.searchCotainer1}>
        应用类型选择：<Select
          onChange={handleChange}
          id="name"
          key="name"
          defaultValue={type || '2D'}
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "选择应用类型进行查询",
          })}
        >
          <Option value="2D" >2D大屏应用</Option>
          <Option value="3D">3D大屏应用</Option>
        </Select>
      </div>
      <SearchBar
        searchContent={searchContent} showSearchCount={6}
        onSearch={changeColumns}
      />
      {
        <TsetCard value={applicationList} state={1}
          actions={(item) => {
            return (
              <>
                <div key="change" className={styles.mybtn} >预览模板应用</div>
                <div key="delete" className={styles.mybtn} onClick={() => { openCopyApplyModal(); }}>  使用模板创建应用</div>
              </>
            );
          }}
        >

        </TsetCard>
      }
      {/* {

applicationList.list.length > 0 ? <Pagination current={curPage + 1} pageSize={pageSize} total={total} showQuickJumper={true} onChange={(current) => {
          getApplicationList({ curPage: current - 1 });
        }} /> : null
      } */}
    </React.Fragment>
  );
});
export default ApplyDevelop;
