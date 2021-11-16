/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, SearchBar,Icon, Pagination } from "@chaoswise/ui";
import {
  observer, loadingStore, toJS, Form, Row,
  Col
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditProjectModal from "./components/EditProjectModal";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import { Select } from 'antd';
const { Option } = Select;
import DeleteApplyListModal from './components/DeleteApplyListModal';
const ApplyDevelop = observer(() => {
  let [checkFlag, setCheckFlag] = useState(false);
  const intl = useIntl();

  const {
    getProjectList,
    setSearchParams,
    saveProject,
    openEditProjectModal,closeDeleteApplyListModal,
    closeEditProjectModal, openDeleteApplyListModal,
  } = store;
  const { total, isDeleteApplyListModalVisible, projectList, isEditProjectModalVisible, activeProject } =
    store;
  const onDelete = (id) => {
    console.log('应用开发子组件删除', id);
  };
  const testCardArr = [{ id: 1, status: 0, title: '测试大屏11', development: '泡泡', create: '分为丰富' }, { id: 2, status: 1, title: '测试大屏22', development: '虾饺', create: '11324de' }, { id: 3, status: 1, title: '测试大屏33', development: '春卷', create: 'ewfefe' }, { id: 3, status: 2, title: '测试大屏44', development: 'jifwfeferf', create: '321321' }, { id: 4, status: 2, title: '测试大屏55', development: 'eweqweq', create: 'vrevevr' }];
  const AllMethod = {
    change: openEditProjectModal
  };
  const searchContent = [
    {
      components: (
        <Input
          id="name"
          key="name"
          name='项目名称'
          suffix	={<Icon type="search" />
        }
          style={{ width: "200px" }}
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
          id="state"
          key="state"
          name='开发状态'
          style={{ width: "100px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputDevelopmentState",
            defaultValue: "选择开发状态进行查询",
          })}
        />
      ),
    },
    {
      components: (
        <Input
          id="AppName"
          key="AppName"
          name='应用名称'
          suffix	={<Icon type="search" />
        }
          style={{ width: "150px" }}
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
          name='应用标签' style={{ width: 200 }}
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
  const searchTypeContent = [
    {
      components: (
        <Input
          id="name"
          key="name"
          name='应用类型选择'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "选择应用类型进行查询",
          })}
        />
      ),
    }
  ];
  // 请求列表数据
  useEffect(() => {
    getProjectList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (curPage, pageSize) => {
    getProjectList({ curPage, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getProjectList({
      curPage: 0,
    });
  };
  const extra = () => {
    return [
      <Button
        type="primary"
        key="create_project"
        onClick={() => {
          openEditProjectModal({});
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
        searchContent={searchTypeContent} showSearchCount={6} extra={extra}
      />
      <SearchBar
        className={styles.search}
        searchContent={searchContent} showSearchCount={6}
      />
      {/* 测试card */}
      {
        <TsetCard value={testCardArr} state={0}>
          <>
            <div key="development" className={styles.mybtn}>开发应用</div>
            <div key="look" className={styles.mybtn}>预览应用</div>
            <div key="copy" className={styles.mybtn}>复制应用</div>
            <div key="export" className={styles.mybtn}>导出应用</div>
            <div key="change" className={styles.mybtn} >编辑信息</div>
            <div key="delete" className={styles.mybtn}>删除</div>
          </>
        </TsetCard>
      }
      <Pagination defaultCurrent={6} total={500} showQuickJumper={true} showSizeChanger={true} />
      {isEditProjectModalVisible && (
        <EditProjectModal
          project={activeProject}
          onSave={(project) => {
            saveProject(project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "保存成功！",
                  })
                );
                closeEditProjectModal();
                getProjectList({
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
          onCancel={closeEditProjectModal}
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
