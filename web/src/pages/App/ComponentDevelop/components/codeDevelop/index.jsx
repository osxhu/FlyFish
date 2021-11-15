import React, { useState } from 'react';
import styles from './style.less';
import { Button,message } from 'antd';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { installPackagesService } from '../../services';

const CodeDevelop = observer(()=>{
  const {
    setDeveloping
  } = store;
  const { developingData } = store;
  
  const [saved, setSaved] = useState(false);
  
  const installPackages = async (id)=>{
    const res = await installPackagesService(id);
    if (res && res.code===0) {
      message.success('依赖安装成功!')
    }else{
      message.error(res.msg)
    }
  }


  return <div className={styles.wrap}>
    <div className={styles.handleWrap}>
      <div>
        <label style={{fontWeight:800}}>组件名称：</label>
        {developingData.name}
        <Button style={{marginLeft:20}}
          onClick={()=>{
            setDeveloping(false)
          }}
        >返回</Button>
      </div>
      <div>
        <Button type="primary" style={{marginRight:20}}
          onClick={()=>{
            installPackagesService(developingData.id)
          }}
        >安装依赖</Button>
        <Button disabled={!saved}>更新上线</Button>
      </div>
    </div>
    <div className={styles.main}>
      <div className={styles.CodeWrap}>
        <iframe id= 'child' src={`http://10.2.3.56:8080/?folder=/data/app/flyfish-2.0/components/${developingData.id}/current`} width = "100%" height = "100%" frameBorder={0}/>
      </div>
      <div className={styles.previewWrap}>

      </div>
    </div>
  </div>
})

export default CodeDevelop;