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
        const new1 = project.menus.map(item => item);
        const onSelect = (selectedKeys, info) => {
            onSave && onSave(selectedKeys);
        };
        let sendarr = [];
        sendarr = { menus: menuListData };
        const onCheck = (checkedKeys, info) => {
            sendarr = { menus: checkedKeys };
        };
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
