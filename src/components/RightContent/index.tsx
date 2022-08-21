import { useModel, useSearchParams } from '@umijs/max';
import { Button } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeaderSearch from '../HeaderSearch';
import Avatar from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [searchParams] = useSearchParams();
  const [searchText, setSearchText] = useState<string>(searchParams.get('q') || '');
  if (!initialState || !initialState.settings) {
    return null;
  }

  return (
    <div className={styles.right}>
      <div style={{ width: '40vw' }}>
        <HeaderSearch
          // className={`${styles.action} ${styles.search}`}
          placeholder='题目搜索'
          value={searchText}
          onChange={(value) => {
            setSearchText(value);
          }}
          onSearch={() => {
            setSearchText('');
          }}
        />
      </div>
      <div>
        <Link to='/'>
          <Button type='primary' size='large'>
            上传题目
          </Button>
        </Link>
        <Avatar />
      </div>
    </div>
  );
};
export default GlobalHeaderRight;
