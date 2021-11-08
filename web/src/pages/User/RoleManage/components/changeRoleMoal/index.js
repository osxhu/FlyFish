import React from "react";
import { Modal, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { Transfer, Row, Col } from 'antd';
export default Form.create({ name: "FORM_IN_USER_MODAL" })(
    function ChangeRoleModal({ form, project = {}, onSave, onCancel }) {
        const intl = useIntl();
        let state = {
            mockData: [],
            targetKeys: [],
        };
        const getMock = () => {
            const targetKeys = [];
            const mockData = [];
            for (let i = 0; i < 20; i++) {
                const data = {
                    key: i.toString(),
                    title: `content${i + 1}`,
                    description: `description of content${i + 1}`,
                    chosen: Math.random() * 2 > 1,
                };
                if (data.chosen) {
                    targetKeys.push(data.key);
                }
                mockData.push(data);
            }
            state.mockData = mockData;
            state.targetKeys = targetKeys;
        };
        const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

        const handleChange = targetKeys => {
            state.targetKeys = targetKeys;
        };

        const handleSearch = (dir, value) => {
            console.log('search:', dir, value);
        };
        getMock();

        return (
            <Modal
                width={900}
                draggable
                onCancel={() => onCancel && onCancel()}
                onOk={() => {

                }}
                size="middle"
                title='管理成员'
                visible={true}
            >
                <Row type="flex" justify="center">
                    <Col>
                        <Transfer
                            dataSource={state.mockData}
                            showSearch
                            listStyle={{
                                width: 350,
                                height: 300,
                            }}
                            titles={['待添加成员', '已添加成员']}
                            searchPlaceholder="搜索成员"
                            operations={['添加', '移除']}
                            filterOption={filterOption}
                            targetKeys={state.targetKeys}
                            onChange={handleChange}
                            onSearch={handleSearch}
                            render={item => item.title}
                        />                  
                    </Col>
                </Row>

            </Modal>
        );
    }
);
