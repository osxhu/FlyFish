import React from "react";
import { Modal, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";

export default Form.create({ name: "FORM_IN_USER_MODAL" })(
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
              id: "pages.userManage.edit",
              defaultValue: "编辑用户",
            })
            : intl.formatMessage({
              id: "pages.userManage.create",
              defaultValue: "添加用户",
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
          <Form.Item label="用户名" name={"username"}>
            {getFieldDecorator("username", {
              initialValue: project.username,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "用户名",
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
                  }) + "用户名"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="用户邮箱" name={"mail"}>
            {getFieldDecorator("email", {
              initialValue: project.email,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "用户邮箱",
                },
                {
                  pattern: /^[A-Za-zd0-9]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/,
                  message: "请输入正确的邮箱格式",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "用户邮箱"
                }
              />
            )}
          </Form.Item>

          <Form.Item label="手机号" name={"phone"}>
            {getFieldDecorator("phone", {
              initialValue: project.phone,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "手机号",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "手机号"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="密码" name={"password"}>
            {getFieldDecorator("password", {
              initialValue: project.password,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "密码",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "密码"
                }
              />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
);
