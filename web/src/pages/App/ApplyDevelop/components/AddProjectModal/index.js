import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
import { observer, toJS } from '@chaoswise/cw-mobx';

import { APP_DEVELOP_STATUS } from '@/config/global';

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form, project = {}, projectList,tagList, addOrChangeFlag, onSave, onCancel }) {
    const intl = useIntl();
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                addOrChangeFlag ?
                  onSave &&
                  onSave({
                    ...project,
                    ...values,
                  }) : null;
              }
            });
          }
        }}
        size="middle"
        title={
          !addOrChangeFlag
            ? intl.formatMessage({
              id: "pages.applyDevelop.edit",
              defaultValue: "编辑应用",
            })
            : intl.formatMessage({
              id: "pages.applyDevelop.create",
              defaultValue: "添加应用",
            })
        }
        visible={true}
      >
        <Form
          labelCol={{
            xs: { span: 4 },
            sm: { span: 4 },
          }}
          wrapperCol={{
            xs: { span: 19 },
            sm: { span: 19 },
          }}
          initialvalues={project || {}}
        >
          <Form.Item label="应用名称" name={"name"}>
            {getFieldDecorator("name", {
              initialValue: project.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "应用名称",
                }
              ],
            })(
              <Input
                disabled={project && project.id > 0}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "应用名称"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="所属项目" name={"projectId"}>
            {getFieldDecorator("projectId", {
              initialValue: addOrChangeFlag?project.projectId:project.projects,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "请选择",
                    }) + "所属项目",
                },
              ],
            })(
              <Select
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "所属项目"
                }
              >
               {
                  projectList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
          <Form.Item label="标签" name={"tags"} >
            {getFieldDecorator("tags", {
              initialValue: addOrChangeFlag?project.tags:toJS(project.tags),
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请选择",
                    }) + "标签",
                },
              ],
            })(
              <Select mode="tags"
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "标签"
                }
              >
                {
                  tagList.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>

          <Form.Item label="开发状态" name={"developstatus"}>
            {getFieldDecorator("developstatus", {
              initialValue: project.developstatus,
            })(
              <Select
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "开发状态"
                }
              >
                {
                  APP_DEVELOP_STATUS.map(item => {
                    return <Option key={item.id} value={item.id}>{item.name}</Option>;
                  })
                }
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
