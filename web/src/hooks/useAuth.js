import { useState, useEffect } from 'react';
import { getAuthApi } from '@/services/demo';
import store from '@/stores/globalStore';

const useAuth = () => {

  const [authMap, setAuthMap] = useState({});
  const [status, setStatus] = useState('loading'); // loading 获取权限中, error 获取权限失败 

  useEffect(() => {
    getAuthApi().then(res => {
      if(res && res.code === 100000) {
        const authMap = {};
        res.data.forEach(item => {
          authMap[item.code] = item.selected;
        });
        setAuthMap(authMap);
        // 挂载权限数据到store
        store.updateAuth(authMap);
        // 改变状态
        setStatus('');
      } else {
        setStatus('error');
      }
    }).catch(error => {
      if(error && error.response) {
        if(error.response.status !== 401) {
          setStatus('error');
        }
      }
    });
  }, []);


  return {
    auth: authMap,
    status,
    getAuth: code => {
      if(code) {
        return authMap[code];
      }
      return true;
    } 
  };
};

export default useAuth;
