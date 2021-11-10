import React from 'react';
import { Form, Popconfirm } from "@chaoswise/ui";
import { Card, Tag, Col, Row, Icon, Avatar } from 'antd';
const { Meta } = Card;
import styles from './index.less';
import { EnumScreenStatus } from '@/config/global';
const TagColorMap = {
    0: '#f50',
    1: '#2db7f5',
    2: '#87d068'
};

const computedTagWordByStatus = (status) => {
    const statusItem = Object.entries(EnumScreenStatus).find(([key, { label, value }]) => value === status);
    return statusItem ? statusItem[1].label : EnumScreenStatus.developing.label;
};
export default Form.create({ name: "BASIC_CARD" })(
    function BasicCard({ value, state, show, children }) {
        let childrenArr;
        let childrenArrOther;
        if (children) {
            if (Array.isArray(children)) {
                childrenArr = children[0].props.children.map(item => item);
                childrenArrOther = children[1].props.children.map(item => item);
            } else {
                Array.isArray(children.props.children) ? childrenArr = children.props.children.map(item => item) : childrenArr = children.props.children.props.children.map(item => item);
            }
        }
        let arr = value.map((item, index) => <Col span={8} key={index}>
            <Card
                cover={
                    <>
                        {
                            !Array.isArray(children) && !show ? null : <Tag className={styles.tag} color={TagColorMap[item.status]}>{computedTagWordByStatus(item.status)}</Tag>
                        }
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    </>
                }
                actions={(() => {
                    if (!children) {
                        return '';
                    } else {
                        if (Array.isArray(children)) {
                            return item.status === 2 ? childrenArrOther : childrenArr;
                        } else {
                            return childrenArr;
                        }
                    }

                })()}
            >
                <Meta
                    title={(() => {
                        if (!children) return `组件名称:${item.title || '暂无'}`;
                        if (state) {
                            return `模板名称:${item.title || '暂无'}`;
                        } else {
                            return `应用名称:${item.title || '暂无'}`;
                        }
                    })()}
                    description={(() => {
                        const apply = [
                            <div key='apply'>
                                <p title={item.development}>当前开发人：{item.development || '暂无'}</p>
                                <p title={item.create}>创建人：{item.create || '暂无'}</p>
                                <p title={item.create}>标签：{item.create || '暂无'}</p>
                            </div>
                        ];
                        const actionsOk = [
                            <div key='template'>
                                <p title={item.development}>模板名称：{item.development || '暂无'}</p>
                                <p title={item.create}>模板编号：{index || '暂无'}</p>
                                <p title={item.create}>行业：{item.create || '暂无'}</p>
                            </div>
                        ];
                        const applyList = [
                            <div key='apply'>
                                <p title={item.create}>组件编号：{index || '暂无'}</p>
                                <p title={item.create}>描述：{item.create || '暂无'}</p>
                            </div>
                        ];
                        if (!children) return applyList;
                        if (state) {
                            return actionsOk;
                        } else {
                            return apply;
                        }
                    })()}
                />

            </Card>
        </Col>);
        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '10px' }} className={styles.cardList}>
                {arr}
            </Row>
        );

    }
);