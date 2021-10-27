import React from 'react';
import useAuth from '@/hooks/useAuth';
import Loading from '@/components/Loading';

const authWrapper = (WrappedComponent) => {

  const Component = props => {

    const { getAuth, status } = useAuth();

    if(status === 'loading') {
      return (
        <Loading />
      );
    }
    if(status === 'error') {
      return '权限获取失败，请检查网络';
    }

    return <WrappedComponent getAuth={getAuth} {...props} />;
  };

  return Component;
  
};

export default authWrapper;
