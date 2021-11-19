
import React, { useState, useEffect } from "react";
import { SearchBar, AbreastLayout ,Icon} from "@chaoswise/ui";
import { Select, Input } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import styles from "./assets/style.less";
import HandleMenu from "./components/handleMenu";
import Detail from "./components/detail";
import _ from "lodash";
import { useIntl } from "react-intl";
import Drawer from '@/components/Drawer';

import Card from '@/components/TestCard';
import InfiniteScroll from 'react-infinite-scroll-component';



const { Option } = Select;

const ComponentDevelop = observer(() => {
  const intl = useIntl();
  let [flagNum, setFlagNum] = useState(0);
  let [infinitKey, setInfinitKey] = useState(0);
  let [searchParams, setSearchParams] = useState({});
  const {
    getTreeData,
    getListData,
    setSelectedData,
    setSearchName,
    setSearchKey,
    setSearchStatus,
    setDrawerVisible,
    getIndustrysList,
    getTagsData,
    getAssemlyDetail
  } = store;
  const { isDrawerVisible, assemlyDetail, industryList, selectedData, listLength, listData } = store;

  const onSearch = (params) => {
    for (const i in params) {
      if (!params[i] || params[i].length === 0) {
        delete params[i];
      }
    }
    setSearchParams(params);
    setFlagNum(0);
    getListData(params, true);
  };
  let cardDate = toJS(listData);
  const changePage = () => {
    setFlagNum(flagNum += 1);
    getListData({
      curPage: flagNum,
      ...searchParams
    });
  };
  const searchContent = [
    {
      components: (
        <Select
          id="trades"
          key="trades"
          mode='tags'
          name='行业'
          allowClear={true}
          optionFilterProp="children"
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
        >
          {
            industryList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
    {
      components: (

        <Input
          id="key"
          allowClear={true}
          key="key"
          style={{ width: "300px" }}
          suffix	={<Icon type="search" />
        }
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
          allowClear={true}
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
          <Option value="">全部</Option>
          <Option value="common">基础组件</Option>
          <Option value="project">项目组件</Option>
        </Select>
      ),
    }
  ];
  // 请求列表数据
  useEffect(() => {
    getTagsData();
    getTreeData();
    getIndustrysList();
  }, []);
  useEffect(() => {
    getListData({}, true);
    setFlagNum(0);
    setInfinitKey(Math.random().toString(36).substr(2));
  }, [selectedData]);
  return <div className={styles.templateComponent}>
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn
      SiderWidth={200}
      Siderbar={(
          <div className={styles.treeWrap}>
            <HandleMenu />
          </div>
      )}
    ><Detail />
      <SearchBar
        searchContent={searchContent} showSearchCount={6} onSearch={onSearch}
      />
      {/* 更改二级菜单覆盖否则push数据。页码一致会导致识别不了更新，随机key值 */}
      <div id="scrollableDiv" style={{ height: '490px', overflow: 'auto' }} >
        <InfiniteScroll
          dataLength={listLength}
          next={changePage}
          hasMore={true}
          scrollableTarget="scrollableDiv"
          key={infinitKey}
        >
          <Card value={cardDate} checkCard={(id) => {
            getAssemlyDetail(id);
          }} state={1} />
        </InfiniteScroll>
      </div>
    </AbreastLayout>
    {
      isDrawerVisible ? <Drawer assemly={assemlyDetail} setDrawerVisible={setDrawerVisible} /> : null
    }
  </div>;
});
export default ComponentDevelop;
