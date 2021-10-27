/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CWTable, Input, Button, message } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditProjectModal from "./components/EditProjectModal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";

const AppProjectManage = observer(() => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams,
    saveProject,
    openEditProjectModal,
    closeEditProjectModal,
  } = store;
  const { total, projectList, isEditProjectModalVisible, activeProject } =
    store;
  const loading = loadingStore.loading["AppProjectManage/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "项目标识",
      dataIndex: "projectMark",
      key: "projectMark",
      disabled: true,
    },
    {
      title: "项目名称",
      dataIndex: "name",
      key: "name",
      disabled: true,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
    },
    {
      title: "描述",
      dataIndex: "describe",
      key: "describe",
      width: 300,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: intl.formatMessage({
        id: "common.actions",
        defaultValue: "操作",
      }),
      dataIndex: "actions",
      key: "actions",
      render(text, record, index) {
        return (
          <span className={styles.projectActionList}>
            <a className={styles.projectAction}>
              <FormattedMessage
                id="pages.projectManage.goToProject"
                defaultValue="进入项目"
              />
            </a>
            <a
              className={styles.projectAction}
              onClick={() => {
                openEditProjectModal(record);
              }}
            >
              <FormattedMessage id="common.edit" defaultValue="编辑" />
            </a>
            <a className={styles.projectAction}>
              <FormattedMessage id="common.delete" defaultValue="删除" />
            </a>
          </span>
        );
      },
    },
  ];
  const searchContent = [
    {
      components: (
        <Input
          id="name"
          key="name"
          style={{ width: "300px" }}
          placeholder={intl.formatMessage({
            id: "pages.projectManage.searchInputPlaceholder",
            defaultValue: "输入项目名称/项目标识/行业/描述进行查询",
          })}
        />
      ),
    },
  ];
  // 请求列表数据
  useEffect(() => {
    getProjectList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (currentPage, pageSize) => {
    getProjectList({ currentPage, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getProjectList({
      currentPage: 1,
    });
  };

  return (
    <React.Fragment>
      <CWTable
        columns={columns}
        dataSource={basicTableListData}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{
          showTotal: true,
          total: total,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        searchBar={{
          onSearch: onSearch,
          extra: () => {
            return [
              <Button
                type="primary"
                key="create_project"
                onClick={() => {
                  openEditProjectModal({});
                }}
              >
                <FormattedMessage
                  id="pages.projectManage.create"
                  defaultValue="添加项目"
                />
              </Button>,
            ];
          },
          searchContent: searchContent,
        }}
      ></CWTable>
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
                  currentPage: 1,
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
    </React.Fragment>
  );
});
export default AppProjectManage;
