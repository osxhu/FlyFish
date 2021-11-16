import React from "react";
import { Modal, Input, Select, CWTable, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { observer, toJS } from '@chaoswise/cw-mobx';
import { Table } from 'antd';
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form, deleteApplyList = [], getDeleteApplyList, onCancel }) {
    // let basicTableListData = toJS(deleteApplyList);
    const intl = useIntl();
    const dataSource = [
      { name: '组件1', createTime: "2021-09-20", updateTime: '2021-09-22', id: 1 ,key:'1'},
      { name: '组件2', createTime: "2021-09-20", updateTime: '2021-09-22', id: 2,key: 2},
      { name: '组件3', createTime: "2021-09-20", updateTime: '2021-09-22', id: 3 ,key: 3}
    ];
    const columns = [
      {
        title: '序号',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <a>还原</a>
        ),
      },
    ];
    
    // 分页、排序、筛选变化时触发
    const onPageChange = (curPage, pageSize) => {
      getDeleteApplyList({ curPage: curPage - 1, pageSize });
    };
    const onSearch = (params) => {
      // setSearchParams(params);
      getDeleteApplyList({
        curPage: 0,
        pageSize: 10
      });
    };

    return (
      <Modal
        draggable
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
        }}
        size="middle"
        title='已删除大屏列表'
        visible={true}
      >
        <Table dataSource={dataSource} rowKey={(record) => record.id} columns={columns} />
      </Modal>
    );
  }
);
