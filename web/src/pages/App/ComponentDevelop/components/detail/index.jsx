import React from 'react';
import styles from './style.less';
import { Button } from 'antd';

const Detail = function(props){
  const { show } = props;

  return <div className={styles.wrap} style={{display:show?'block':'none'}}>
    <div className={styles.titleWrap}>
      <div>
        <span>组件预览</span>
      </div>
      <div>
        <Button>保存</Button>
        <Button style={{marginLeft:20}}>更新发布</Button>
      </div>
    </div>
  </div>
}

export default Detail;