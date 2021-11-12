/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-12 16:54:14
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect, useRef } from "react";
import { AbreastLayout } from "@chaoswise/ui";
import { Icon,Select,Input,Table,Popover,Button,Modal,Row,Col,message } from 'antd';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";

import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import Detail from "./components/detail";
import _ from "lodash";
import { updateTreeDataService } from './services';
import moment from 'moment';

const {Option} = Select;

const ComponentDevelop = observer(() => {
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
      dataIndex: 'projects',
      key: 'projects',
      render:(text,record)=>{
        return text.map((v,k)=>{
          return <span key={k}>
            {v.name+(k===(text.length-1)?'':',')}
          </span>;
        });
      }
    },
    {
      title: '组件快照',
      dataIndex: 'cover',
      key: 'cover',
      render:(text)=>{
        return <img src={text}></img>;
      }
    },
    {
      title: '组件标签',
      dataIndex: 'tags',
      key: 'tags',
      render:(text,record)=>{
        return text.map((v,k)=>{
          return <span key={k}>
            {v.name+(k===(text.length-1)?'':',')}
          </span>;
        });
      }
    },
    {
      title: '组件状态',
      dataIndex: 'developStatus',
      key: 'developStatus'
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
    {
      title: '组件类别',
      dataIndex: 'subCategory',
      key: 'subCategory',
    },
    {
      title: '最近更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render:(text)=>{
        return moment(Number(text)).format('YYYY-MM-DD HH:mm:ss');
      }
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
  const intl = useIntl();
  const {
    setDetailShow,
    addModalvisible,
    setAddModalvisible,
    getTreeData,
    getListData,
    setSelectedData
  } = store;
  const { treeData,listData,selectedData } = store;
  // const { list,curPage,pageSize,total } = listData;

  const [addCateName, setAddCateName] = useState('');
  const [addingCate, setAddingCate] = useState(false);
  const addCateRef = useRef();

  // 请求列表数据
  useEffect(() => {
    getTreeData();
    getListData();
  }, []);
  useEffect(() => {
    getListData();
  }, [selectedData]);
  return <>
    <AbreastLayout
        type='leftOperationArea'
        showCollapsedBtn
        SiderWidth={300}
        Siderbar={(
          <div className={styles.leftWrap}>
            <div className={styles.leftBigTitle}>
              <span style={{marginLeft:10}}>组件列表</span>
              <Icon 
                type="plus-square" 
                style={{float:'right',marginRight:20,cursor:'pointer'}} 
                onClick={()=>{
                  setAddingCate(true);
                  setTimeout(() => {
                    addCateRef.current.input.focus();
                  }, 0);
                }}
              />
            </div>
            <Input 
              ref={addCateRef}
              style={{display:addingCate?'block':'none'}}
              value={addCateName}
              onChange={(e)=>{
                setAddCateName(e.target.value);
              }}
              onBlur={()=>{
                setAddingCate(false);
              }}
              onPressEnter={async ()=>{
                const datas = _.cloneDeep(toJS(treeData));
                let has = false;
                datas.map(item=>{
                  if (item.name===addCateName) {
                    has = true;
                  }
                  return item;
                });
                if (has) {
                  message.error('组件分类名称已存在，请修改！');
                }else{
                  datas.push({name:addCateName,children:[]});
                  const res = await updateTreeDataService({categories:datas});
                  if (res && res.code==0) {
                    setAddingCate(false);
                    getTreeData();
                    setAddCateName('');
                  }
                }
                
              }}
            ></Input>
            <div className={styles.allBtn + ' '+ (selectedData.category==='全部组件'?styles.selected:'')}
              onClick={
                ()=>{
                  setSelectedData({
                    category:'全部组件',
                    subCategory:''
                  });
                }
              }
            >全部组件</div>
            <div className={styles.treeWrap}>
              <HandleMenu/>
            </div>
          </div>
        )}
      >
        <div className={styles.rightWraper}>
          <Row className={styles.handleWrap}>
            <Col span={5}>
              <span>项目名称：</span>
              <Select
                showSearch
                style={{width:150}}
                placeholder="请选择"
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="001">项目001</Option>
                <Option value="002">项目002</Option>
                <Option value="003">项目003</Option>
              </Select>
            </Col>
            <Col span={5}>
              <Input style={{width:'90%'}} placeholder='输入组件名称/项目名称/描述/标签/创建人查找组件'></Input>
            </Col>
            <Col span={5}>
              <span>开发状态：</span>
              <Select
                placeholder='请选择'
                style={{ width: 150 }}
              >
                <Option value="1">开发中</Option>
                <Option value="2">已交付</Option>
              </Select>
            </Col>
            <Col span={5}>
              <span>组件类别：</span>
              <Select
                placeholder='请选择'
                style={{ width: 150 }}
              >
                <Option value="1">全部</Option>
                <Option value="2">基础组件</Option>
              </Select>
            </Col>
            <Col span={2} push={2}>
              <Button 
                type='primary' 
                style={{borderRadius:'5px'}}
                onClick={()=>{
                  setAddModalvisible(true);
                }}
              >添加组件</Button>
            </Col>
          </Row>
          <div className={styles.listWraper}>
            <Table columns={columns} dataSource={listData?toJS(listData).list:[]} rowKey="id"/>
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
        <Detail/>
      </AbreastLayout>
  </>;
});
export default ComponentDevelop;
