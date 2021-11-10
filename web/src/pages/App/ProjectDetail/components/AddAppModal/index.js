import React from "react";
import { Modal, Input, Select, Form ,Tag} from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;

export default Form.create({ name: "FORM_IN_PROJECT_MODAL" })(
  function AddAppModal({ form, project = {}, onSave, onCancel }) {
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
            xs: { span: 6 },
            sm: { span: 6 },
          }}
          wrapperCol={{
            xs: { span: 16 },
            sm: { span: 16 },
          }}
          initialvalues={project || {}}
        >
          <Form.Item label="应用名称	" name={"name"}>
            {getFieldDecorator("name", {
              initialValue: project.name,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "应用名称	",
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
                  }) + "应用名称	"
                }
              />
            )}
          </Form.Item>
          <Form.Item label="所属项目" name={"projectId"}>
            {getFieldDecorator("projectId", {
              initialValue: project.projectId,
              rules: [
                {
                  required: true,
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
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
                <Select.Option value="1">1</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="标签" name={"tags"}>
            {getFieldDecorator("tags", {
              initialValue: project.tags,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseSelect",
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
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
            )}
          </Form.Item>
          <Form.Item label="开发状态" name={"state"}>
            {getFieldDecorator("state", {
              initialValue: project.state,
            })(
              <Select
              placeholder={
                intl.formatMessage({
                  id: "common.pleaseSelect",
                  defaultValue: "请选择",
                }) + "开发状态"
              }
            >
              <Select.Option value="1">1</Select.Option>
            </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
