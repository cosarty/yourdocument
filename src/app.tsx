import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { request as requestConf } from '@/util/request';
import { PageLoading, Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { getCurrentUser } from './services/users';

// const isDev = process.env.NODE_ENV === 'development';
// const loginPath = '/login';

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser['data'] | null;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
  loading?: boolean;
}> {
  const user = await getCurrentUser(false);

  return {
    currentUser: user?.data ?? null,
    settings: defaultSettings,
  };
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
    childrenRender: (children, props) => {
      if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = requestConf;
