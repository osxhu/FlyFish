import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
  function EditRoleModal({ form, role = {}, onSave, onCancel }) {
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
                    ...role,
                    ...values,
                  });
              }
            });
          }
        }}
        size="middle"
        title={
          role && role.id > 0
            ? intl.formatMessage({
              id: "pages.roleManage.edit",
              defaultValue: "编辑角色",
            })
            : intl.formatMessage({
              id: "pages.roleManage.create",
              defaultValue: "添加角色",
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
          initialvalues={role || {}}
        >
          <Form.Item label="角色名" name={"rolename"}>
            {getFieldDecorator("rolename", {
              initialValue: role.rolename,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "角色名",
                },
                {
                  pattern: /^[a-zA-Z]{6,20}$/,
                  message: "请输入a~z的6~20位的字符，不限制大小写",
                },
              ],
            })(
              <Input
                disabled={role && role.id > 0}
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "角色名"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="描述" name={"describe"}>
            {getFieldDecorator("describe", {
              initialValue: role.describe,
            })(
              <Input.TextArea
              autoSize={{minRows:4}}
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
