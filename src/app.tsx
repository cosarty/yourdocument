/* eslint-disable @typescript-eslint/no-use-before-define */
import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { request as requestConf } from '@/util/request';
import { PageLoading, Settings as LayoutSettings } from '@ant-design/pro-components';
import { matchRoutes, RequestConfig, RunTimeLayoutConfig } from '@umijs/max';

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
    const user = await getCurrentUser();

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

export function onRouteChange({ clientRoutes, location }: { clientRoutes: any; location: any }) {
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    // document.title = route?.title || '首页';
  }
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: '张江航-试题君',
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
      // console.log(history);
      // // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 自定义 404 页面
    noFound: <div>noFoun</div>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
      if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = requestConf;
