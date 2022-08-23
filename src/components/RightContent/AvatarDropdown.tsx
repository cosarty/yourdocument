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

/**
 * 退出登录，并且将当前的 url 保存
 */
/* const loginOut = async () => {
  // 退出登录
  // await outLogin();
  const { search, pathname } = history.location;
  const urlParams = new URL(window.location.href).searchParams;
  /** 此方法会跳转到 redirect 参数所在的位置 */
//   const redirect = urlParams.get('redirect');
//   // Note: There may be security issues, please note
//   if (window.location.pathname !== '/user/login' && !redirect) {
//     history.replace({
//       pathname: '/user/login',
//       search: stringify({
//         redirect: pathname + search,
//       }),
//     });
//   }
// };

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
      // history.push(`/account/${key}`);
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
        <Avatar className={styles.avatar} src={defaultAvtar} alt='avatar' />
        <span className={`${styles.name} anticon`}>{''}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
