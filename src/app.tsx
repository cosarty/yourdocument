import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { request as requestConf } from '@/util/request';
import type { Settings as LayoutSettings } from '@ant-design/pro-components';
import { PageLoading } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';

import defaultSettings from '../config/defaultSettings';

import { TOKEN_KEY } from './constant/storKey';
import { getCurrentUser } from './services/users';
import { getStorage, removeStorage } from './util/storage';

// const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser['data'] | null;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  loading?: boolean;
}> {
  try {
    let isThowrErr = false;
    // 添加权限提示

    if (!getStorage(TOKEN_KEY)) {
      return {
        currentUser: null,
        settings: defaultSettings,
      };
    }
    if (history.location.pathname === '/login' || history.location.pathname === '/') {
      isThowrErr = true;
    }

    const user = await getCurrentUser(isThowrErr);
    return {
      currentUser: user?.data ?? null,
      settings: defaultSettings,
    };
  } catch (error) {
    if (getStorage(TOKEN_KEY)) {
      removeStorage(TOKEN_KEY);
    }

    return {
      currentUser: null,
      settings: defaultSettings,
    };
  }
}

export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: '张江航-试题君',
    },
    footerRender: () => <Footer />,
    onPageChange: async () => {
      /**
       * 路由跳转做两件事情
       * 1、判断token是否存在
       * 2、判断用户是否合法 然后强制跳转 可选 先不做 就是为了用户体验 问题不大
       *
       */

      // 如果没有登录，重定向到 login
      if (!getStorage(TOKEN_KEY) && location.pathname === '/') {
        await setInitialState((s) => ({ ...s, currentUser: null }));
        // location.href = '/';
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 自定义 404 页面
    noFound: <div>noFound</div>,
    menuDataRender: (menuData: any) => {
      const { currentUser } = initialState ?? {};
      const access = {
        canAdmin: ['admin', 'super'].includes(currentUser?.auth ?? ''),
        canLogin: !!currentUser,
        canSuper: currentUser?.auth === 'super',
      };
      return menuData.filter((menuItem: any) => !menuItem.access || access[menuItem.access]);
    },
    childrenRender: (children) => {
      if (initialState?.loading) {
        return <PageLoading />;
      }
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = requestConf;
