import React, { useState, useRef, useEffect } from 'react';
import styles from './style.less';
import { Button,message,Modal,Popover } from 'antd';
import store from "../../model/index";
import { observer } from "@chaoswise/cw-mobx";
import { installPackagesService,compileComponentService } from '../../services';
import ReleaseComponent from './releaseComponent';

const CodeDevelop = observer((props)=>{
  const {
    setDeveloping,
    releaseModalVisible,
    setReleaseModalVisible,
    getListData
  } = store;
  const { developingData } = store;

  const [previewRandom, setPreviewRandom] = useState(0);
  const [layout, setLayout] = useState('row');
  const [moveMode, setMoveMode] = useState(false);
  const [layerX, setLayerX] = useState(0);
  const [layerY, setLayerY] = useState(405);
  const mainDiv = useRef();

  useEffect(() => {
    window.addEventListener('message',function(event){
      if (event && event.data) {
        if ("vscode_compile" ===event.data.event) {
          //编译
          compileComponent();
        }
      }
    })
    setLayerX(mainDiv.current.clientWidth/2 - 5)
  }, []);
  const installPackages = async (id)=>{
    const res = await installPackagesService(id);
    if (res && res.code===0) {
      message.success('依赖安装成功!')
    }else{
      message.error(res.msg)
    }
  }
  const compileComponent = async ()=>{
    const res  = await compileComponentService(developingData.id);
    if (res && res.code===0) {
      message.success('编译成功!');
      setPreviewRandom(Math.random());
    }else{
      message.error(res.msg);
    }
  }
  const LayoutRowIcon = ()=>(
    <svg width="40px" height="30px" viewBox="0 0 1024 1024" version="1.1"><path fill="#333333" d="M804.1 64H219.9c-47.8 0-86.6 38.2-86.6 85.2v725.6c0 47.1 38.7 85.2 86.6 85.2h584.2c47.8 0 86.6-38.2 86.6-85.2V149.2c0-47-38.8-85.2-86.6-85.2zM219.9 832.2V191.8c0-23.5 19.4-42.6 43.3-42.6h213.4v725.6H263.2c-23.9 0-43.3-19.1-43.3-42.6z m584.2 0c0 23.6-19.4 42.6-43.3 42.6H569.3V149.2h191.5c23.9 0 43.3 19.1 43.3 42.6v640.4z"  /></svg>
  ) 
  const LayoutColIcon = ()=>(
    <svg width="40px" height="30px" viewBox="0 0 1024 1024" version="1.1"><path fill="#333333" d="M804.1 64H219.9c-47.8 0-86.6 38.1-86.6 85.2v725.6c0 47 38.7 85.2 86.6 85.2h584.2c47.8 0 86.5-38.2 86.5-85.2V149.2c0.1-47.1-38.7-85.2-86.5-85.2z m-540.9 85.2h497.7c23.9 0 43.3 19 43.3 42.6V454H219.9V191.8c0-23.5 19.4-42.6 43.3-42.6z m497.6 725.6H263.2c-23.9 0-43.3-19.1-43.3-42.6V546.6h584.2v285.6c0 23.5-19.4 42.6-43.3 42.6z"  /></svg>
  )
  return <div className={styles.wrap}>
    <div className={styles.handleWrap}>
      <div>
        <label style={{fontWeight:800}}>组件名称：</label>
        {developingData.name}
      </div>
      <div className={styles.btnwrap}>
        <Button type="primary" style={{marginRight:20}}
          onClick={()=>{
            installPackages(developingData.id)
          }}
        >安装依赖</Button>
        <Button
          type='primary'
          onClick={()=>{setReleaseModalVisible(true)}}
          style={{marginRight:20}}
        >更新上线</Button>
        <Button
          type="primary"
          onClick={()=>{
            props.history.push({pathname:`/app/${developingData.id}/component-record`,state:{name:developingData.name}});
          }}
        >查看组件记录</Button>
        {
          <Popover content='切换布局'>
            <div 
              title="切换布局"
              style={{cursor:'pointer',margin:'0 10px'}}
              onClick={()=>{setLayout(layout=='row'?'col':'row')}}
            >
              {
                layout=='row'?<LayoutRowIcon />:<LayoutColIcon />
              }
            </div>
          </Popover>
        }
      </div>
    </div>
    <div ref={mainDiv} className={styles.main} style={{flexDirection:layout=='row'?'row':'column',height:layout=='row'?'100%':1000}}
      onMouseMove={(e)=>{
        if (moveMode) {
          if (layout=='row') {
            setLayerX(e.nativeEvent.layerX)
          }
          if (layout=='col') {
            setLayerY(e.nativeEvent.layerY)
          }
        }
      }}
    >
      <div className={styles.CodeWrap} 
        style={{
          width:layout=='col'?'100%':layerX-5,
          height:layout=='col'?(layerY-5):'100%',
          marginBottom:layout=='row'?10:0
        }}>
        <div style={{padding:'5px 15px'}}>编辑区</div>
        <iframe
          className={styles.vscodeFrame}
          name='vscode'
          src={`http://${window.location.hostname}:8080/?folder=/www/components/${developingData.id}/v-current`} 
          frameBorder={0}
        >
        </iframe>
      </div>
      <div className={layout=='row'?styles.rowBar:styles.colBar}
        onMouseDown={(e)=>{
          setMoveMode(true)
        }}
        onMouseUp={(e)=>{
          setMoveMode(false)
        }}
      ></div>
      <div className={styles.previewWrap} 
        style={{
          width:layout=='col'?'100%':`calc(100% - ${layerX+10}px)`,
          height:layout=='col'?(1000-(layerY-5)):'100%'
          }}>
        <div style={{padding:'5px 15px'}}>可视化区</div>
        <iframe 
          className={styles.previewFrame} 
          name='preview' 
          src={`http://${window.location.hostname}:7001/components/${developingData.id}/v-current/editor.html?random=${previewRandom}`} 
          frameBorder={0}
        >
        </iframe>
      </div>
      <div style={{position:'absolute',width:'100%',height:'calc(100% - 30px)',top:30,display:moveMode?'block':'none'}}
        onMouseUp={()=>{
          setMoveMode(false)
        }}
      ></div>
    </div>
    <Modal
      visible={releaseModalVisible}
      footer={null}
      title='更新上线'
      width='40%'
      onCancel={()=>{setReleaseModalVisible(false)}}
    >
      <ReleaseComponent/>
    </Modal>
  </div>
})

export default CodeDevelop;