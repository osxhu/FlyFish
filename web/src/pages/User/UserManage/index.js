/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CWTable, Input, Button, message, Select } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditProjectModal from "./components/EditUsertModal";
import ChangeRoleModal from "./components/changeRoleMoal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { Popconfirm } from 'antd';

import { FormattedMessage, useIntl } from "react-intl";
const UserList = observer(() => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams,
    saveUser,
    openEditProjectModal,
    openRoleModal,
    closeRoleModal,
    deleteOne,
    closeEditProjectModal,
  } = store;
  const { total, projectList, isEditProjectModalVisible, isRoleModalVisible, activeUser } =
    store;
  const loading = loadingStore.loading["UserList/getProjectList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      disabled: true,
    },
    {
      title: "用户邮箱",
      dataIndex: "email",
      key: "email",
      disabled: true,
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone"
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
            <a className={styles.projectAction}
              onClick={() => {
                openRoleModal(record);
              }}
            >
              <FormattedMessage
                id="pages.userManage.configurePermissions"
                defaultValue="配置权限"
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
            <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
              saveUser({status:'invalid',id:record.id}, (res) => {
                if (res.code === 0) {
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
          id="username"
          key="username"
          name='用户名'
          style={{ width: "150px" }}
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputUsername",
            defaultValue: "输入用户名进行查询",
          })}
        />
      ),
    }, {
      components: (
        <Input
          id="email"
          key="email"
          name='邮箱'
          style={{ width: "150px" }}
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputEmail",
            defaultValue: "输入邮箱进行查询",
          })}
        />
      ),
    }, {
      components: (
        <Select
          id="state"
          key="state"
          name='状态'
          style={{ width: "150px" }}
          placeholder={intl.formatMessage({
            id: "pages.userManage.searchInputstate",
            defaultValue: "输入状态进行查询",
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
                  id="pages.userManage.create"
                  defaultValue="用户"
                />
              </Button>,
            ];
          },
          showSearchCount: 6,
          searchContent: searchContent,
        }}
      ></CWTable>
      {isEditProjectModalVisible && (
        <EditProjectModal
          project={activeUser}
          onSave={(project) => {
            saveUser(project, (res) => {
              if (res.code === 0) {
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
      {isRoleModalVisible && (
        <ChangeRoleModal
          project={activeUser}
          onSave={(project) => {
            saveUser(project, (res) => {
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
          onCancel={closeRoleModal}
        />

      )
      }
    </React.Fragment>
  );
});
export default UserList;
