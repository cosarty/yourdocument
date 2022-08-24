import { request } from 'umi'



/**
 * 登录请求
 * @param payload  {email  password}
 * @returns API.Login
 */
export const login = async (payload: Payload.Login) => await request<API.Login>('/api/user/login', {
  method: 'POST', data: payload
})

/**
 * 返回状态码如果不是两百就跳过
 * @returns 获取当前登录信息
 * 
 */
export const getCurrentUser = async (skipErrorHandler: boolean = true) => await request<API.CurrentUser>('/api/user/getCurrent', {
  method: 'GET',
  skipErrorHandler
}).catch(err => {
  if (err.response) {
    const er = err.response.data as API.CurrentUser
    return Promise.reject(er.code)
  }
})



export const sendMail = async (payload: Payload.SendMail) => await request<API.API_TYPE<null>>('/api/user/sendmail', {
  method: 'POST', data: payload
})


export const register = async (payload: Payload.Register) => await request<API.API_TYPE<null>>('/api/user/sign', {
  method: 'POST', data: payload
})


// 更新用户
export const updateUser = async (payload: Payload.UpdateUser) => await request<API.UpdateUser>('/api/user/updateCurrent', {
  method: 'PUT', data: payload
})


export default { login, getCurrentUser, register, updateUser }