/* eslint-disable @typescript-eslint/no-unused-vars */
import defaultAvtar from '@/assets/shitijun.png';
import { LogoutOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Menu } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { logout } = useModel('user');
  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        logout();
        return;
      }
    },
    [setInitialState],
  );

  const menuItems: ItemType[] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick} items={menuItems} />
  );

  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          className={styles.avatar}
          src={initialState?.currentUser?.avtar_url || defaultAvtar}
          onError={() => false}
          alt='avatar'
        />
        <span className={`${styles.name} anticon`}>{''}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
