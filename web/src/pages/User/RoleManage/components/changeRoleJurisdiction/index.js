import React from "react";
import { Modal, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Tree } from 'antd';
const { TreeNode } = Tree;
import styles from './style.less';
export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleJurisdiction({ checkProject, form, project = {}, onSave, onCancel }) {
        const new1 = project.menus.map(item => item);
        let menu = [
            { name: '应用创建', url: '/path1/1', children: [{ name: '项目管理', url: '/path1/1-1' }, { name: '应用开发', url: '/path1/1-2' }, { name: '组件开发', url: '/path1/1-3' }] },
            { name: '模板库', url: '/path1/2', children: [{ name: '组件库', url: '/path1/2-1', }, { name: '应用模板库', url: '/path1/2-2', }] },
            { name: '用户管理', url: '/path1/3', children: [{ name: '用户列表', url: '/path1/3-1', }, { name: '角色列表', url: '/path1/3-2', }, { name: '分组列表', url: '/path1/3-3', }, { name: '权限配置', url: '/path1/3-4' }] }
        ];
        const intl = useIntl();
        const onSelect = (selectedKeys, info) => {
            onSave && onSave(selectedKeys);
        };
        let sendarr = [];
        const onCheck = (checkedKeys, info) => {
            sendarr = { menus: checkedKeys };
        };
        let checkarr = [];
        let arr1 = menu.map((item, index) => {
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
                    {/* <TreeNode title="应用创建" >
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
                    </TreeNode> */}
                    {arr1}
                </Tree>
            </Modal>
        );
    }
);
