import React, { useState, useRef, useEffect } from 'react';
import styles from './style.less';
import { Button,message } from 'antd';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { installPackagesService,compileComponentService } from '../../services';

const CodeDevelop = observer(()=>{
  const {
    setDeveloping
  } = store;
  const { developingData } = store;

  const [previewRandom, setPreviewRandom] = useState(0);
  
  useEffect(() => {
    window.addEventListener('message',function(event){
      console.log(event);
      if (event && event.data) {
        if ("vscode_compile" ===event.data.event) {
          //编译
          compileComponent();
        }
      }
    })
  }, []);
  const installPackages = async (id)=>{
    const res = await installPackagesService(id);
    if (res && res.code===0) {
      message.success('依赖安装成功!')
      setPreviewRandom(Math.random());
    }else{
      message.error(res.msg)
    }
  }
  const compileComponent = async ()=>{
    const res  = await compileComponentService(developingData.id);
    if (res && res.code===0) {
      message.success('编译成功!');
    }else{
      message.error(res.msg);
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
            installPackages(developingData.id)
          }}
        >安装依赖</Button>
        <Button>更新上线</Button>
      </div>
    </div>
    <div className={styles.main}>
      <div className={styles.CodeWrap}>
        <iframe
          name='vscode'
          src={`http://${window.location.hostname}:8080/?folder=/data/app/flyfish-2.0/www/components/${developingData.id}/current`} 
          // src={`http://127.0.0.1:8080/?folder=/Users/jonny/Documents/test`}
          width = "100%" 
          height = "100%" 
          frameBorder={0}
        />
      </div>
      <div className={styles.previewWrap}>
        <iframe 
          name='preview'
          src={`http://${window.location.hostname}:7001/components/${developingData.id}/current/editor.html?random=${previewRandom}`} 
          width = "100%" 
          height = "100%" 
          frameBorder={0}></iframe>
      </div>
    </div>
  </div>
})

export default CodeDevelop;