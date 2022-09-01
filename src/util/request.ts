import { TOKEN_KEY } from '@/constant/storKey';
import type { AxiosResponse, RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { notification } from 'antd';
import { getStorage } from './storage';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '方法不被允许',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',

};


// 运行时配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 10000,
  // headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {

      // console.log('error: ', error);
      if (opts?.skipErrorHandler) { throw error; }


      const response = error.response
      const errData = response?.data as API.API_TYPE<null>
      if (errData) {
        if (errData.code !== 400) {
          notification.error({
            message: `请求错误 ${errData.code}`,
            description: codeMessage[errData.code],
          });
          if (errData.code === 403 || errData.code === 401) {
            const params = new URLSearchParams()
            params.set('redirect', location.pathname + location.search)
            history.push({ pathname: '/login', search: params.toString() })
          }
        } else {
          const message = errData.message
          if (typeof message === 'string') {
            notification.error({
              message: `请求错误 ${errData.code}`,
              description: message,
            });
          } else {
            const text = JSON.stringify(Object.fromEntries(Object.entries(message).filter((_, idx) => idx === 0))).replace(/\{|\}/g, '')
            notification.error({
              message: `请求错误 `,
              description: text
            });
          }
        }
        return
      }
      if (!response) {
        notification.error({
          description: '您的网络发生异常，无法连接服务器',
          message: '网络异常',
        });
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {

      // 添加token
      const token = getStorage(TOKEN_KEY) || ''
      const headers = { Authorization: `Bearer ${token}` };
      // 拦截请求配置，进行个性化处理。
      // const url = config.url.concat('?token = 123');
      return { ...config, headers };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      // const { data } = response;

      // if (!data.success) {
      //   message.error('请求失败！');
      // }

      return response;
    },
  ],
};
