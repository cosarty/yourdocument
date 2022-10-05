import { isMobile } from '@/util/utils';
import { useModel, useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Access, useAccess } from 'umi';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [searchParams] = useSearchParams();
  const { canLogin } = useAccess();
  const [searchText, setSearchText] = useState<string>(searchParams.get('q') || '');
  const { gotoLogin } = useModel('user');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const login = (
    <>
      <Button
        type='link'
        onClick={() => {
          gotoLogin();
        }}
      >
        登录
      </Button>
    </>
  );

  return (
    <div className={styles.right}>
      <div style={{ minWidth: '30vw' }}>
        <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder='题目搜索'
          value={searchText}
          onChange={(value) => {
            setSearchText(value);
          }}
        />
      </div>
      <div className={styles.user}>
        <Access accessible={canLogin} fallback={login}>
          <Link to='/addQuestion' target={'_blank'}>
            {!isMobile() && (
              <>
                <Link to={'/account/mypaper'} target='_blank'>
                  创建试卷
                </Link>
                <Button type='primary' size='large' className={styles.btn}>
                  上传题目
                </Button>
              </>
            )}
          </Link>
          <Avatar />
        </Access>
      </div>
    </div>
  );
};
export default GlobalHeaderRight;
