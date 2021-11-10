import React from 'react';
import styles from './style.less';
import { Form,Input,Select,Button,Row,Col,Icon,Popover } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const AddComponent = function(props){
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: { span:4 },
    wrapperCol: { span:18 }
  };
  return <Form
    {...formItemLayout}  
  >
    <Form.Item label="组件名称">
      {getFieldDecorator('name', {
        rules: [
          {
            required: true,
            message: '组件名称不能为空！'
          }
        ]
      })(<Input />)}
    </Form.Item>
    <Form.Item label="组件标识">
      {getFieldDecorator('logo', {
        rules: [
          {
            required: true,
            message: '组件标识不能为空！'
          }
        ]
      })(<Input />)}
    </Form.Item>
    <Form.Item label={<>
      <Popover 
        placement='left' 
        content={
          <>
            <p style={{width:200}}>
              组件类别用于区分项目组件或基础组件，默认选择"项目组件"，即特地昂项目可以使用的组件。
            </p>
            <p style={{width:200}}>
              基础组件默认所有项目都可以使用；只有管理员才能将组件修改为基础组件。
            </p>
          </>
        }>
        <Icon type="question-circle" style={{margin:'8px 5px'}}/>
      </Popover>
      <span>组件类别</span>
    </>}>
      {getFieldDecorator('name', {
        rules: [
          {
            required: true,
            message: '组件类别不能为空！'
          }
        ]
      })(<Input />)}
    </Form.Item>
    <Form.Item label="所属项目">
      {getFieldDecorator('project', {
        rules: [
          {
            required: true,
            message: '所属项目不能为空！'
          }
        ]
      })(<Select>
        <Option value='1'>XXX项目</Option>
      </Select>)}
    </Form.Item>
    <Form.Item label="组件分类">
      {getFieldDecorator('cate', {
        rules: [
          {
            required: true,
            message: '组件分类不能为空！'
          }
        ]
      })(<Select>
        <Option value='1'>图表类</Option>
      </Select>)}
    </Form.Item>
    <Form.Item label="标签">
      {getFieldDecorator('tag', {
        rules: []
      })(<Select>
        <Option value='1'>标签1</Option>
      </Select>)}
    </Form.Item>
    <Form.Item label="开发状态">
      {getFieldDecorator('status', {
        rules: []
      })(<Select>
        <Option value='1'>开发中</Option>
      </Select>)}
    </Form.Item>
    <Form.Item label="描述">
      {getFieldDecorator('desc', {
        rules: []
      })(<TextArea rows={4}/>)}
    </Form.Item>
    <Row>
      <Col span={2} push={18}>
        <Button>取消</Button>
      </Col>
      <Col span={2} push={18}>
        <Button type='primary' htmlType='submit'>保存</Button>
      </Col>
    </Row>
  </Form>
}

export default Form.create({name:'addComponent'})(AddComponent);