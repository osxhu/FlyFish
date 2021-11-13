/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-11-09 10:45:26
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-11-13 19:00:36
 */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState,useEffect, useRef } from "react";
import { AbreastLayout } from "@chaoswise/ui";
import { Icon,Select,Input,Table,Popover,Button,Modal,Row,Col,message,Popconfirm,Upload } from 'antd';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "./model/index";

import { successCode } from "@/config/global";
import styles from "./assets/style.less";
import { FormattedMessage, useIntl } from "react-intl";
import HandleMenu from "./components/handleMenu";
import AddComponent from "./components/addComponent";
import EditComponent from "./components/editComponent";
import Detail from "./components/detail";
import _ from "lodash";
import { updateTreeDataService,copyComponentService,deleteComponentService,downloadComponentService } from './services';
import moment from 'moment';
import * as CONSTANT from './constant';
import API from '../../../services/api/component';

const {Option} = Select;

const ComponentDevelop = observer(() => {
  const columns = [
    {
      title: '组件类型',
      dataIndex: 'type',
      key: 'type',
      render:(text)=>{
      return <span>{CONSTANT.componentType_map_ch[text]}</span>;
      }
    },
    {
      title: '组件名称',
      dataIndex: 'name',
      key: 'name',
      render:(text,record)=>{
        return <a className={styles.nameLink} onClick={()=>{
          setViewId(record.id);
          setDetailShow(true);
        }}>{text}</a>;
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
      key: 'developStatus',
      render:(text)=>{
      return <span>{CONSTANT.componentDevelopStatus_map_ch[text]}</span>;
      }
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
              <div
                onClick={()=>{
                  setCopyId(record.id);
                  setCopyModalvisible(true);
                }}
              >复制组件</div>
              <div
                onClick={()=>{
                  setUploadId(record.id);
                  setImportModalvisible(true);
                }}
              >导入源码</div>
              <div
                onClick={()=>{
                  exportCode(record.id);
                }}
              >导出源码</div>
              {
                userInfo.isAdmin?
                <Popconfirm
                  title="确定上传组件至组件库?上传后该组件可公开被查看及使用。"
                  onConfirm={()=>{
                    message.success('上传成功!');
                  }}
                  okText="是"
                  cancelText="否"
                >
                  <div>上传组件库</div>
                </Popconfirm>
                :null
              }
              <div 
                onClick={()=>{
                  setEditData(record);
                  setEditModalvisible(true);
                }}
              >编辑信息</div>
              <div
                onClick={()=>{
                  deleteComponet(record.id);
                }}
              >删除</div>
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
    setAddModalvisible,
    setEditModalvisible,
    setImportModalvisible,
    getTreeData,
    getListData,
    setSelectedData,
    getUserInfo,
    setSearchName,
    setSearchKey,
    setSearchStatus,
    getListDataWithCate,
    setViewId,
    setEditData,
    getProjectsData,
    getTagsData
  } = store;
  const { addModalvisible,editModalvisible,importModalvisible,treeData,listData,selectedData,searchName,searchKey,searchStatus,userInfo } = store;
  // const { list,curPage,pageSize,total } = listData;

  const [addCateName, setAddCateName] = useState('');
  const [addingCate, setAddingCate] = useState(false);
  const [copyModalvisible, setCopyModalvisible] = useState(false);
  const [copyId, setCopyId] = useState('');
  const [copyName, setCopyName] = useState('');
  const [uploadId, setUploadId] = useState('');
  const addCateRef = useRef();

  // 请求列表数据
  useEffect(() => {
    getUserInfo();
    getProjectsData();
    getTagsData();
    getTreeData();
    getListData();
  }, []);
  useEffect(() => {
    getListData();
  }, [selectedData]);
  const copyComponent = async (id,name)=>{
    const res = await copyComponentService(id,name);
    if(res && res.code==0){
      message.success('复制成功');
      setCopyModalvisible(false);
      getListData();
    }else{
      message.error(res.msg||'复制失败！');
    }
  };
  const deleteComponet = async (id)=>{
    const res = await deleteComponentService(id);
    if(res && res.code==0){
      message.success('删除成功');
      getListData();
    }else{
      message.error(res.msg||'删除失败！');
    }
  };
  const exportCode = async (id)=>{
    const res = await downloadComponentService(id);
    
    const $link = document.createElement("a");
    $link.href = URL.createObjectURL(new Blob([res],{type:'application/zip'}));
    $link.download = `component.zip`;
    $link.click();
    document.body.appendChild($link);
    document.body.removeChild($link); // 下载完成移除元素
    window.URL.revokeObjectURL($link.href); // 释放掉blob对象
  };
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
                  setSearchName('');
                  setSearchKey('');
                  setSearchStatus('');
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
              <span>组件名称：</span>
              <Input placeholder='请输入'
              style={{width:150}}
                value={searchName}
                onChange={(e)=>{setSearchName(e.target.value);}}
                onPressEnter={()=>{
                  setSearchKey('');
                  getListDataWithCate();
                }}
              ></Input>
            </Col>
            <Col span={8}>
              <Input style={{width:'90%'}} placeholder='输入组件名称/项目名称/描述/标签/创建人查找组件'
                value={searchKey}
                onChange={(e)=>{
                  setSearchKey(e.target.value);
                }}
                onPressEnter={()=>{
                  setSearchName('');
                  getListDataWithCate();
                }}
              ></Input>
            </Col>
            <Col span={5}>
              <span>开发状态：</span>
              <Select
                placeholder='请选择'
                style={{ width: 150 }}
                value={searchStatus}
                onChange={(val)=>{
                  setSearchStatus(val);
                  getListDataWithCate();
                }}
              >
                <Option value='all'>全部</Option>
                <Option value="doing">开发中</Option>
                <Option value="online">已交付</Option>
              </Select>
            </Col>
            {/* <Col span={5}>
              <span>组件类别：</span>
              <Select
                placeholder='请选择'
                style={{ width: 150 }}
                value={searchCate}
                onChange={(val)=>{
                  setSearchCate(val);
                  getListData();
                }}
              >
                <Option value="1">全部</Option>
                <Option value="2">基础组件</Option>
              </Select>
            </Col> */}
            <Col span={2} push={4}>
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
        <Modal
          title="编辑组件"
          visible={editModalvisible}
          footer={null}
          width='50%'
          onCancel={()=>{setEditModalvisible(false);}}
        >
          <EditComponent/>
        </Modal>
        <Modal
          title="复制组件"
          visible={copyModalvisible}
          // footer={null}
          width='30%'
          onCancel={()=>{setCopyModalvisible(false);}}
          onOk={()=>{
            copyComponent(copyId,copyName);
          }}
        >
          <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <label>组件名称：</label>
            <Input value={copyName}
              style={{width:300}}
              onChange={(e)=>{
                setCopyName(e.target.value);
              }}
            ></Input>
          </div>
        </Modal>
        <Modal
          title="导入组件源码"
          visible={importModalvisible}
          footer={null}
          width={500}
          onCancel={()=>{setImportModalvisible(false);}}
        >
          <div style={{display:'flex',justifyContent:'center'}}>
          <Upload
            accept=".zip"
            // fileList={[]}
            action={API.UPLOAD_COMPONENT+'/'+uploadId}
            headers={{authorization: 'authorization-text'}}
            method="post"
            name="file"
            onChange={({file,fileList,event})=>{
              if (event && event.percent==100) {
                message.success('上传成功！');
                setImportModalvisible(false);
              }
            }}
          >
            <Button>
              <Icon type="upload" />点击上传压缩包
            </Button>
          </Upload>
          </div>
        </Modal>
        <Detail/>
      </AbreastLayout>
  </>;
});
export default ComponentDevelop;
