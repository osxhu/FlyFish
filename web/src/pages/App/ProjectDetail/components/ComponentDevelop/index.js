/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:54:14
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { AbreastLayout, SearchBar, Icon } from "@chaoswise/ui";
import { Select, Input, Button, Modal, message, Collapse } from 'antd';
import { observer, toJS } from "@chaoswise/cw-mobx";
const { Panel } = Collapse;
import store from "./model/index";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import Detail from "./components/detail";
import _ from "lodash";
import Card from '@/components/TestCard';
import Drawer from '@/components/Drawer';
import InfiniteScroll from 'react-infinite-scroll-component';

const { Option } = Select;

const ComponentDevelop = observer(({ ProgressId }) => {
  const intl = useIntl();
  const {
    getLibraryListData,
    addModalvisible,
    setAddModalvisible,
    getIndustrysList,
    getTagsList,
    deleteAssembly,
    getTreeDataFirst,
    changeOneAssemly,
    getListData, setDrawerVisible,
    getAssemlyDetail,
    setSelectedData,setProjectId,
    setHasMore
  } = store;
  const {tagsList,hasMore, listLength, industryList, isDrawerVisible, assemlyDetail, libraryListData, listData, selectedData } = store;
  const [changeFlga, setchangeFlga] = useState(false); //编辑完成
  let [infinitKey, setInfinitKey] = useState(0);
  let [flagNum, setFlagNum] = useState(0);
  let [libraryFlagNum, setLibraryFlagNum] = useState(0);
  let [libraryParams, setLibraryParams] = useState({});
  //项目组件下滑
  const changePage = () => {
    setFlagNum(flagNum += 1);
    getListData({
      projectId: ProgressId,
      curPage: flagNum,
    });
  };
  // 公共组件下滑
  const libraryChangePage = () => {
    setLibraryFlagNum(libraryFlagNum += 1);
    setInfinitKey(Math.random().toString(36).substr(2),);
    getLibraryListData({
      curPage: libraryFlagNum,
      ...libraryParams
    });
  };
  // 表格列表数据
  let basicTableListData = toJS(listData);
  const [activeProject, setActiveProject] = useState(''); //编辑完成
  const searchContent = [
    {
      components: (
        <Select mode="tags"
          allowClear={true}
          id="trades"
          key="trades"
          name='行业'
          style={{ width: "170px" }}
          placeholder={
            intl.formatMessage({
              id: "common.pleaseSelect",
              defaultValue: "请选择",
            }) + "行业"
          }
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
          key="key"
          style={{ width: "200px" }}
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.projectDetailDevelop.searchInputKey",
            defaultValue: "输入组件名称/项目名称/描述/标签/创建人查找组件",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags"
          id="tags"
          allowClear={true}
          key="tag"
          name='标签'
          style={{ width: "170px" }}
          placeholder={
            intl.formatMessage({
              id: "common.pleaseSelect",
              defaultValue: "请选择",
            }) + "标签"
          }
        >
           {
            tagsList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)
          }
        </Select>
      ),
    },
  ];
  const addCateRef = useRef();
  const changeColumns = (values) => {
    setLibraryFlagNum(0);
    for (let i in values) {
      if (!values[i] || values[i].length === 0) {
        delete values[i];
      }
    }
    setLibraryParams(values);
    getLibraryListData(values, true);
  };
  // 请求列表数据
  useEffect(() => {
    setProjectId(ProgressId);
    getTreeDataFirst();
    getLibraryListData({}, true);
    getIndustrysList(); //行业
    getTagsList();
    setActiveProject(JSON.parse(sessionStorage.getItem('activeProject')).name);
  }, []);
  useEffect(() => {
    getListData();
  }, [selectedData]);
  return <>
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn
      SiderWidth={300}
      Siderbar={(
        <div className={styles.leftWrap}>
          <div className={styles.treeWrap}>
            <HandleMenu />
          </div>
        </div>
      )}
    >
      {/* 右侧面板 */}
      <div className={styles.container}>
        <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false} >
          <Panel header={
            <>
              <span>{activeProject}</span>
              <span className={styles.title}>共</span>
              <span>{listData&&listData.total}个应用</span>
            </>
          } key="1"
            extra={<Button onClick={(e) => {
              e.stopPropagation();
              setchangeFlga(!changeFlga);
            }} type="primary" >{changeFlga ? '完成' : '编辑'}</Button>
            }>
            <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
              <InfiniteScroll
                dataLength={listLength}
                next={changePage}
                hasMore={hasMore}
                scrollableTarget="scrollableDiv"
                key={infinitKey}
              >
                <Card
                  checkCard={(id) => {
                    getAssemlyDetail(id);
                  }}
                  onDelete={(params) => {
                    deleteAssembly(params, (res) => {
                      if (res.code === successCode) {
                        getListData({ projectId: ProgressId }, true);
                        message.success(
                          intl.formatMessage({
                            id: "common.deleteSuccess",
                            defaultValue: "删除成功！",
                          })
                        );
                      } else {
                        message.error(
                          res.msg || intl.formatMessage({
                            id: "common.deleteError",
                            defaultValue: "删除失败，请稍后重试！",
                          })
                        );
                      }
                    });
                  }}
                  value={basicTableListData}
                  state={1}
                  canDelete={changeFlga}
                ></Card>
              </InfiniteScroll>
            </div>


          </Panel>
          <Panel header={<>  <span>从组件库中选择项目组件 </span> <span className={styles.rightTitle}>*下方列表中展示的是项目组件，不包括基础组件</span></>} key="2">
            <SearchBar
              onSearch={changeColumns}
              searchContent={searchContent} showSearchCount={6}
            />
            <div id="scrollableDivTwo" style={{ height: '470px', overflow: 'auto' }} >
              <Card
                checkCard={(id) => {
                  getAssemlyDetail(id);
                }}
                value={libraryListData}
                state={1}
                canAdd={true}
                addOwn={(id, item) => {
                  console.log('的户外',item,ProgressId);
                  let result = item.filter(item => item === ProgressId);
                  if (result.length > 0) {
                    message.error('该组件已归属该项目');
                    return;
                  }
                  changeOneAssemly(id, { projects: [ProgressId] }, (res) => {
                    if (res.code === successCode) {
                      message.success(
                        intl.formatMessage({
                          id: "common.addSuccess",
                          defaultValue: "新增成功！",
                        })
                      );
                      setHasMore(true);
                      getListData({ projectId: ProgressId }, true);
                      getLibraryListData({ isLib: true }, true);
                    } else {
                      message.error(
                        res.msg || intl.formatMessage({
                          id: "common.addError",
                          defaultValue: "新增失败，请稍后重试！",
                        })
                      );
                    }
                  });
                }}
              >
              </Card>
            
            </div>


          </Panel>
        </Collapse>
      </div>
      <Modal
        title="添加组件"
        visible={addModalvisible}
        footer={null}
        width='50%'
        onCancel={() => { setAddModalvisible(false); }}
      >
        <AddComponent />
      </Modal>
      <Detail />
    </AbreastLayout>
    {
      isDrawerVisible ? <Drawer assemly={assemlyDetail} setDrawerVisible={setDrawerVisible} /> : null
    }
  </>;
});
export default ComponentDevelop;
