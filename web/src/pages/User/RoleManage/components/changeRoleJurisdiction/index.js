import React from "react";
import { Modal, Form, message } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Tree } from 'antd';
import {
    toJS
} from "@chaoswise/cw-mobx";
const { TreeNode } = Tree;
import styles from './style.less';
export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleJurisdiction({ close, checkProject, menuList, form, project = {}, onSave, onCancel }) {
        let menuListData = toJS(menuList);
        // 默认选中的节点url
        const new1 = project.menus.map(item => item.url);
        const onSelect = (selectedKeys, info) => {
            onSave && onSave(selectedKeys);
        };
        let sendarr = [];
        sendarr = { menus: project.menus };
        // 选中组合数据
        const onCheck = (checkedKeys, event) => {
            let sendMenuArr = event.checkedNodes.map(item => {
                return {
                    name: item.props.title,
                    url: item.key
                };
            });
            sendarr = { menus: sendMenuArr };
        };
        // 默认展开所有一级
        let checkarr = [];
        let arr1 = menuListData && menuListData.map((item, index) => {
            checkarr.push(item.url);
            let arr2 = item.children.map((item, index) => {
                return (
                    <TreeNode title={item.name} key={item.url} />
                );
            });
            return (
                <TreeNode title={item.name} key={item.url}>
                    {arr2}
                </TreeNode>
            );
        });
        return (
            <Modal
                draggable
                onCancel={() => onCancel && onCancel()}
                onOk={() => {
                    onSave && onSave(sendarr);

                }}
                size="middle"
                title='设置栏目权限'
                visible={true}
            >
                <Tree
                    className={styles.roleModal}
                    checkable
                    defaultExpandedKeys={checkarr}
                    defaultCheckedKeys={new1}
                    onSelect={onSelect}
                    onCheck={onCheck}
                >
                    {arr1}
                </Tree>
            </Modal>
        );
    }
);
