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
    userInfo,
    setCurPage,
    setPageSize
  } = store;
  const [data, setData] = useState([]);
  const addinput = useRef();
  const editInput = useRef();

  const [addCateName, setAddCateName] = useState('');
  const [editName, setEditName] = useState('');
  useEffect(() => {
    if (treeData) {
      const data = _.cloneDeep(toJS(treeData));
      setData(
        data.map(item=>{
          item.showBtn = false;
          item.expand = defaultExpandAll;
          item.focus = false;
          item.adding = false;
          item.editing = false;
          item.children?item.children.map(item=>{
            item.showBtn = false;
            item.editing = false;
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
        console.log();
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
              {
                v.editing?
                <Input
                  style={{height:28,marginLeft:0}}
                  ref={editInput}
                  className={styles.addingInput}
                  value={editName}
                  onChange={(e)=>{setEditName(e.target.value)}}
                  onBlur={(e)=>{
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.editing=false;
                        }
                        return v1;
                      })
                    })
                  }}
                  onPressEnter={async (e)=>{
                    const datas = _.cloneDeep(toJS(treeData));
                    datas.map((v4,k4)=>{
                      if (k4===k) {
                        v4.name=editName
                      }
                      return v4;
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      setData(olddata=>{
                        return olddata.map((v1,k1)=>{
                          if (k1===k) {
                            v1.adding=false;
                          }
                          return v1;
                        })
                      })
                      getTreeData();
                      setEditName('');
                      message.success('修改成功！')
                    }
                    
                  }}
                >
                </Input>
                :<span className={styles.firstTitle}>{v.name}</span>
              }
            </div>
            <div className={styles.firstBtnWrap}>
              <Icon type="form" style={{display:v.showBtn?'inline':'none'}}
                onClick={()=>{
                  setEditName(v.name)
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.editing=true;
                      }
                      return v1;
                    })
                  })
                  setTimeout(() => {
                    editInput.current.input.focus();
                  }, 0);
                }}
              />
              <Icon type="delete" style={{display:userInfo.isAdmin?(v.showBtn?'inline':'none'):'none'}}
                onClick={async ()=>{
                  let has = false;
                  data.map((v3,k3)=>{
                    if (k3===k) {
                      const {children=[]}=v3;
                      if (children && children.length>0) {
                        has=true;
                      }
                    }
                    return v3;
                  })
                  if (has) {
                    message.warning('无法删除，该组件分类存在二级分类.请删除全部二级分类.')
                  }else{
                    const datas = treeData.filter((v3,k3)=>{
                      return k!==k3
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      getTreeData();
                      message.success('删除成功！')
                    }
                  }
                }}
              />
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
                setCurPage(1);
                setSelectedData({
                  category:v.id,
                  subCategory:v2.id
                })
              }}
            >
              <div>
              {
                v2.editing?
                <Input
                  style={{height:28,marginLeft:0}}
                  ref={editInput}
                  className={styles.addingInput}
                  value={editName}
                  onChange={(e)=>{setEditName(e.target.value)}}
                  onBlur={(e)=>{
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.children.map((v3,k3)=>{
                            if (k2===k3) {
                              v3.editing=false;
                            }
                          })
                        }
                        return v1;
                      })
                    })
                  }}
                  onPressEnter={async (e)=>{
                    const datas = _.cloneDeep(toJS(treeData));
                    datas.map((v4,k4)=>{
                      if (k4===k) {
                        v4.children.map((v5,k5)=>{
                          if (k5===k2) {
                            v5.name=editName
                          }
                        })
                      }
                      return v4;
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      setData(olddata=>{
                        return olddata.map((v1,k1)=>{
                          if (k1===k) {
                            v1.children.map((v3,k3)=>{
                              if (k2===k3) {
                                v3.editing=false;
                              }
                            })
                          }
                          return v1;
                        })
                      })
                      getTreeData();
                      setEditName('');
                      message.success('修改成功！')
                    }
                    
                  }}
                >
                </Input>
                :<span>{v2.name}</span>
              }
              </div>
              <div className={styles.secondBtnWrap}>
                <Icon type="form" style={{display:v2.showBtn?'inline':'none'}}
                  onClick={(e)=>{
                    e.stopPropagation()
                    setEditName(v2.name)
                    setData(olddata=>{
                      return olddata.map((v1,k1)=>{
                        if (k1===k) {
                          v1.children.map((v3,k3)=>{
                            if (k2===k3) {
                              v3.editing = true;
                            }
                          })
                        }
                        return v1;
                      })
                    })
                    setTimeout(() => {
                      editInput.current.input.focus();
                    }, 0);
                  }}
                />
                <Icon type="delete" style={{display:userInfo.isAdmin?(v2.showBtn?'inline':'none'):'none'}}
                  onClick={async (e)=>{
                    e.stopPropagation()
                    const _treeData = _.cloneDeep(toJS(treeData));
                    const datas = _treeData.map((v3,k3)=>{
                      if (k3===k) {
                        v3.children = v3.children.filter((v4,k4)=>{
                          return k2!==k4;
                        })
                      }
                      return v3;
                    })
                    const res = await updateTreeDataService({categories:datas});
                    if (res && res.code==0) {
                      getTreeData();
                      message.success('删除成功!')
                    }
                  }}
                />
              </div>
            </div>
          }):null}
          {
            v.adding?<Input 
              ref={addinput}
              className={styles.addingInput}
              value={addCateName}
              onChange={(e)=>{setAddCateName(e.target.value)}}
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
              onPressEnter={async (e)=>{
                const datas = _.cloneDeep(toJS(treeData));
                datas.map((v4,k4)=>{
                  if (k4===k) {
                    v4.children.push({name:addCateName})
                  }
                  return v4;
                })
                const res = await updateTreeDataService({categories:datas});
                if (res && res.code==0) {
                  setData(olddata=>{
                    return olddata.map((v1,k1)=>{
                      if (k1===k) {
                        v1.adding=false;
                      }
                      return v1;
                    })
                  })
                  getTreeData();
                  setAddCateName('');
                  message.success('添加成功！')
                }
                
              }}
            />:null
          }
        </div>
      })
    }
  </div>
})

export default HandleMenu;