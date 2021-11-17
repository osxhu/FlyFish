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
    deleteAssembly,
    getTreeData,
    changeOneAssemly,
    getListData, setDrawerVisible,
    getAssemlyDetail,
    setSelectedData
  } = store;
  const {libraryListLength, listLength, industryList, isDrawerVisible, assemlyDetail, libraryListData, listData, selectedData } = store;
  const [changeFlga, setchangeFlga] = useState(false); //编辑完成
  let [infinitKey, setInfinitKey] = useState(0);
  let [flagNum, setFlagNum] = useState(0);
  let [libraryFlagNum, setLibraryFlagNum] = useState(0);
  let [libraryParams,setLibraryParams]=useState({});
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
          id="tag"
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
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="Yiminghe">yiminghe</Option>
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
    getLibraryListData(values,true);
  };
  // 请求列表数据
  useEffect(() => {
    getTreeData();
    getLibraryListData({},true);
    getIndustrysList();
    setActiveProject(JSON.parse(sessionStorage.getItem('activeProject')).name);
  }, []);
  useEffect(() => {
    setFlagNum(0);
    getListData({ projectId: ProgressId }, true);
  }, [selectedData]);
  return <>
    <AbreastLayout
      type='leftOperationArea'
      showCollapsedBtn
      SiderWidth={300}
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
              }
            }
          >全部组件</div>
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
              <span>{basicTableListData.total}个应用</span>
            </>
          } key="1"
            extra={<Button onClick={(e) => {
              e.stopPropagation();
              setchangeFlga(!changeFlga);
            }} type="primary" >编辑</Button>
            }>
            <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
              <InfiniteScroll
                dataLength={listLength}
                next={changePage}
                hasMore={true}
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
                        getListData(ProgressId);
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
                  deleteFlagMethod={setchangeFlga}
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
              <InfiniteScroll
                dataLength={libraryListLength}
                next={libraryChangePage}
                hasMore={true}
                scrollableTarget="scrollableDivTwo"
                key={infinitKey}
              >
                <Card
                  checkCard={(id) => {
                    getAssemlyDetail(id);
                  }}
                  value={libraryListData}
                  state={1}
                  canAdd={true}
                  addOwn={(id, item) => {
                    let result = item.filter(item => item === ProgressId);
                    if (result.length > 0) {
                      message.error('该组件已归属该项目');
                      return;
                    }
                    changeOneAssemly(id, { projects: [ProgressId, ...item] }, (res) => {
                      if (res.code === successCode) {
                        getListData(ProgressId);
                        message.success(
                          intl.formatMessage({
                            id: "common.addSuccess",
                            defaultValue: "新增成功！",
                          })
                        );
                        getLibraryListData();
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
              </InfiniteScroll>
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
