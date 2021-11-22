/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Input, Button, message, SearchBar, Icon, Pagination, Popconfirm } from "@chaoswise/ui";
import {
  observer, loadingStore, toJS, Form, Row,
  Col
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import AppProjectModal from "./components/AddProjectModal";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import { Select } from 'antd';
import { APP_DEVELOP_STATUS } from '@/config/global';

const { Option } = Select;
import DeleteApplyListModal from './components/DeleteApplyListModal';
const ApplyDevelop = observer(() => {
  let [checkFlag, setCheckFlag] = useState(null);
  const intl = useIntl(); const {
    getApplicationList,
    setSearchParams, setActiveCard,
    setCurPage, addApplicationOne, deleteApplicationOne, getApplicationListDelete,
    saveProject, getTagsList, getProjectList, changeApplicationOne,
    openAddProjectModal, closeDeleteApplyListModal, copyApplicationOne,
    closeAppProjectModal, openDeleteApplyListModal, setType, addNewTag
  } = store;
  const { total, key, curPage, totalDelete, deleteCurPage, tagList, pageSize, activeCard, applicationListDelete, projectList, applicationList1, isDeleteApplyListModalVisible, applicationList, isAddModalVisible, activeProject } =
    store;
  const onShowSizeChange = (row) => {
    console.log('凤凰网', row);
  };
  const searchContent = [
    {
      components: (
        <Select
          id="projectId"
          key="projectId"
          allowClear={true}
          style={{ width: "200px" }}
          name='项目名称'
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchSelectProgressName",
            defaultValue: "选择项目名称进行查询",
          })}
        >
          {
            projectList.map(item => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      ),
    },
    {
      components: (

        <Select
          id="developStatus"
          key="developStatus"
          name='开发状态'
          style={{ width: "100px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputDevelopmentState",
            defaultValue: "选择开发状态进行查询",
          })}
        >
          {<Option value=''>全部</Option>}
          {
            APP_DEVELOP_STATUS.map(item => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      ),
      formAttribute: { initialValue: '' }
    },
    {
      components: (
        <Input
          id="name"
          key="name"
          allowClear={true}
          name='应用名称'
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputAppName",
            defaultValue: "输入应用名称进行查询",
          })}
        />
      ),
    },
    {
      components: (
        <Select mode="tags" id="tags"
          key="tags"
          allowClear={true}
          name='应用标签' style={{ width: 200 }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputApplyLabel",
            defaultValue: "选择应用标签进行查询",
          })}
        >
          {
            tagList.map(item => {
              return <Option key={item.id} value={item.id}>{item.name}</Option>;
            })
          }
        </Select>
      ),
    },
  ];
  const searchTypeContent = [
    {
      components: (
        <Select
          id="type"
          key="type"
          name='应用类型选择'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "选择应用类型进行查询",
          })}
        >
          <Option value="2D" >2D大屏应用</Option>
          <Option value="3D">3D大屏应用</Option>
        </Select>
      ),
      formAttribute: { initialValue: '2D' }
    },

  ];
  // 请求列表数据
  useEffect(() => {
    getProjectList();
    getApplicationList();
    getTagsList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getApplicationList({ curPage, pageSize });
  };
  const onSearchType = (params) => {
    if (params['type']) {
      setType(params.type);
    }
    getApplicationList({
      curPage: 0
    });
  };
  const onSearch = (params) => {
    for (const i in params) {
      if (!params[i] || params[i].length === 0) {
        delete params[i];
      }
    }
    setSearchParams(params);
    getApplicationList({
      curPage: 0,
    });
  };
  const extra = () => {
    return [
      <Button
        type="primary"
        key="create_project"
        onClick={() => {
          openAddProjectModal({ tags: [] });
          setCheckFlag(0);
          setActiveCard();

        }}
      >
        <FormattedMessage
          id="pages.applyDevelop.create"
          defaultValue="添加应用"
        />
      </Button>,
      <Button
        key="reset_project"
        onClick={() => {
          getApplicationListDelete({ status: 'invalid' });
          openDeleteApplyListModal();
        }}
      >
        <FormattedMessage
          id="pages.applyDevelop.reset"
          defaultValue="还原应用"
        />
      </Button>,
    ];
  };
  return (
    <React.Fragment>
      <SearchBar
        onSearch={onSearchType}
        searchContent={searchTypeContent} showSearchCount={6} extra={extra}
      />
      <SearchBar
        onSearch={onSearch}
        className={styles.search}
        searchContent={searchContent} showSearchCount={6}
      />
      {
        <TsetCard value={applicationList}
          setActiveCard={setActiveCard}
          state={0} showStateTag={true}
          actions={(item) => {
            return (
              <>
                <div key="development" className={styles.mybtn}>开发应用</div>
                <div key="look" className={styles.mybtn}>预览应用</div>
                <div key="copy" className={styles.mybtn}
                  onClick={() => {
                    setCheckFlag(2);
                    openAddProjectModal();
                  }}
                >复制应用</div>
                <div key="export" className={styles.mybtn}>导出应用</div>
                <div key="change" className={styles.mybtn}
                  onClick={() => {
                    setCheckFlag(1), openAddProjectModal();
                  }}>编辑信息</div>
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
        >
        </TsetCard>
      }
      <Pagination
        total={total}
        current={curPage + 1}
        pageSize={pageSize}
        onChange={(current) => {
          setCurPage(current - 1);
          getApplicationList();
        }}
        onShowSizeChange={onShowSizeChange} />
      {isAddModalVisible && (
        <AppProjectModal
          addOrChangeFlag={checkFlag}
          project={activeCard}
          tagList={tagList}
          type={key}
          addNewTag={addNewTag}
          projectList={projectList}
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
                getApplicationList({
                  curPage: 0,
                });
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
          onCancel={closeAppProjectModal}
        />
      )}
      {
        isDeleteApplyListModalVisible && (
          <DeleteApplyListModal
            total={totalDelete}
            curPage={deleteCurPage}
            project
            onChange={(id,params)=>{
              changeApplicationOne(id,params,(res)=>{
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.reductionSuccess",
                      defaultValue: "还原成功！",
                    })
                  );
                  getApplicationListDelete({ status: 'invalid' });
                  getApplicationList({
                    curPage: 0,
                  });
                } else {
                  message.error(
                    res.msg || intl.formatMessage({
                      id: "common.reductionError",
                      defaultValue: "还原失败，请稍后重试！",
                    })
                  );
                }
              });
            }}
            deleteApplyList={applicationListDelete.list}
            getDeleteApplyList={getApplicationListDelete}
            onCancel={closeDeleteApplyListModal}
          />
        )
      }

    </React.Fragment>
  );
});
export default ApplyDevelop;
