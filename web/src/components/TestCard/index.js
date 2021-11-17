import React from 'react';
import { Form, Popconfirm } from "@chaoswise/ui";
import { Card, Tag, Col, Row, Icon, Avatar, Empty,Tooltip } from 'antd';
const { Meta } = Card;
import styles from './index.less';
import { EnumScreenStatus } from '@/config/global';
import { observer, toJS } from "@chaoswise/cw-mobx";
import {wordlimit}from '@/config/global';
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
    function BasicCard({ onDelete,setActiveCard, addOwn, checkCard, value, state, showStateTag, children, deleteFlagMethod, canDelete, canAdd }) {
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
        const tradesArr = (trades) => {
            return trades.map((item, index) => {
                if (index !== trades.length - 1) {
                    return item.name + ',';
                } else {
                    return item.name;
                }
            });
        };
        let [checkid, setCheckId] = React.useState('');
        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '10px' }} className={styles.cardList}>
                {
                    value.list && value.list.length > 0 ? value.list.map((item, index) => <Col span={8} key={index}>
                        <Card
                        onClick={()=>{setActiveCard&&setActiveCard(item);}}
                            style={{ boxShadow: checkid == item.id ? '3px 3px 3px 3px #dedede' : null }}
                            cover={
                                <>
                                    {
                                        canDelete ? <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                                            onDelete && onDelete(item);
                                            deleteFlagMethod(false);
                                        }}>
                                            <Tag className={styles.deleteTag} color='red' >-</Tag>
                                        </Popconfirm> : null
                                    }
                                    {
                                        canAdd ? <Tag className={styles.deleteTag} color="#2db7f5" onClick={() => {
                                            let projects = item.projects.map(item => item.id);
                                            addOwn && addOwn(item.id, projects);
                                        }}>+</Tag> : null
                                    }
                                    {
                                        !Array.isArray(children) && !showStateTag ? null : <Tag className={styles.tag} color={TagColorMap[item.status]}>{computedTagWordByStatus(item.status)}</Tag>
                                    }
                                    <img
                                        onClick={() => { checkCard && checkCard(item.id), setCheckId(item.id); }}
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                </>
                            }
                            actions={childrenArr}
                        >
                            <Meta
                                onClick={() => { checkCard && checkCard(item.id), setCheckId(item.id); }}
                                title={(() => {
                                    if (!children) return `组件名称:${item.name || '暂无'}`;
                                    if (state) {
                                        return `模板名称:${item.name || '暂无'}`;
                                    } else {
                                        return `应用名称:${item.name || '暂无'}`;
                                    }
                                })()}
                                description={(() => {
                                    const apply = [
                                        <div key='apply'>
                                            <p >当前开发人：{item.updater || '暂无'}</p>
                                            <p >创建人：{item.creator || '暂无'}</p>
                                            <p >标签：{item.create || '暂无'}</p>
                                        </div>
                                    ];
                                    const actionsOk = [
                                        <div key='template'>
                                            <p className='titleOverflow'>模板编号：{item.id || '暂无'}</p>
                                            <p >行业：{item.trades && tradesArr(item.trades) || '暂无'}</p>
                                        </div>
                                    ];
                                    const applyList = [
                                        <div key='apply'>
                                            <p className='titleOverflow'>组件编号：{item.id || '暂无'}</p>
                                            <Tooltip title={item.desc}>
                                                <p className='titleOverflow'>描述：{item.desc || '暂无'}</p>
                                            </Tooltip>
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
                    </Col>) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                }
            </Row>
        );

    }
);