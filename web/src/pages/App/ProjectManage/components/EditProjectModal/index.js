import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ form, project = {}, onSave, onCancel }) {
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
                onSave &&
                  onSave({
                    ...project,
                    ...values,
                  });
              }
            });
          }
        }}
        size="middle"
        title={
          project && project.id > 0
            ? intl.formatMessage({
                id: "pages.projectManage.edit",
                defaultValue: "编辑项目",
              })
            : intl.formatMessage({
                id: "pages.projectManage.create",
                defaultValue: "添加项目",
              })
        }
        visible={true}
      >
        <Form
          labelCol={{
            xs: { span: 6 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
          }}
          initialValues={project || {}}
        >
          <Form.Item label="项目标识" name={"projectMark"}>
            {getFieldDecorator("projectMark", {
              initialValue: project.projectMark,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "项目标识",
                },
                {
                  pattern: /^[a-zA-Z]{6,20}$/,
                  message: "请输入a~z的6~20位的字符，不限制大小写",
                },
              ],
            })(
              <Input
                disabled={project && project.id > 0}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "项目标识"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="项目名称" name={"name"}>
            {getFieldDecorator("name", {
              initialValue: project.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "项目名称",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "项目名称"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="行业" name={"industry"}>
            {getFieldDecorator("industry", {
              initialValue: project.industry,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
                      defaultValue: "请选择",
                    }) + "行业",
                },
              ],
            })(
              <Select
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业"
                }
              >
                <Select.Option value="1">1</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="描述" name={"describe"}>
            {getFieldDecorator("describe", {
              initialValue: project.describe,
            })(
              <Input.TextArea
                row={3}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "描述"
                }
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
