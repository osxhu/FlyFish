import React, { useEffect } from 'react';
import styles from './style.less';
import { Table,Button } from 'antd';
import { useState } from 'react';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { getRecordService } from '../../services';
import moment from 'moment';

const ComponentRecord = observer(()=>{
  const columns = [
    {
      title: 'hash',
      dataIndex: 'hash'
    },
    {
      title: '提交摘要',
      dataIndex: 'message',
    },
    {
      title: '提交时间',
      dataIndex: 'time',
      render:(text)=>{
        return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss')
      }
    },{
      title:'操作',
      dataIndex:'handle',
      render:()=>{
        return <Button type='primary'>查看提交diff</Button>
      }
    }
  ];
  const { developingData } = store;

  const [data, setData] = useState([]);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData()
  }, [curPage,pageSize]);
  const getData = async ()=>{
    const res = await getRecordService({id:developingData.id,curPage,pageSize});
    if (res && res.data) {
      setData(res.data.list);
      setTotal(res.data.total)
    }
  }
  
  return <Table
    columns={columns}
    dataSource={data}
    pagination={{
      showQuickJumper:true,
      showSizeChanger:true,
      pageSize:pageSize,
      current:curPage,
      total:total,
      onShowSizeChange:(curPage,size)=>{
        setPageSize(size)
      },
      onChange:(curPage,size)=>{
        setCurPage(curPage);
      }
    }}
    footer={null}
    rowKey='hash'
  />
})

export default ComponentRecord;