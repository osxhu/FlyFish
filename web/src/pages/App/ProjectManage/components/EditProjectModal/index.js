import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
import { toJS } from "@chaoswise/cw-mobx";

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function EditProjectModal({ flag, form, onChange, project = {}, onSave, onCancel }) {
    const intl = useIntl();
    let newarr = toJS(project).trades;
    const { getFieldDecorator } = form;
    return (
      <Modal
        draggable
        onCancel={() => onCancel && onCancel()}
        onOk={() => {
          if (form) {
            form.validateFields((errors, values) => {
              if (errors == null) {
                let sendParams = {};
                for (let i in values) {
                  if (values[i]) {
                    sendParams[i] = values[i];
                  }
                }
                flag ? onSave &&
                  onSave({
                    ...values

                  }) : onChange &&
                onChange(project.id, {
                  ...values
                });
              }
            });
          }
        }}
        size="middle"
        title={
          !flag
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
          initialvalues={project || {}}
        >
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
          {flag ? <Form.Item label="行业" name={"trades"}>
            {getFieldDecorator("trades", {
              initialValue: project.trades,
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
                mode='tags'
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业"
                }
              >
                <Select.Option value="618de46a18859555b43ee212">电力</Select.Option>
                <Select.Option value="618de46a18859555b43ee222">水务</Select.Option>

              </Select>
            )}
          </Form.Item> : <Form.Item label="行业" name={"trades"}>
            {getFieldDecorator("trades", {
              initialValue: newarr,
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
                mode='tags'
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业"
                }
              >
                <Select.Option value="618de46a18859555b43ee212">电力</Select.Option>
                <Select.Option value="618de46a18859555b43ee222">水务</Select.Option>

              </Select>
            )}
          </Form.Item>}
          <Form.Item label="描述" name={"desc"}>
            {getFieldDecorator("desc", {
              initialValue: project.desc,
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
