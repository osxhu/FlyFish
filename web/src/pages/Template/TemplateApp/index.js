/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { message, SearchBar, Pagination ,Input,Icon} from "@chaoswise/ui";
import {
  observer
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import CopyApplyModal from "./components/CopyApplyModal";
import TsetCard from '@/components/TestCard';
import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { useIntl } from "react-intl";
import { Select } from 'antd';
const { Option } = Select;

const ApplyDevelop = observer(() => {
  const intl = useIntl();

  const {
    getProjectList,
    setSearchParams,
    saveProject,
    openCopyApplyModal,
    closeCopyApplyModal,
  } = store;
  const { isCopyApplyModalVisible, activeProject } =
    store;
  const testCardArr = {
    list:[{name: "copy组件",id: "618f6c5a060f18039f74429b",trades:[{name:'测试行业1'}]},{name: "侧边栏组件",id: "618f6c5a060f18039f74429a",trades:[{name:'测试行业2'},{name:'测试行业3'}]}]
  };
  const AllMethod = {
    change: openCopyApplyModal
  };
  const searchContent = [
    {
      components: (
        <Select
          id="trade"
          key="trade"
          name='行业'
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.trade",
            defaultValue: "选择行业进行查询",
          })}
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
          id="name"
          key="name"
          name='应用名称'
          suffix	={<Icon type="search" />
        }
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyTemplate.applyName",
            defaultValue: "选择应用名称进行查询",
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
            id: "pages.applyTemplate.searchInputApplyLabel",
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
  return (
    <React.Fragment>
      <div className={styles.searchCotainer1}>
        应用类型选择：<Select
          id="name"
          key="name"
          style={{ width: "200px" }}
          placeholder={intl.formatMessage({
            id: "pages.applyDevelop.searchInputPlaceholder",
            defaultValue: "选择应用类型进行查询",
          })}
        />
      </div>
      <SearchBar
        searchContent={searchContent} showSearchCount={6} 
      />
      {/* 测试card */}
      {
        <TsetCard value={testCardArr} state={1}>
          <>
            <div key="change" className={styles.mybtn} >预览模板应用</div>
            <div key="delete" className={styles.mybtn} onClick={()=>{openCopyApplyModal();}}>  使用模板创建应用</div>
          </>
        </TsetCard>
      }
      <Pagination defaultCurrent={6} total={500} showQuickJumper={true} showSizeChanger={true} />
      {isCopyApplyModalVisible && (
        <CopyApplyModal
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
                closeCopyApplyModal();
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
          onCancel={closeCopyApplyModal}
        />
      )}
    </React.Fragment>
  );
});
export default ApplyDevelop;
