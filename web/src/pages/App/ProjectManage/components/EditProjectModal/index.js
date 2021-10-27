import React from "react";
import { Modal, Input, Select } from "@chaoswise/ui";
import { Form, MegaLayout } from "@chaoswise/ui/lib/Antd4Form";
import { useIntl } from "react-intl";

export default function EditProjectModal({ project, onSave, onCancel }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  return (
    <Modal
      draggable
      onCancel={() => onCancel && onCancel()}
      onOk={() => {
        if (form) {
          form.validateFields();
          let result = form.getFieldsError();
          if (result.length === 0) {
            onSave &&
              onSave({
                ...project,
                ...form.getFieldsValue(),
              });
          }
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
      <Form form={form} initialValues={project || {}}>
        <MegaLayout labelCol={6} wrapperCol={12}>
          <Form.Item
            label="项目标识"
            name={"projectMark"}
            rules={[
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
            ]}
          >
            <Input
              disabled={project && project.id > 0}
              placeholder={
                intl.formatMessage({
                  id: "common.pleaseInput",
                  defaultValue: "请输入",
                }) + "项目标识"
              }
            />
          </Form.Item>
          <Form.Item
            label="项目名称"
            name={"name"}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "项目名称",
              },
            ]}
          >
            <Input
              placeholder={
                intl.formatMessage({
                  id: "common.pleaseInput",
                  defaultValue: "请输入",
                }) + "项目名称"
              }
            />
          </Form.Item>
          <Form.Item
            label="行业"
            name={"industry"}
            rules={[
              {
                required: true,
                message:
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "行业",
              },
            ]}
          >
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
          </Form.Item>
          <Form.Item label="描述" name={"describe"}>
            <Input.TextArea
              row={3}
              placeholder={
                intl.formatMessage({
                  id: "common.pleaseInput",
                  defaultValue: "请输入",
                }) + "描述"
              }
            />
          </Form.Item>
        </MegaLayout>
      </Form>
    </Modal>
  );
}
