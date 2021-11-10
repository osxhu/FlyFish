import React from "react";
import { Drawer, List, Avatar, Divider, Col, Row } from 'antd';
import { useIntl } from "react-intl";
import stylus from './index.less';
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
        state.visible=true;
    };

    const onClose = () => {
        state.visible=false;
    };
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
          <p style={pStyle}>组件名称:折线面积图</p>
          <p style={pStyle}>组件编号:1</p>
          <p style={pStyle}>行业:通用/航空</p>
          <p style={pStyle}>标签:标签1/标签2</p>
          <p style={pStyle}>描述:这是一个测试通过的折线面积图</p>
          <Divider />
          <p style={pStyle}>Company</p>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Position" content="Programmer" />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Responsibilities" content="Coding" />
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Department" content="XTech" />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Supervisor" content={<a>Lin</a>} />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Skills"
                content="C / C + +, data structures, software engineering, operating systems, computer networks, databases, compiler theory, computer architecture, Microcomputer Principle and Interface Technology, Computer English, Java, ASP, etc."
              />
            </Col>
          </Row>
          <Divider />
          <p style={pStyle}>Contacts</p>
          <Row>
            <Col span={12}>
              <DescriptionItem title="Email" content="AntDesign@example.com" />
            </Col>
            <Col span={12}>
              <DescriptionItem title="Phone Number" content="+86 181 0000 0000" />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <DescriptionItem
                title="Github"
                content={
                  <a href="http://github.com/ant-design/ant-design/">
                    github.com/ant-design/ant-design/
                  </a>
                }
              />
            </Col>
          </Row>
        </Drawer>
      </div>
    );
}
