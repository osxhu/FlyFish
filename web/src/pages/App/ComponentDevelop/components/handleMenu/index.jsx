import React from 'react';
import { Icon,Input } from 'antd';
import { useState,useEffect,useRef } from 'react';
import styles from './style.less';

const HandleMenu = function(props){
  const { dataSource=[],defaultExpandAll=true } = props;
  const [data, setData] = useState([]);
  const addinput = useRef();
  useEffect(() => {
    setData(
      dataSource.map(item=>{
        item.showBtn = false;
        item.expand = defaultExpandAll;
        item.focus = false;
        item.adding = false;
        item.children?item.children.map(item=>{
          item.showBtn = false;
          return item;
        }):null;
        return item;
      })
    )
  }, [dataSource]);
  return <div style={{position:'relative'}}>
    {
      data.map((v,k)=>{
        return <div key={v.value}>
          <div 
            className={styles.firstLine}
            onMouseOver={()=>{
              setData(olddata=>{
                return olddata.map((v1,k1)=>{
                  v1.showBtn=(k1===k);
                  return v1;
                })
              })
            }}
            onMouseOut={()=>{
              setData(olddata=>{
                return olddata.map((v1,k1)=>{
                  v1.showBtn=false;
                  return v1;
                })
              })
            }}
          >
            <div>
              <Icon 
                className={styles.expandBtn}
                type={v.expand?'caret-down':'caret-right'} 
                onClick={()=>{
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.expand=!v1.expand;
                      }
                      return v1;
                    })
                  })
                }}
              />
              <span className={styles.firstTitle}>{v.name}</span>
            </div>
            <div className={styles.firstBtnWrap}>
              <Icon type="form" style={{display:v.showBtn?'inline':'none'}}/>
              <Icon type="delete" style={{display:v.showBtn?'inline':'none'}}/>
              <Icon 
                type="plus-square" 
                className={styles.addBtn}
                onClick={()=>{
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.adding=true;
                      }
                      return v1;
                    })
                  })
                  setTimeout(() => {
                    addinput.current.input.focus();
                  }, 0);
                }}
              />
            </div>
          </div>
          {v.children?v.children.map((v2,k2)=>{
            return <div
              className={styles.secondLine}
              style={{display:v.expand?'flex':'none'}}
              onMouseOver={()=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.children.map((v3,k3)=>{
                        v3.showBtn=(k3===k2);
                        return v3;
                      })
                    }
                    return v1;
                  })
                })
              }}
              onMouseOut={()=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.children.map((v3,k3)=>{
                        v3.showBtn=false;
                        return v3;
                      })
                    }
                    return v1;
                  })
                })
              }}
            >
              <div>
                <span>{v2.name}</span>
              </div>
              <div className={styles.secondBtnWrap}>
                <Icon type="form" style={{display:v2.showBtn?'inline':'none'}}/>
                <Icon type="delete" style={{display:v2.showBtn?'inline':'none'}}/>
              </div>
            </div>
          }):null}
          {
            v.adding?<Input 
              ref={addinput}
              className={styles.addingInput}
              onBlur={(e)=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.adding=false;
                    }
                    return v1;
                  })
                })
              }}
              onPressEnter={(e)=>{
                setData(olddata=>{
                  return olddata.map((v1,k1)=>{
                    if (k1===k) {
                      v1.adding=false;
                    }
                    return v1;
                  })
                })
              }}
            />:null
          }
        </div>
      })
    }
  </div>
}

export default HandleMenu;