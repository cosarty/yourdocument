import type { AxiosResponse, RequestConfig } from '@umijs/max';




// 运行时配置
export const request: RequestConfig = {
  // 统一的请求设定
  timeout: 1000,
  // headers: { 'X-Requested-With': 'XMLHttpRequest' },

  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;

      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
      } else {
        // 发送请求时出了点问题
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config) => {
      // 拦截请求配置，进行个性化处理。
      // const url = config.url.concat('?token = 123');
      return { ...config };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: AxiosResponse) => {
      // 拦截响应数据，进行个性化处理
      const { data } = response;

      // if (!data.success) {
      //   message.error('请求失败！');
      // }

      return data;
    },
  ],
};
