import { request } from 'umi'

export type CurrentUser = {
  _id: string;
  nickname: string;
  email: string;
  gender: number;
  avtar_url: string;
  is_ban: boolean;
  profile: string;
  create_time: Date;
  update_time: Date;
  auth: 'super' | 'admin' | 'user';
  favours: string[],

}

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

// 封号
export const banUser = async (payload: { userId: string }) => await request<API.API_TYPE<null>>('/api/user/ban', {
  method: 'PUT', data: payload
})

// 获取用户列表 /api/user/getUserList
export const getUserList = async (payload: any) => await request<API.API_TYPE<{ userList: CurrentUser[], total: number }>>('/api/user/getUserList', {
  method: 'GET',
  params: payload
})

// 删除用户
export const deleteUser = async (payload: { userId: string }) => await request<API.API_TYPE<null>>('/api/user/delete', {
  method: 'DELETE', data: payload
})

export default { login, getCurrentUser, register, updateUser }