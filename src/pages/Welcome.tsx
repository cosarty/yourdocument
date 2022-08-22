import { request } from '@umijs/max';
import React, { useEffect } from 'react';
// import styles from './Welcome.less';

const Welcome: React.FC = () => {
  useEffect(() => {
    request('/api/questions/search', {
      method: 'POST',
      data: { orderKey: 'update_time' },
    }).then((res) => {
      console.log(res);
    });
  }, []);

  return (
    <>
      <div>我是欢迎</div>
    </>
  );
};

export default Welcome;
