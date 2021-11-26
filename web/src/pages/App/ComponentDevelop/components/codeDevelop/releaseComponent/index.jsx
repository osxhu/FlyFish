import React, { useState } from 'react';
import store from "../../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { Form,Radio,Input,Icon,Popover,Button,message } from 'antd';
import * as CONSTANT from '../../../constant';
import { publishComponentService } from '../../../services';
const { TextArea } = Input;

const ReleaseComponent = observer((props)=>{

  const { 
    developingData,
    setReleaseModalVisible
  } = store;
  const { getFieldDecorator,validateFields } = props.form;

  const [isCompatible, setisCompatible] = useState(true);
  const submitClick=(e)=>{
    e.preventDefault();
    validateFields(async (err,values)=>{
      if (!err) {
        if (developingData.developStatus===CONSTANT.DEVELOPSTATUS_DOING) {
          values.compatible = true;
        }
        const res = await publishComponentService(developingData.id,values);
        if (res && res.code===0) {
          message.success('更新上线成功！')
          setReleaseModalVisible(false)
        }else{
          message.error(res.msg);
        }
      }
    })
  }

  return <Form 
    labelCol={{span:6}} 
    wrapperCol={{span:16}}
    style={{padding:20}}
    onSubmit={submitClick}
    >
    {
      developingData.developStatus===CONSTANT.DEVELOPSTATUS_DOING?
      <Form.Item label='版本号'>
        {
          getFieldDecorator('no',{
            rules:[
              {
                required:true,
                message:'版本号不能为空！'
              }
            ]
          })(
            <Input placeholder='建议版本号：V1.0.0'></Input>
          )
        }
      </Form.Item>:
      <>
        <Form.Item
          style={{display:'flex'}}
         label={
          <>
            <Popover placement='left' content={
              <>
                <p>
                  是，则所有使用该组件的应用会自动升级该组件版本。
                </p>
                <p>
                  否，则使用该组件的应用不会自动升级组件。
                </p>
              </>
            }>
              <Icon type="question-circle" style={{margin:'13px 5px'}}/>
            </Popover>
            <span>兼容旧版本</span>
          </>
        }>
          {
            getFieldDecorator('compatible',{
              initialValue:true,
              rules:[
                {
                  required:true,
                  message:'请选择'
                }
              ]
            })(
              <Radio.Group 
                onChange={(e)=>{
                  setisCompatible(e.target.value)
                }}
              >
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            )
          }
        </Form.Item>
        {
          isCompatible?null:<Form.Item label='版本号'>
            {
              getFieldDecorator('no',{
                rules:[
                  {
                    required:true,
                    message:'版本号不能为空'
                  }
                ]
              })(
                <Input placeholder='请输入版本号'></Input>
              )
            }
          </Form.Item>
        }
        <Form.Item label='描述'>
          {
            getFieldDecorator('desc',{
              rules:[
                {
                  required:true,
                  message:'描述不能为空'
                }
              ]
            })(
              <TextArea placeholder='请输入描述' cols={4}/>
            )
          }
        </Form.Item>
      </>
    }
    <div style={{overflow:'hidden'}}>
      <Button htmlType='submit' type='primary' style={{marginLeft:20,float:'right'}}>确定</Button>
      <Button style={{float:'right'}} onClick={()=>{setReleaseModalVisible(false)}}>取消</Button>
    </div>
  </Form>
})

export default Form.create({name:'releaseComponent'})(ReleaseComponent)