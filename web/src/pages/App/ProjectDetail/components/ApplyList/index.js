import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Button, SearchBar, Collapse } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import store from "../../model";
import Card from '@/components/TestCard';
import { Icon, Select } from 'antd';
const { Option } = Select;
const { Panel } = Collapse;
import InfiniteScroll from 'react-infinite-scroll-component';

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ ProgressId }) {
    let [flagNum, setFlagNum] = useState(0);
    let [infinitKey, setInfinitKey] = useState(0);

    const {
      getApplicationList,
    } = store;

    const {
      applicationLength,
      applicationList,
    } = store;
    const intl = useIntl();
    //项目组件下滑
    const changePage = () => {
      setFlagNum(flagNum += 1);
      getApplicationList({
        projectId: ProgressId,
        curPage: flagNum,
      });
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
    // 请求列表数据
    useEffect(() => {
      getApplicationList({ projectId: ProgressId });
    }, []);
    return (
      <div className={styles.appList}>
        <div className={styles.title}>
          <span >应用类型选择：</span>
          <Select
            id="name"
            key="name"
            defaultValue='2D'
            style={{ width: "200px" }}
            select
            className={styles.select}
            placeholder={intl.formatMessage({
              id: "pages.applyDevelop.searchInputPlaceholder",
              defaultValue: "选择应用类型进行查询",
            })}
          >
            <Option value="2D" >2D大屏应用</Option>
            <Option value="3D">3D大屏应用</Option>
          </Select>
        </div>
        <Collapse defaultActiveKey={['1', '2']} ghost={true} bordered={false} >
          <Panel header={
            <>
              <span>11</span>
              <span className={styles.title}>共</span>
              <span>12个应用</span>
            </>
          } key="1"
            extra={<Button onClick={(e) => {
              e.stopPropagation();
              // setchangeFlga(!changeFlga);
            }} type="primary" >完成</Button>
            }>
            <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
              <InfiniteScroll
                dataLength={applicationLength}
                next={changePage}
                hasMore={true}
                scrollableTarget="scrollableDiv"
                key={infinitKey}
              >
                <Card
                 
                  value={applicationList}
                  state={1}
                ></Card>
              </InfiniteScroll>
            </div>


          </Panel>
          <Panel header='从应用模板库中选择' key="2">
            <SearchBar
              // onSearch={changeColumns}
              searchContent={searchContent} showSearchCount={6}
            />
            <div id="scrollableDivTwo" style={{ height: '470px', overflow: 'auto' }} >

            </div>


          </Panel>
        </Collapse>
      </div>

    );
  }
);
