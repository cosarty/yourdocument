/* eslint-disable @typescript-eslint/no-unused-vars */
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import { Avatar, Menu } from 'antd';
import type { ItemType } from 'antd/lib/menu/hooks/useItems';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

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

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        // setInitialState((s) => ({ ...s, currentUser: undefined }));
        // loginOut();
        return;
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const menuItems: ItemType[] = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
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
        <Avatar size='small' className={styles.avatar} src={''} alt='avatar' />
        <span className={`${styles.name} anticon`}>{''}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
