/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { CWTable, Input, Button, message } from "@chaoswise/ui";
import { observer, loadingStore, toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";
import AppList from "./components/AppList";
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import AddAppModal from "./components/AddAppModal";
import { FormattedMessage, useIntl } from "react-intl";
import { Menu } from 'antd';

const ProjectDetail = observer((props) => {
  const intl = useIntl();
  const {
    getProjectList,
    setSearchParams,
    saveProject,
    openEditProjectModal, openProjectPage,
    closeEditProjectModal,setCheckPageFLag
  } = store;
  const { total, projectList, isEditProjectModalVisible, activeProject,checkPageFLag } =
    store;
  const nowProgressId = props.match.params.id;
  const loading = loadingStore.loading["ProjectDetail/getProjectList"];
  const getChildrenMsg = (item) => {
    openEditProjectModal(item);
  };
  return (
    <React.Fragment>
      <Menu onClick={setCheckPageFLag} mode="horizontal" selectedKeys={[checkPageFLag]} >
        <Menu.Item key="applyList" >
          组件应用列表
        </Menu.Item>
        <Menu.Item key="assemblyList" >
          项目组件列表
        </Menu.Item>
      </Menu>
      <AppList ProgressId={nowProgressId} checkPageFLag={checkPageFLag} onSave={() => {
        openEditProjectModal(activeProject);
      }} />
      {isEditProjectModalVisible && (
        <AddAppModal
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
export default ProjectDetail;
