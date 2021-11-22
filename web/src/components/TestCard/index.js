import React from 'react';
import { Form, Popconfirm } from "@chaoswise/ui";
import { Card, Tag, Col, Row, Icon, Avatar, Empty, Tooltip } from 'antd';
const { Meta } = Card;
import styles from './index.less';
import { TAG_COLORS, APP_DEVELOP_STATUS } from '@/config/global';
import { observer, toJS } from "@chaoswise/cw-mobx";
import { wordlimit } from '@/config/global';
const computedTagWordByStatus = (status) => {
    return APP_DEVELOP_STATUS.find(item => item.id === status).name;
};
const computedTagColorByStatus = (status) => {
    return TAG_COLORS.find(item => item.id === status).color;
};
export default Form.create({ name: "BASIC_CARD" })(
    function BasicCard({number, onDelete, setActiveCard, addOwn, checkCard, value, state, showStateTag, actions, canDelete, canAdd }) {
        
        const tradesArr = (trades) => {
            if (trades.length === 0) {
                return '暂无';
            } else {
                return trades.map((item, index) => {
                    if (index !== trades.length - 1) {
                        return item.name + ',';
                    } else {
                        return item.name;
                    }
                });
            }
        };
        let [checkid, setCheckId] = React.useState('');
        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '10px' }} className={styles.cardList}>
                {
                    value && value.list && value.list.length > 0 ? value.list.map((item, index) => <Col span={number||8} key={index}>
                        <Card
                            onClick={() => {

                                setActiveCard && setActiveCard(item);

                            }}
                            style={{ boxShadow: checkid == item.id ? '3px 3px 3px 3px #dedede' : null }}
                            cover={
                                <>
                                    {
                                        canDelete ? <Popconfirm title="确认删除？" okText="确认" cancelText="取消" onConfirm={() => {
                                            onDelete && onDelete(item);
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
                                        !showStateTag ? null : <Tag className={styles.tag} color={computedTagColorByStatus(item.developStatus)}>{computedTagWordByStatus(item.developStatus)}</Tag>
                                    }
                                    <img
                                        onClick={() => {
                                            checkCard(item.id);
                                            setCheckId(item.id);
                                        }}
                                        alt="example"
                                        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                                    />
                                </>
                            }
                            actions={actions && actions(item).props.children}
                        >
                            <Meta
                                onClick={() => {
                                    checkCard(item.id);
                                    setCheckId(item.id);
                                }}
                                title={(() => {
                                    if (!actions) return `组件名称:${item.name || '暂无'}`;
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
                                            <p >标签：{item.tags && tradesArr(item.tags)}</p>
                                        </div>
                                    ];
                                    const actionsOk = [
                                        <div key='template'>
                                            <p className='titleOverflow'>模板编号：{item.id || '暂无'}</p>
                                            <p >行业：{item.trades && tradesArr(item.trades)}</p>
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
                                    if (!actions) return applyList;
                                    if (state) {
                                        return actionsOk;
                                    } else {
                                        return apply;
                                    }
                                })()}
                            />

                        </Card>
                    </Col>) :<div className='flexContainer'> <Empty /></div>
                }
            </Row>
        );

    }
);