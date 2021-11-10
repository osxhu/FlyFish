/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message, Select } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditRoleModal from "./components/EditRoleModal";
import ChangeRoleModal from "./components/changeRoleMoal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { Popconfirm } from 'antd';

import { FormattedMessage, useIntl } from "react-intl";
const RoleList = observer(() => {
  const intl = useIntl();
  const {
    getUserList, changeRole,
    setSearchParams,
    saveProject,
    openEditRoleModal,
    openRoleModal,
    closeRoleModal,
    deleteOne,
    deleteRole,
    closeEditRoleModal,
    addNewRole
  } = store;
  const { total, projectList, isEditRoleModalVisible, isRoleModalVisible, activeUser, activeProject } =
    store;
  const [saveOrChangeFlag, setSaveOrChangeFlag] = useState(false);

  const loading = loadingStore.loading["RoleList/getUserList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "角色名",
      dataIndex: "rolename",
      key: "rolename",
      disabled: true,
      width: 250
    },
    {
      title: "描述",
      dataIndex: "describe",
      key: "describe",
      disabled: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      disabled: true,
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
            <a className={styles.projectAction}
              onClick={() => {
                openRoleModal(record);
              }}
            >
              <FormattedMessage
                id="pages.roleManage.member"
                defaultValue="成员"
              />
            </a>
            <a
              className={styles.projectAction}
              onClick={() => {
                openEditRoleModal(record);setSaveOrChangeFlag(false);
              }}
            >
              <FormattedMessage id="common.edit" defaultValue="编辑" />
            </a>
            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
              deleteRole({id:3,...record}, (res) => {
                if (res.code === successCode) {
                  message.success(
                    intl.formatMessage({
                      id: "common.deleteSuccess",
                      defaultValue: "删除成功！",
                    })
                  );
                  closeEditRoleModal();
                  getUserList({
                    currentPage: 1,
                  });
                } else {
                  message.error(
                    intl.formatMessage({
                      id: "common.deleteError",
                      defaultValue: "删除失败，请稍后重试！",
                    })
                  );
                }
              });
            }}>
              <a className={styles.projectAction} href='#'>
                <FormattedMessage id="common.delete" defaultValue="删除" />
              </a>
            </Popconfirm>,

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
          name='角色名'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.roleManage.searchInputRoleName",
          })}
        />
      ),
    }
  ];
  function handleChange(value) {
    console.log(`selected ${value}`);
  }
  // 请求列表数据
  useEffect(() => {
    getUserList();
  }, []);
  // 分页、排序、筛选变化时触发
  const onPageChange = (currentPage, pageSize) => {
    getUserList({ currentPage, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getUserList({
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
                  openEditRoleModal({});setSaveOrChangeFlag(true);
                }}
              >
                <FormattedMessage
                  id="pages.roleManage.create"
                  defaultValue="角色"
                />
              </Button>,
            ];
          },
          showSearchCount: 6,
          searchContent: searchContent,
        }}
      ></CWTable>
      {isEditRoleModalVisible && (
        <EditRoleModal
          role={activeProject}
          onChange={(project) => {
            changeRole({ id: 3, ...project }, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.changeSuccess",
                    defaultValue: "修改成功！",
                  })
                );
                closeEditRoleModal();
                getUserList({
                  currentPage: 1,
                });
              } else {
                message.error(
                  intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "修改失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onSave={(project) => {
            addNewRole({ project }, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "新增成功！",
                  })
                );
                closeEditRoleModal();
                getUserList({
                  currentPage: 1,
                });
              } else {
                message.error(
                  intl.formatMessage({
                    id: "common.saveError",
                    defaultValue: "新增失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          flag={saveOrChangeFlag}
          onCancel={closeEditRoleModal}
        />
      )}
      {isRoleModalVisible && (
        <ChangeRoleModal
          project={activeUser}
          onSave={(project) => {
            saveProject(project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "保存成功！",
                  })
                );
                closeEditRoleModal();
                getUserList({
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
          onCancel={closeRoleModal}
        />

      )
      }
    </React.Fragment>
  );
});
export default RoleList;
