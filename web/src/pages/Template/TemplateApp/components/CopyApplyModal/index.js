import React from "react";
import { Modal, message, Icon, Button, Input, Select, Form } from "@chaoswise/ui";
import { useIntl } from "react-intl";
const { Option } = Select;
// import API from '../../../services/api/component';
import { Upload } from 'antd';

export default Form.create({ name: "FORM_IN_COPY_APPLY_MODAL" })(
  function CopyApplyModal({ form, project = {}, onSave, onCancel }) {
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
        title='复制应用'
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
          <Form.Item label="应用名称" >
            {getFieldDecorator("title", {
              initialValue: project.title,
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
          <Form.Item label="所属项目" >
            {getFieldDecorator("industry", {
              initialValue: project.industry,
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
                <Select.Option value="1">1</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="行业" >
            {getFieldDecorator("trade", {
              initialValue: project.trade,
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
          <Form.Item label="应用logo" >
            {getFieldDecorator("logo", {
              initialValue: project.logo,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseUpload",
                      defaultValue: "请上传",
                    }) + "应用logo",
                },
              ],
            })(
              // <Upload
              //   accept=".zip"
              //   // fileList={[]}
              //   // action={API.UPLOAD_COMPONENT+'/'+uploadId}
              //   headers={{ authorization: 'authorization-text' }}
              //   method="post"
              //   name="file"
              //   onChange={({ file, fileList, event }) => {
              //     if (event && event.percent == 100) {
              //       message.success('上传成功！');
              //     }
              //   }}
              // >
              //     <Button style={{ marginRight: '10px' }} type="primary">上传文件</Button>
              //     (支持拓展名：png，jpg，peg，gif)

              // </Upload>
              <Upload action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                headers={
                  { authorization: 'authorization-text' }
                }
                isImageUrl={true}
                accept="image/gif, image/jpeg,image/jpeg/png,image/jpg,image/peg"
              >
                <Button style={{ marginRight: '10px' }} type="primary">上传文件</Button>
                (支持拓展名：png，jpg，peg，gif)
              </Upload>,

            )}
          </Form.Item>
          <Form.Item label="标签" >
            {getFieldDecorator("tag", {
              initialValue: project.tag,
              rules: [
                {
                  message:
                    intl.formatMessage({
                      id: "common.pleaseInput",
                      defaultValue: "请输入",
                    }) + "标签",
                },
              ],
            })(
              <Input
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseInput",
                    defaultValue: "请输入",
                  }) + "标签"
                }
              >
              </Input>
            )}
          </Form.Item>

          <Form.Item label="开发状态" >
            {getFieldDecorator("state", {
              initialValue: 'demo',
            })(
              <Select
                placeholder={
                  intl.formatMessage({
                    id: "common.pleaseSelect",
                    defaultValue: "请选择",
                  }) + "开发状态"
                }
              >
                <Option value="demo">demo</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" disabled>
                  Disabled
                </Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal >
    );
  }
);
