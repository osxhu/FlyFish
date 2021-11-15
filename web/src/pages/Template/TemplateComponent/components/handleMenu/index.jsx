import React from 'react';
import { Icon,Input,message } from 'antd';
import { useState,useEffect,useRef } from 'react';
import styles from './style.less';
import { observer,toJS } from "@chaoswise/cw-mobx";
import store from "../../model/index";
import _ from "lodash";
import { updateTreeDataService } from '../../services';

const HandleMenu = observer((props)=>{
  const { defaultExpandAll=true } = props;
  const { 
    treeData,
    getTreeData,
    setSelectedData,
    selectedData,
    userInfo
  } = store;
  const [data, setData] = useState([]);

  useEffect(() => {
    if (treeData) {
      const data = _.cloneDeep(toJS(treeData));
      setData(
        data.map(item=>{
          item.expand = defaultExpandAll;
          item.children?item.children.map(item=>{
            return item;
          }):null;
          return item;
        })
      )
    }
  }, [treeData]);
  return <div style={{position:'relative'}}>
    {
      data.map((v,k)=>{
        return <div key={k+''}>
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
            <div style={{display:'flex',alignItems:'center'}}>
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
             
            </div>
          </div>
          {v.children?v.children.map((v2,k2)=>{
            return <div
              key={k+'-'+k2}
              className={styles.secondLine + ((selectedData.category===v.name && selectedData.subCategory===v2.name)?(' '+styles.selected):'')}
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
              onClick={()=>{
                setSelectedData({
                  category:v.name,
                  subCategory:v2.name
                })
              }}
            >
              <div>
            <span>{v2.name}</span>
            
              </div>
              <div className={styles.secondBtnWrap}>
               
              </div>
            </div>
          }):null}
        </div>
      })
    }
  </div>
})

export default HandleMenu;