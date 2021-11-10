/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-10 18:46:29
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect } from "react";
import { AbreastLayout } from "@chaoswise/ui";
import { Icon,Select,Input,Table,Popover,Button,Modal } from 'antd';
import {
  observer, loadingStore, toJS, Form, Row,
  Col
} from "@chaoswise/cw-mobx";
import store from "./model/index";
import EditProjectModal from "./components/EditProjectModal";
import Cards from "./components/card";

import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import Detail from "./components/detail";

const {Option} = Select;

const ComponentDevelop = observer(() => {
  const intl = useIntl();
  const {
    getProjectList
  } = store;
  const data = [
    {
      name:'2d图表',
      value:'tubiao1',
      children:[
        {
          name:'柱状图',
          value:'zhuzhuangtu'
        },
        {
          name:'饼图',
          value:'bingtu'
        }
      ]
    },
    {
      name:'3d图表',
      value:'tubiao2',
      children:[
        {
          name:'城市',
          value:'chengshi'
        },
        {
          name:'地图',
          value:'ditu'
        }
      ]
    }
  ];
  const columns = [
    {
      title: '组件类型',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
      render:(text,record)=>{
        return <a className={styles.nameLink} onClick={()=>{setDetailShow(true);}}>text</a>;
      }
    },
    {
      title: '所属项目',
      dataIndex: 'project',
      key: 'project',
    },
    {
      title: '组件快照',
      dataIndex: 'photo',
      key: 'photo',
    },
    {
      title: '组件标签',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: '组件状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '组件类别',
      dataIndex: 'cate',
      key: 'cate',
    },
    {
      title: '最近更新时间',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Popover 
          content={
            <div className={styles.btnWraper}>
              <div>开发组件</div>
              <div>复制组件</div>
              <div>导入源码</div>
              <div>导出源码</div>
              <div>上传组件库</div>
              <div>编辑信息</div>
              <div>删除</div>
            </div>
          }
          placement="right"
        >
          <span style={{color:'#449CF2',cursor:'pointer'}}>操作选项</span>
        </Popover>
      ),
    },
  ];
  
  const data2 = [
    {
      key: '1',
      type:'柱状图',
      name: '柱状图1',
      project: '1',
      photo: '1',
      tag:'1',
      status:'1',
      version:'1',
      cate:'1',
      time:'2021-11-09',
      creator:''
    }
  ];
  const [treeData,setTreeData] = useState(data);
  const [addModalvisible, setAddModalvisible] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  // 请求列表数据
  useEffect(() => {
    // getProjectList();
  }, []);
  return <>
    <AbreastLayout
        type='leftOperationArea'
        showCollapsedBtn
        Siderbar={(
          <div className={styles.leftWrap}>
            <div className={styles.leftBigTitle}>
              <span style={{marginLeft:10}}>组件列表</span>
              <Icon type="plus-square" style={{float:'right',marginRight:20,cursor:'pointer'}}/>
            </div>
            <div className={styles.allBtn}>全部组件</div>
            <div className={styles.treeWrap}>
              <HandleMenu dataSource={treeData}/>
            </div>
          </div>
        )}
      >
        <div className={styles.rightWraper}>
          <div className={styles.handleWraper}>
            <div className={styles.handleLeft}>
              <div>
              <span>项目名称：</span>
              <Select
                showSearch
                style={{ width: 150 }}
                placeholder="请选择"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="001">项目001</Option>
                <Option value="002">项目002</Option>
                <Option value="003">项目003</Option>
              </Select>
              </div>
              <div>
                <Input style={{width:400}} placeholder='输入组件名称/项目名称/描述/标签/创建人查找组件'></Input>
              </div>
              <div>
                <span>开发状态：</span>
                <Select
                  placeholder='请选择'
                  style={{ width: 150 }}
                >
                  <Option value="1">开发中</Option>
                  <Option value="2">已交付</Option>
                </Select>
              </div>
              <div>
                <span>组件类别：</span>
                <Select
                  placeholder='请选择'
                  style={{ width: 150 }}
                >
                  <Option value="1">全部</Option>
                  <Option value="2">基础组件</Option>
                </Select>
              </div>
            </div>
            <div>
              <Button 
                type='primary' 
                style={{borderRadius:'5px'}}
                onClick={()=>{
                  setAddModalvisible(true);
                }}
              >添加组件</Button>
            </div>
          </div>
          <div className={styles.listWraper}>
            <Table columns={columns} dataSource={data2} />
          </div>
        </div>
        <Modal
          title="添加组件"
          visible={addModalvisible}
          footer={null}
          width='50%'
          onCancel={()=>{setAddModalvisible(false);}}
        >
          <AddComponent/>
        </Modal>
        <Detail
          show={false}
        />
      </AbreastLayout>
  </>;
});
export default ComponentDevelop;
