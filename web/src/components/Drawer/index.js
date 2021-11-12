import React from "react";
import { Drawer, List, Avatar, Divider, Col, Row, Collapse, Table } from 'antd';
import { useIntl } from "react-intl";
import stylus from './index.less';
import { CWTable, Input, Button, message, Popconfirm } from "@chaoswise/ui";
const { Panel } = Collapse;
export default function BasicDrawer({ project = {} }) {
  const intl = useIntl();
  const pStyle = {
    fontSize: 16,
    color: 'rgba(0,0,0,0.85)',
    lineHeight: '24px',
    display: 'block',
    marginBottom: 16,
  };

  const DescriptionItem = ({ title, content }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: '22px',
        marginBottom: 7,
        color: 'rgba(0,0,0,0.65)',
      }}
    >
      <p
        style={{
          marginRight: 8,
          display: 'inline-block',
          color: 'rgba(0,0,0,0.85)',
        }}
      >
        {title}:
      </p>
      {content}
    </div>
  );
  let state = { visible: true };

  const showDrawer = () => {
    state.visible = true;
  };

  const onClose = () => {
    state.visible = false;
  };
  const columns1 = [
    {
      title: "属性名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
     
    },{
      title: "默认值",
      dataIndex: "basic",
      key: "basic",
     
    }];
    const basicTableListData=[
      {
        name:'111',
        trades:'店里',
        desc:'111',
        type:'类型一'
      },{
        name:'222',
        trades:'店里',
        desc:'111',
        type:'类型二'
      }
    ];
  const columns = [
    {
      title: '版本',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: text => <a>{text}</a>,
    },
    {
      title: '变更描述',
      align: 'center',
      dataIndex: 'age',
      key: 'age',
    }
  ];
  const data = [
    {
      key: '1',
      name: 'V1.0',
      age: '新增组件标识(v.10)',
    },
    {
      key: '2',
      name: 'V2.0',
      age: '新增属性...',
    }
  ];
  return (
    <div >
      <List
        dataSource={[
          {
            name: 'Lily',
          },
          {
            name: 'Lily',
          },
        ]}
        bordered
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <a onClick={showDrawer} key={`a-${item.id}`}>
                View Profile
              </a>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Avatar src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" />
              }
              title={<a href="https://ant.design/index-cn">{item.name}</a>}
              description="Progresser XTech"
            />
          </List.Item>
        )}
      />
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={state.visible}
        className={stylus.drawerContainer}
      >
        <p className={stylus.title}>组件预览</p>
        <div className={stylus.firstTitle}>组件名称:折线面积图</div>
        <div className={stylus.firstTitle}>组件编号:1</div>
        <div className={stylus.firstTitle}>行业:通用/航空</div>
        <div className={stylus.firstTitle}>标签:标签1/标签2</div>
        <div className={stylus.firstTitle}>描述:这是一个测试通过的折线面积图</div>
        <Row className={stylus.effectTitle}>
          <Col span={6}>
            <span>效果演示</span>
            {/* <DescriptionItem title="效果演示" content="Programmer" /> */}
          </Col>
          <Col span={18}>
            <span>提供组件标识：<span className={stylus.identification}>Computer English, Java, ASP</span></span>
          </Col>
        </Row>
        {/* 实时面板 */}
        <div className={stylus.screen}></div>
        {/* 版本 表格 */}
        <div className={stylus.table}>
          <Collapse defaultActiveKey={['1']} >
            <Panel header="版本更新历史" key="1">
              <Table pagination={false} size='small' bordered={true} columns={columns} dataSource={data} />
            </Panel>
          </Collapse>
        </div>
        {/* 数据格式表格 */}
        <div className={stylus.datatable}>
          <div>数据格式</div>
          <div className={stylus.littleTitle}>注释：选填,可填可不填</div>
          <CWTable
          bordered={true}
          size='small'
            columns={columns1}
            dataSource={basicTableListData}
            rowKey={(record) => record.name}
          ></CWTable>
        </div>
      </Drawer>

    </div>
  );
}
