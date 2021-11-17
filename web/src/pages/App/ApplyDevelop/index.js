/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, SearchBar, Icon, Pagination } from "@chaoswise/ui";
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
  let [checkFlag, setCheckFlag] = useState(false);
  const intl = useIntl(); const {
    getApplicationList,
    setSearchParams,setActiveCard,
    setCurPage, addApplicationOne,
    saveProject, getTagsList, getProjectList,
    openAddProjectModal, closeDeleteApplyListModal,
    closeAppProjectModal, openDeleteApplyListModal,setType,
  } = store;
  const { total, curPage, tagList, pageSize, activeCard,projectList, applicationList1, isDeleteApplyListModalVisible, applicationList, isAddModalVisible, activeProject } =
    store;
  const [paramsObj, setParamsObj] = useState({});
  const onShowSizeChange = (row) => {
    console.log('凤凰网', row);
  };
  const searchContent = [
    {
      components: (
        <Input
          id="projectName"
          key="projectName"
          allowClear={true}
          name='项目名称'
          suffix={<Icon type="search" />
          }
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputProgressName",
            defaultValue: "输入项目名称进行查询",
          })}
        />
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
    if(params['type']){
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
      ...paramsObj
    });
  };
  const extra = () => {
    return [
      <Button
        type="primary"
        key="create_project"
        onClick={() => {
          openAddProjectModal({});
          setCheckFlag(true);
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
        <TsetCard value={applicationList} setActiveCard={setActiveCard} state={0} showStateTag={true}>
          <>
            <div key="development" className={styles.mybtn}>开发应用</div>
            <div key="look" className={styles.mybtn}>预览应用</div>
            <div key="copy" className={styles.mybtn}>复制应用</div>
            <div key="export" className={styles.mybtn}>导出应用</div>
            <div key="change" className={styles.mybtn} 
            onClick={(e)=>{
            setCheckFlag(false),openAddProjectModal();
            }}>编辑信息</div>
            <div key="delete" className={styles.mybtn}>删除</div>
          </>
        </TsetCard>
      }
      <Pagination total={total}
        current={curPage}
        showSizeChanger={true}
        onChange={(current, size) => {
          setCurPage(current);
          console.log('当前ye', current);
          // getApplicationList();
        }}
        showQuickJumper={true}
        onShowSizeChange={onShowSizeChange} />
      {isAddModalVisible && (
        <AppProjectModal
          addOrChangeFlag={checkFlag}
          project={activeCard}
          tagList={tagList}
          projectList={projectList}
          onSave={(project) => {
            addApplicationOne(project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "保存成功！",
                  })
                );
                closeAppProjectModal();
                getApplicationList({
                  curPage: 0,
                });
              } else {
                message.error(
                  intl.formatMessage({
                    id: "common.saveError",
                    defaultValue: "保存失败，请稍后重试！",
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
            onCancel={closeDeleteApplyListModal}
          />
        )
      }

    </React.Fragment>
  );
});
export default ApplyDevelop;
