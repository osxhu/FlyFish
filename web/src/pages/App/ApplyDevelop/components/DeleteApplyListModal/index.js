import React from "react";
import { Modal, Input, Select, CWTable, Form, Button } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { formatDate } from '@/config/global';

import { observer, toJS } from '@chaoswise/cw-mobx';
import { Table } from 'antd';
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ total, curPage, form, deleteApplyList = [], onChange, getDeleteApplyList, onCancel }) {
    // let basicTableListData = toJS(deleteApplyList);
    const intl = useIntl();
    let tableData = toJS(deleteApplyList);
    const columns = [
      {
        title: '序号',
        render: (text, record, index) => `${(index + 1) + curPage * 10}`,
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
        render(createTime) {
          return formatDate(createTime);
        },
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render(updateTime) {
          return formatDate(updateTime);
        },
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <a onClick={() => { onChange && onChange(record.id, { status: 'valid' }); }}>还原</a>
        ),
      },
    ];

    // 分页、排序、筛选变化时触发
    const onPageChange = (curPage, pageSize) => {
      getDeleteApplyList({ curPage: curPage - 1, pageSize, status: 'invalid' });
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
        footer={[
          <Button key="back" onClick={() => onCancel && onCancel()}>
            关闭
          </Button>
        ]}
      >
        <Table
          pagination={{
            current: curPage + 1,
            pageSize: 10,
            total: total,
            onChange: onPageChange
          }}
          dataSource={tableData} rowKey={(record) => record.id} columns={columns} />
      </Modal>
    );
  }
);
