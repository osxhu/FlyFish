import React from "react";
import { Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Card, List, Icon, Button, Input, Pagination, Tooltip, Tag, Select, Col, Row } from 'antd';
import styles from './index.less';
const { Meta } = Card;
const TagColorMap = {
    0: '#f50',
    1: '#2db7f5',
    2: '#87d068'
};
const EnumScreenStatus = {
    developing: {
        label: '开发中',
        value: 0
    },
    testing: {
        label: '测试中',
        value: 1
    },
    complete: {
        label: '已交付',
        value: 2
    }
};
const computedTagWordByStatus = (status) => {
    const statusItem = Object.entries(EnumScreenStatus).find(([key, { label, value }]) => value === status);
    return statusItem ? statusItem[1].label : EnumScreenStatus.developing.label;
};
export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
    function EditProjectModal({ value }) {
        let arr = value.map((item, index) => <Col span={8} key={index}>
            <Card
                cover={
                    <>
                        <Tag className={styles.tag} color={TagColorMap[item.status]}>{computedTagWordByStatus(item.status)}</Tag>
                        <img
                            alt="example"
                            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                        />
                    </>
                }
                actions={(() => {
                    const actions = [
                        <div key="development" className={styles.mybtn}>开发应用</div>,
                        <div key="look" className={styles.mybtn}>预览应用</div>,
                        <div key="copy" className={styles.mybtn}>复制应用</div>,
                        <div key="export" className={styles.mybtn}>导出应用</div>,
                        <div key="change" className={styles.mybtn}>编辑信息</div>,
                        <div key="delete" className={styles.mybtn}>删除</div>
                    ];
                    const actionsOk = [
                        <div key="look" className={styles.mybtn}>预览应用</div>,
                        <div key="export" className={styles.mybtn}>导出应用</div>

                    ];
                    return item.state === 1 ? actionsOk : actions;
                })()}
            >
                <Meta
                    title={item.title}
                    description={<div>
                        <p title={item.development}>当前开发人：{item.development || '暂无'}</p>
                        <p title={item.create}>创建人：{item.create || '暂无'}</p>
                        <p title={item.create}>标签：{item.create || '暂无'}</p>
                    </div>}
                />

            </Card></Col>);
        return (
            <Row justify="space-around" gutter={['16', '16']} style={{ margin: '10px' }} className={styles.cardList}>
                {arr}
            </Row>
        );
    }
);
