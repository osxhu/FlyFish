/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { CWTable, Input, Button, message,Icon, Select } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditRoleModal from "./components/EditRoleModal";
import ChangeRoleModal from "./components/changeRoleMoal";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { Popconfirm } from 'antd';
import ChangeRoleJurisdiction from './components/changeRoleJurisdiction';
import { formatDate } from '@/config/global';
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
    deleteRole,
    getAllUserList, changeRoleMenu,
    closeEditRoleModal, changeRoleAuth,
    openRoleJurisdictionModal,
    closeRoleJurisdictionModal, getRoleDetail,
    addNewRole
  } = store;

  const { total, projectList, pageSize, current, userList, oneRoleDetail, oneRoleMenu, isEditRoleModalVisible, isRoleJurisdictionModalVisible, isRoleModalVisible, activeUser, activeProject } =
    store;
  const [saveOrChangeFlag, setSaveOrChangeFlag] = useState(false);
  // 成员列表的值
  const loading = loadingStore.loading["RoleList/getUserList"];
  // 表格列表数据
  let basicTableListData = toJS(projectList);
  // 表格列配置信息
  const columns = [
    {
      title: "角色名",
      dataIndex: "name",
      key: "name",
      disabled: true,
      width: 250
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
      disabled: true,
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      disabled: true,
      render(createTime) {
        return formatDate(createTime);
      }
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
              onClick={async () => {
                await getRoleDetail(record.id);
                getAllUserList();
                openRoleModal(record);
              }}
            >
              <FormattedMessage
                id="pages.roleManage.member"
                defaultValue="成员列表"
              />
            </a>
            <a className={styles.projectAction}
              onClick={() => {

                openRoleJurisdictionModal(record);
              }}
            >
              <FormattedMessage
                id="pages.roleManage.role"
                defaultValue="权限配置"
              />
            </a>
            <a
              className={styles.projectAction}
              onClick={() => {
                setSaveOrChangeFlag(false);
                openEditRoleModal(record);
              }}
            >
              <FormattedMessage id="common.edit" defaultValue="编辑" />
            </a>
           {
              record.name!=='管理员'&&<Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                deleteRole({ id: record.id, ...record }, (res) => {
                  if (res.code === successCode) {
                    message.success(
                      intl.formatMessage({
                        id: "common.deleteSuccess",
                        defaultValue: "删除成功！",
                      })
                    );
                    closeEditRoleModal();
                    getUserList({
                      curPage: 0,
                    });
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
                <a className={styles.projectAction} href='#'>
                  <FormattedMessage id="common.delete" defaultValue="删除" />
                </a>
              </Popconfirm>
           }
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
          suffix	={<Icon type="search" />
        }
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.roleManage.searchInputRoleName",
            defaultValue: "输入角色名进行查询",
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
  const onPageChange = (curPage, pageSize) => {
    getUserList({ curPage: curPage - 1, pageSize });
  };
  const onSearch = (params) => {
    setSearchParams(params);
    getUserList({
      curPage: 0,
      pageSize: 10
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
          current: current,
          pageSize: pageSize,
          defaultPageSize: 10,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          showSizeChanger: true
        }}
        searchBar={{
          onSearch: onSearch,
          extra: () => {
            return [
              <Button
                type="primary"
                key="create_project"
                onClick={() => {
                  setSaveOrChangeFlag(true);
                  openEditRoleModal({}, 1); setSaveOrChangeFlag(true);
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
      {/* 新增/编辑的弹窗 */}
      {isEditRoleModalVisible && (
        <EditRoleModal
          role={activeProject}
          onChange={(id, project) => {
            changeRole(id, project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.changeSuccess",
                    defaultValue: "修改成功！",
                  })
                );
                closeEditRoleModal();
                getUserList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.msg || intl.formatMessage({
                    id: "common.changeError",
                    defaultValue: "修改失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onSave={(project) => {
            addNewRole(project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "新增成功！",
                  })
                );
                closeEditRoleModal();
                getUserList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.msg || intl.formatMessage({
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
      {/* 修改用户角色 */}
      {isRoleModalVisible && (
        <ChangeRoleModal
          id={activeUser.id}
          project={userList}
          checkProject={oneRoleDetail}
          onSave={(id, project) => {
            changeRoleAuth(id, project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "保存成功！",
                  })
                );
                closeRoleModal();
                getUserList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.mag ||
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
      {/* 修改菜单 */}
      {isRoleJurisdictionModalVisible && (
        <ChangeRoleJurisdiction
          project={activeUser}
          close={closeRoleJurisdictionModal}
          onSave={(project) => {
            changeRoleMenu(activeUser.id, project, (res) => {
              if (res.code === successCode) {
                message.success(
                  intl.formatMessage({
                    id: "common.saveSuccess",
                    defaultValue: "保存成功！",
                  })
                );
                closeRoleJurisdictionModal();
                getUserList({
                  curPage: 0,
                });
              } else {
                message.error(
                  res.msg ||
                  intl.formatMessage({
                    id: "common.saveError",
                    defaultValue: "保存失败，请稍后重试！",
                  })
                );
              }
            });
          }}
          onCancel={closeRoleJurisdictionModal}
        />

      )
      }
    </React.Fragment>
  );
});
export default RoleList;
