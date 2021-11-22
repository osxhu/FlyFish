import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Button, SearchBar, Collapse, message, Popconfirm, Pagination } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import styles from "./index.less";
import store from "../../model";
import reqStore from '@/pages/App/ApplyDevelop/model';
import Card from '@/components/TestCard';
import { Icon, Select } from 'antd';
const { Option } = Select;
const { Panel } = Collapse;
import { successCode } from "@/config/global";

import InfiniteScroll from 'react-infinite-scroll-component';
import ApplyModal from '@/pages/App/ApplyDevelop/components/AddProjectModal';
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ templateapplicationList, industryList, curPage, pageSize, ProgressId, total, hasMore, applicationList, activeProject, type, isAddModalVisible, applicationLength }) {
    let [checkFlag, setCheckFlag] = useState(null);
    let [projectName, setProjectName] = useState('');
    const {
      setProjectId, getIndustrysList, getApplicationList, getTemplateApplicationList, setTemplateActiveProject, setHasMore, setActiveProject, setType, openAddProjectModal, closeAppProjectModal
    } = store;
    // 应用的请求store
    const {
      getProjectList, getTagsList
    } = reqStore;
    const {
      projectList, tagList, addApplicationOne, changeApplicationOne, copyApplicationOne, deleteApplicationOne
    } = reqStore;
    const intl = useIntl();
    const searchContent = [
      {
        components: (
          <Select mode="tags"
            id="name"
            key="name"
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
            {
              tagList.length > 0 ? tagList.map(item => {
                return <Option key={item.name} value={item.name}>{item.name}</Option>;
              }) : null
            }
          </Select>
        ),
      },
    ];
    const handleChange = (value) => {
      setType(value);
      getApplicationList();
    };
    // 请求列表数据
    useEffect(() => {
      setProjectId(ProgressId);
      getTagsList();
      getProjectList();
      getIndustrysList();
      getApplicationList();
      getTemplateApplicationList(true);
      setProjectName(JSON.parse(sessionStorage.getItem('activeProject')).name);

    }, []);
    return (
      <div className={styles.appList}>
        <div className={styles.title}>
          <span >应用类型选择：</span>
          <Select
            onChange={handleChange}
            id="name"
            key="name"
            defaultValue={type||'2D'}
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
              <span>{projectName}</span>
              <span className={styles.title}>共</span>
              <span>{total}个应用</span>
            </>
          } key="1"
            extra={<Button onClick={(e) => {
              e.stopPropagation();
              setCheckFlag(0);
              openAddProjectModal({ projectId: ProgressId });
            }} type="primary" >添加应用</Button>
            }>
            <div id="scrollableDiv" style={{ height: '470px', overflow: 'auto' }} >
              <Card
                actions={(item) => {
                  return (
                    <>
                      <div key="development" className={styles.mybtn}>开发应用</div>
                      <div key="look" className={styles.mybtn}>预览应用</div>
                      <div key="copy" className={styles.mybtn} onClick={() => {
                        setCheckFlag(2);
                        openAddProjectModal();
                      }}>复制应用</div>
                      <div key="export" className={styles.mybtn}>导出应用</div>
                      <div key="change" className={styles.mybtn}
                        onClick={() => {
                          setCheckFlag(1), openAddProjectModal();
                        }}
                      >编辑信息</div>
                      <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {

                        deleteApplicationOne(item.id, (res) => {
                          if (res.code === successCode) {
                            message.success(
                              intl.formatMessage({
                                id: "common.deleteSuccess",
                                defaultValue: "删除成功！",
                              })
                            );
                            getApplicationList();
                          } else {
                            message.error(
                              res.msg || intl.formatMessage({
                                id: "common.deleteError",
                                defaultValue: "删除失败，请稍后重试！",
                              })
                            );
                          }
                        });
                      }}>
                        <div key="delete" className={styles.mybtn}>删除</div>
                      </Popconfirm>
                    </>
                  );
                }}
                value={applicationList}
                setActiveCard={setActiveProject}
                state={0} showStateTag={true}
              ></Card>
              <Pagination
                hideOnSinglePage={true}
                total={total}
                current={curPage + 1}
                pageSize={pageSize}
                onChange={(current) => {
                  getApplicationList({ curPage: current - 1 });
                }}
              />
            </div>


          </Panel>
          <Panel header='从应用模板库中选择' key="2">
            <SearchBar
              // onSearch={changeColumns}
              searchContent={searchContent} showSearchCount={6}
            />
            <Card
              value={templateapplicationList}
              setActiveCard={setTemplateActiveProject}
              state={0}
            ></Card>
          </Panel>
        </Collapse>
        {
          isAddModalVisible && (<ApplyModal onCancel={closeAppProjectModal}
            type={type}
            projectId={ProgressId}
            project={activeProject}
            addOrChangeFlag={checkFlag}
            projectList={projectList}
            tagList={tagList}
            onSave={(application) => {
              addApplicationOne(application, (res) => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.addSuccess",
                      defaultValue: "新增成功！",
                    })
                  );
                  closeAppProjectModal();
                  getTagsList();
                  getApplicationList();
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
            onChange={(id, application) => {
              changeApplicationOne(id, application, (res) => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.changeSuccess",
                      defaultValue: "编辑成功！",
                    })
                  );
                  closeAppProjectModal();
                  getTagsList();
                  getApplicationList();
                } else {
                  message.error(
                    res.msg || intl.formatMessage({
                      id: "common.changeError",
                      defaultValue: "编辑失败，请稍后重试！",
                    })
                  );
                }
              });
            }}
            onCopy={(id, item) => {
              copyApplicationOne(id, item, (res => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.copySuccess",
                      defaultValue: "复制成功！",
                    })
                  );
                  closeAppProjectModal();
                  getApplicationList();
                } else {
                  message.error(
                    res.msg || intl.formatMessage({
                      id: "common.copyError",
                      defaultValue: "复制失败，请稍后重试！",
                    })
                  );
                }
              }));
            }}
          />)
        }

      </div>

    );
  }
);
