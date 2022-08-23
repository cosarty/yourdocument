import { request } from 'umi'



/**
 * 登录请求
 * @param payload  {email  password}
 * @returns API.Login
 */
export const login = async (payload: Payload.Login) => await request<API.Login['data']>('/api/user/login', {
  method: 'POST', data: payload
})

/**
 * 返回状态码如果不是两百就跳过
 * @returns 获取当前登录信息
 * 
 */
export const getCurrentUser = async (skipErrorHandler: boolean = true) => await request<API.CurrentUser['data']>('/api/user/getCurrent', {
  method: 'GET',
  skipErrorHandler
}).catch(err => {
  if (err.response) {
    const er = err.response.data as API.CurrentUser
    return Promise.reject(er.code)
  }
})


export default { login, getCurrentUser }