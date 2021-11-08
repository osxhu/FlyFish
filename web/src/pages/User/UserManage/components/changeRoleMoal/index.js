import React from "react";
import { Modal, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Tree } from 'antd';
const { TreeNode } = Tree;
import styles from './style.less';
export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleModal({ form, project = {}, onSave, onCancel }) {
        const intl = useIntl();
        const onSelect = (selectedKeys, info) => {
            console.log('selected', selectedKeys, info);
        };

        const onCheck = (checkedKeys, info) => {
            console.log('onCheck', checkedKeys, info);
        };
        return (
            <Modal
                draggable
                onCancel={() => onCancel && onCancel()}
                onOk={() => {

                }}
                size="middle"
                title='设置栏目权限'
                visible={true}
            >
                <Tree
                    className={styles.roleModal}
                    checkable
                    defaultExpandedKeys={['0-0', '0-2','0-1']}
                    defaultSelectedKeys={['0-0-0', '0-0-1']}
                    defaultCheckedKeys={['0-0-0', '0-0-1']}
                    onSelect={onSelect}
                    onCheck={onCheck}
                >
                    <TreeNode title="应用创建" key="0-0" >
                        <TreeNode title="项目管理" key="0-0-0-0" />
                        <TreeNode title="应用开发" key="0-0-0-1" />
                        <TreeNode title="组件开发" key="0-0-0-2" />
                    </TreeNode>
                    <TreeNode title="模板库" key="0-1">
                        <TreeNode title="组件库" key="0-1-0-0" />
                        <TreeNode title="应用模板库" key="0-1-0-1" />
                    </TreeNode>
                    <TreeNode title="用户管理" key="0-2">
                        <TreeNode title="用户列表" key="0-2-0-1" />
                        <TreeNode title="角色列表" key="0-2-0-2" />
                        <TreeNode title="分组列表" key="0-2-0-3" />
                        <TreeNode title="权限配置" key="0-2-0-4" />
                    </TreeNode>
                </Tree>
            </Modal>
        );
    }
);
